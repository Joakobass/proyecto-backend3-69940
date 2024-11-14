import Users from '../dao/Users.dao';
import { UserEntity } from '../entities/users.entity';
import { NotFoundError } from '../errors/custom.error';
import { generateUsersMock } from '../mocks/user.mock';
import { createHash } from '../utils/security';
// import { generateUsersMock } from '../mocks/user.mock.js';

export class UserServices {
	private userDao: Users;
	constructor() {
		// this.userRepository = new UserRepository(new Users());
		this.userDao = new Users();
	}
	async getAll(): Promise<UserEntity[] | null> {
		const users = await this.userDao.get();
		if (!users) throw new NotFoundError('Users not found');
		return users;
	}
	async getById(id: string): Promise<UserEntity | null> {
		const user = await this.userDao.getBy(id);
		if (!user) throw new NotFoundError(`User id ${id} not found`);
		return user;
	}
	async create(data: UserEntity): Promise<UserEntity | null> {
		if (!data.password) throw new Error('Password is required');
		data.password = createHash(data.password);
		const user = await this.userDao.create(data);
		if (!user) throw new Error('Error creating user, please try again');
		return user;
	}

	async createMany(data: UserEntity[]): Promise<UserEntity[] | null> {
		const users = await this.userDao.createMany(data);
		if (!users) throw new Error('Error creating users, please try again');
		return users;
	}

	async update(id: string, data: UserEntity): Promise<UserEntity | null> {
		const user = await this.getById(id);
		if (!user) throw new NotFoundError(`User id ${id} not found`);
		const userUpdate = await this.userDao.update(id, data);
		if (!userUpdate)
			throw new Error(`Error updating user, please try again`);
		return userUpdate;
	}
	async remove(id: string): Promise<UserEntity | null> {
		const userToDelete = await this.getById(id);
		if (!userToDelete) throw new NotFoundError(`User id ${id} not found`);
		await this.userDao.delete(id);
		return userToDelete;
	}

	async createMocks(amount: number): Promise<UserEntity[] | null> {
		const users = await generateUsersMock(amount);
		const usersDb = await this.createMany(users);
		return usersDb;
	}
}
