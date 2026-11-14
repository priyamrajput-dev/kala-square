import { z } from 'zod';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables (.env.production or .env)
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: resolve(__dirname, `../../${envFile}`) });
dotenv.config({ path: resolve(__dirname, `../../../../${envFile}`) });
dotenv.config(); // fallback to current process.env

const isProd = process.env.NODE_ENV === 'production';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(3001),
    HOST: z.string().default('0.0.0.0'),
    API_URL: z.string().default('http://localhost:3001'),
    DATABASE_URL: isProd
        ? z.string({ required_error: 'Missing env var: DATABASE_URL' }).min(1, 'Missing env var: DATABASE_URL')
        : z.string().default('postgresql://postgres:postgres@localhost:5432/kalasquare'),
    JWT_SECRET: isProd
        ? z.string({ required_error: 'Missing env var: JWT_SECRET' }).min(32, 'JWT_SECRET must be at least 32 characters in production')
        : z.string().default('kalasquare_super_secret_jwt_key_2026'),
    ADMIN_EMAIL: z.string().email('Invalid ADMIN_EMAIL').default('admin@kalasquare.com'),
    ADMIN_PASSWORD_HASH: isProd
        ? z.string({ required_error: 'Missing env var: ADMIN_PASSWORD_HASH' }).min(1, 'Missing env var: ADMIN_PASSWORD_HASH')
        : z.string().default('$2b$10$lbMEN79yebMD5syp742DvOSnySTxDNwsgsaU/gIrCVNnSAMLIMlZG'),
    CORS_ORIGIN: z.string().default(isProd ? 'https://kalasquare.com' : '*'),
    UPLOAD_DIR: z.string().optional(),
    CLOUDINARY_URL: z.string().optional(),
    S3_BUCKET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        const issues = result.error.issues;
        const missingField = issues[0]?.path[0];
        const errorMsg = issues[0]?.message || `Missing or invalid env var: ${missingField}`;
        console.error(`❌ Environment Validation Error: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    return result.data;
}

export const env = validateEnv();

