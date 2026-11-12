// Storage provider abstraction for file and asset uploads
// TODO: Implement S3 / Local storage provider in upcoming prompts
export interface StorageProvider {
  uploadFile(file: unknown): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<boolean>;
}

export const storage: Partial<StorageProvider> = {
  // TODO: Implement storage operations
};
