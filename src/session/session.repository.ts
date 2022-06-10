import { ESessionErrorCode, ICreateSessionParams, IUpdateSessionParams } from './session.interface';
import { SessionDocument, SessionModel } from './session.schema';

import { AppError, UtilsPromise } from '@utils/*';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionRepository {
	constructor(
		@InjectModel('Session') private readonly sessionSchema: SessionModel,
		private readonly utilsPromise: UtilsPromise,
	) {}

	async fetchById(sessionId: string): Promise<SessionDocument | null> {
		return this.sessionSchema
			.findById(sessionId)
			.exec()
			.catch((err: Error) => {
				throw new AppError({
					code: ESessionErrorCode.FETCH_SESSION_ERROR,
					message: 'fail to fetch session',
					originalError: err,
				});
			}) as Promise<SessionDocument | null>;
	}

	async create(params: ICreateSessionParams): Promise<SessionDocument> {
		const { expiresAt, ip, userId, userAgent, active } = params;
		return this.sessionSchema
			.create({ expiresAt, ip, user: userId, userAgent, active })
			.catch((err: Error) => {
				throw new AppError({
					code: ESessionErrorCode.CREATE_SESSION_ERROR,
					message: 'fail to create new session',
					originalError: err,
				});
			}) as Promise<SessionDocument>;
	}

	async update({ active, session }: IUpdateSessionParams): Promise<SessionDocument> {
		if (active === session.active) return session;
		session.active = active;

		return session.save().catch((err: Error) => {
			throw new AppError({
				code: ESessionErrorCode.UPDATE_SESSION_ERROR,
				message: 'fail to update session',
				originalError: err,
			});
		}) as Promise<SessionDocument>;
	}
}
