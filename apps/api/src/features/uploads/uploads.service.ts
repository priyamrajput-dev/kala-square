import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ValidationError } from '../../common/errors.js';
import { env } from '../../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

export class UploadsService {
    private getUploadDir(): string {
        return env.UPLOAD_DIR || DEFAULT_UPLOADS_DIR;
    }

    async handleUpload(file: {
        filename: string;
        mimetype: string;
        data: Buffer;
    }) {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new ValidationError('Invalid file type: Only JPG, PNG, and WebP images are permitted');
        }

        const maxBytes = 5 * 1024 * 1024; // 5MB
        if (file.data.length > maxBytes) {
            throw new ValidationError('File size exceeds 5MB limit');
        }

        const uploadDir = this.getUploadDir();
        await fs.mkdir(uploadDir, { recursive: true });

        const ext = path.extname(file.filename) || '.jpg';
        const safeBase = path.basename(file.filename, ext).replace(/[^\w-]/g, '_');
        const uniqueId = crypto.randomUUID();
        const savedFilename = `${uniqueId}-${safeBase}${ext}`;
        const destination = path.join(uploadDir, savedFilename);

        await fs.writeFile(destination, file.data);

        return {
            url: `/uploads/${savedFilename}`,
            filename: savedFilename,
        };
    }
}
