import Pet from '../dao/Pets.dao';
import { PetEntity } from '../entities/pet.entity';
import { NotFoundError } from '../errors/custom.error';
import { generatePetsMock } from '../mocks/pets.mock';

export class PetServices {
	private petDao: Pet;
	constructor() {
		this.petDao = new Pet();
	}
	async getAll(): Promise<PetEntity[] | null> {
		const pets = await this.petDao.get();
		if (!pets) throw new NotFoundError('Pets not found');
		return pets;
	}
	async getById(id: string): Promise<PetEntity | null> {
		const pet = await this.petDao.getBy(id);
		if (!pet) throw new NotFoundError(`Pet id ${id} not found`);
		return pet;
	}

	async create(data: PetEntity): Promise<PetEntity | null> {
		const pet = await this.petDao.create(data);
		if (!pet) throw new Error('Error creating pet, please try again');
		return pet;
	}
	async createMany(data: PetEntity[]): Promise<PetEntity[] | null> {
		const pets = await this.petDao.createMany(data);
		if (!pets) throw new Error('Pets not created');
		return pets;
	}

	async update(id: string, data: PetEntity): Promise<PetEntity | null> {
		const pet = await this.getById(id);
		if (!pet) throw new NotFoundError(`Pet id ${id} not found`);
		const petUpdate = await this.petDao.update(id, data);
		if (!petUpdate) throw new Error(`Pet not updated`);
		return petUpdate;
	}

	async remove(id: string): Promise<PetEntity | null> {
		const petToDelete = await this.getById(id);
		if (!petToDelete) throw new NotFoundError(`Pet id ${id} not found`);
		await this.petDao.delete(id);
		return petToDelete;
	}

	async createMocks(amount: number): Promise<PetEntity[] | null> {
		const pets = await generatePetsMock(amount);
		const petsDb = await this.createMany(pets);
		return petsDb;
	}
}
