import express, { Request, Response } from 'express';
import cors from 'cors';
import { publishToHuggingFace } from './components/publish/publishToHuggingFace';

const app = express();
app.use(cors());
app.use(express.json());

interface PublishRequest {
  repo_id: string;
  app_type: 'static' | 'python' | 'nodejs';
  app_code: string;
  main_script?: string;
  token: string;
}

app.post('/publish', async (req: Request<{}, {}, PublishRequest>, res: Response) => {
  const { repo_id, app_type, app_code, main_script, token } = req.body;
  try {
    const url = await publishToHuggingFace({
      repoId: repo_id,
      appType: app_type,
      appCode: app_code,
      mainScript: main_script,
      token,
    });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));