#!/usr/bin/env tsx
import bcrypt from 'bcryptjs';

const args = process.argv.slice(2);
let password = '';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--password' && args[i + 1]) {
        password = args[i + 1];
        break;
    } else if (!args[i].startsWith('--') && !password) {
        password = args[i];
    }
}

if (!password) {
    console.error('❌ Error: Password is required.');
    console.error('Usage: pnpm hash-password --password "your-password"');
    process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('\n🔒 Generated Bcrypt Password Hash:');
console.log('--------------------------------------------------');
console.log(hash);
console.log('--------------------------------------------------');
console.log('Add to your .env.production as:');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
