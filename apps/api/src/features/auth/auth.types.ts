import { AuthUser } from '../../lib/auth.js';

export type { AuthUser };

export interface AdminLoginResult {
    token: string;
    user: AuthUser;
}
