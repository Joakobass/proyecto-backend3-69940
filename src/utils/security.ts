import bcrypt from 'bcrypt';

import { dirname, join } from 'path';
import { UserEntity } from '../entities/users.entity';

export const createHash = (password: string): string => {
	const salts = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salts);
};

export const passwordValidation = (
	hashedPassword: string,
	password: string
): boolean => bcrypt.compareSync(password, hashedPassword);

export const __dirname = dirname(
	dirname(join(process.cwd(), 'src', 'utils', 'security.ts'))
);
