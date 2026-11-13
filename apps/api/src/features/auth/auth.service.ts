import { AuthRepository } from './auth.repository.js';
import { comparePassword, signAdminToken, AuthUser } from '../../lib/auth.js';
import { UnauthorizedError } from '../../common/errors.js';
import { AdminLoginInput } from './auth.schema.js';
import { AdminLoginResult } from './auth.types.js';

export class AuthService {
    constructor(private readonly authRepo = new AuthRepository()) {}

    async login(input: AdminLoginInput): Promise<AdminLoginResult> {
        const user = await this.authRepo.findByEmail(input.email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValid = await comparePassword(input.password, user.passwordHash);
        if (!isValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: 'admin',
        };

        const token = signAdminToken(authUser);

        return {
            token,
            user: authUser,
        };
    }
}
