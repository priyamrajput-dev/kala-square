import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ValidationError } from '../../common/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

export class UploadsService {
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

        await fs.mkdir(UPLOADS_DIR, { recursive: true });

        const ext = path.extname(file.filename) || '.jpg';
        const safeBase = path.basename(file.filename, ext).replace(/[^\w-]/g, '_');
        const uniqueId = crypto.randomUUID();
        const savedFilename = `${uniqueId}-${safeBase}${ext}`;
        const destination = path.join(UPLOADS_DIR, savedFilename);

        await fs.writeFile(destination, file.data);

        return {
            url: `/uploads/${savedFilename}`,
            filename: savedFilename,
        };
    }
}
