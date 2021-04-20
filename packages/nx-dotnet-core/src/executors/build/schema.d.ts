export interface BuildExecutorSchema {
  project: string;
  outputPath: string;
  configuration?: string;
  noRestore?: boolean;
}
