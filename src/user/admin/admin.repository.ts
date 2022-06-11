import { EUserErrorCode, ICreateUserParams } from '../user.interface';
import { AdminDocument, AdminModel } from './admin.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { AppError } from '@utils/*';

@Injectable()
export class AdminRepository {
	constructor(@InjectModel('Admin') private readonly adminSchema: AdminModel) {}

	async fetchByIds(userIds: string[]): Promise<AdminDocument[]> {
		return this.adminSchema
			.find({ _id: { $in: userIds } })
			.exec()
			.catch((err: Error) => {
				throw new AppError({
					code: EUserErrorCode.FETCH_USERS_ERROR,
					message: 'fail to fetch users by ids',
					originalError: err,
				});
			}) as Promise<AdminDocument[]>;
	}

	async fetchById(userId: string): Promise<AdminDocument | undefined> {
		const user = (await this.adminSchema
			.findById(userId)
			.exec()
			.catch((err: Error) => {
				throw new AppError({
					code: EUserErrorCode.FETCH_USER_ERROR,
					message: 'fail to fetch user',
					originalError: err,
				});
			})) as AdminDocument | null;
		return user ? user : undefined;
	}

	async fetchByEmail(email: string): Promise<AdminDocument | undefined> {
		const user = (await this.adminSchema
			.findOne({ email })
			.exec()
			.catch((err: Error) => {
				throw new AppError({
					code: EUserErrorCode.FETCH_USER_ERROR,
					message: 'fail to fetch user',
					originalError: err,
				});
			})) as AdminDocument | null;
		return user ? user : undefined;
	}

	async create({ name, email, hashedPassword }: ICreateUserParams): Promise<AdminDocument> {
		return this.adminSchema.create({ password: hashedPassword, email, name }).catch((err: Error) => {
			throw new AppError({
				code: EUserErrorCode.CREATE_USER_ERROR,
				message: 'fail to create user',
				originalError: err,
			});
		}) as Promise<AdminDocument>;
	}
}
