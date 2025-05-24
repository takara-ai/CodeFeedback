// Type definitions for Pyodide
export interface PyodideInterface {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: any;
  FS: any;
}

export interface PyodideConfig {
  indexURL: string;
  fullStdLib?: boolean;
  stdin?: () => string;
  stdout?: (text: string) => void;
  stderr?: (text: string) => void;
}

declare global {
  interface Window {
    loadPyodide: (config: PyodideConfig) => Promise<PyodideInterface>;
  }
}

export {};
