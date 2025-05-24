import { promises as fs } from 'fs';
import * as path from 'path';
import { Hub, createRepo, uploadFiles } from '@huggingface/hub';
import { v4 as uuidv4 } from 'uuid';

interface PublishOptions {
  repoId: string; // e.g., "username/my-space"
  appType: 'static' | 'python' | 'nodejs';
  appCode: string; // Application code as a string
  mainScript?: string; // Main script name for Python apps (e.g., "app.py")
  token: string; // Hugging Face access token
}

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export async function publishToHuggingFace({
  repoId,
  appType,
  appCode,
  mainScript,
  token,
}: PublishOptions): Promise<string> {
  // Initialize Hugging Face Hub client
  const hub = new Hub({ accessToken: token });

  // Create a temporary directory
  const tmpDir = path.join(process.cwd(), 'temp', uuidv4());
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    // Copy template files based on app type
    const templateDir = path.join(process.cwd(), 'components', 'publish', 'templates', appType);
    if (!(await fs.stat(templateDir).then((stat) => stat.isDirectory()).catch(() => false))) {
      throw new Error(`Template directory for ${appType} not found`);
    }
    await copyDirectory(templateDir, tmpDir);

    // Write application code to appropriate file
    if (appType === 'static') {
      const codePath = path.join(tmpDir, 'index.html');
      await fs.writeFile(codePath, appCode);
    } else if (appType === 'python') {
      const scriptName = mainScript || 'app.py';
      const codePath = path.join(tmpDir, scriptName);
      await fs.writeFile(codePath, appCode);
      // Update Dockerfile with correct main script name
      const dockerfilePath = path.join(tmpDir, 'Dockerfile');
      let dockerfileContent = await fs.readFile(dockerfilePath, 'utf-8');
      dockerfileContent = dockerfileContent.replace('APP_NAME', scriptName);
      await fs.writeFile(dockerfilePath, dockerfileContent);
    } else if (appType === 'nodejs') {
      const codePath = path.join(tmpDir, 'index.js');
      await fs.writeFile(codePath, appCode);
    }

    // Create or update repository
    await createRepo(hub, {
      repo: { type: 'space', name: repoId },
      sdk: 'docker',
      private: false,
    }).catch((e) => {
      throw new Error(`Failed to create repository: ${e.message}`);
    });

    // Collect files to upload
    const files: Map<string, string | Uint8Array> = new Map();
    const walkDir = async (dir: string, prefix: string = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(prefix, entry.name);
        if (entry.isDirectory()) {
          await walkDir(fullPath, relativePath);
        } else {
          const content = await fs.readFile(fullPath);
          files.set(relativePath, content);
        }
      }
    };
    await walkDir(tmpDir);

    // Upload files to Hugging Face
    await uploadFiles(hub, {
      repo: { type: 'space', name: repoId },
      files,
      commit: {
        title: 'Initial commit from publish button',
        summary: 'Upload application code and Docker configuration',
      },
    }).catch((e) => {
      throw new Error(`Failed to upload to Hugging Face: ${e.message}`);
    });

    return `https://huggingface.co/spaces/${repoId}`;
  } finally {
    // Clean up temporary directory
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}