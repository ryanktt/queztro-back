import { SessionRepository } from './session.repository';
import { ESessionErrorCode } from './session.interface';
import { SessionDocument } from './session.schema';
import { SessionHelper } from './session.helper';

import { EUserErrorCode, UserDocument, UserRepository } from 'src/user';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppError } from 'src/utils/utils.error';

@Injectable()
export class SessionService {
	constructor(
		@Inject(forwardRef(() => UserRepository)) private readonly userRepository: UserRepository,
		private readonly sessionRepository: SessionRepository,
		private readonly sessionHelper: SessionHelper,
	) {}

	async authenticateUser(token: string): Promise<{ session: SessionDocument; user: UserDocument }> {
		const { userId, sessionId } = await this.sessionHelper
			.validateAndGetJwtPayload(token)
			.catch((err: Error) => {
				throw new AppError({
					message: 'session is invalid or expired',
					code: ESessionErrorCode.INVALID_SESSION,
					originalError: err,
				});
			});

		const [session, user] = await Promise.all([
			this.sessionRepository.fetchById(sessionId),
			this.userRepository.fetchById(userId),
		]);

		if (!session) {
			throw new AppError({ code: ESessionErrorCode.SESSION_NOT_FOUND, message: 'session not found' });
		}

		if (!user) throw new AppError({ code: EUserErrorCode.USER_NOT_FOUND, message: 'user not found' });

		if (!session.active) {
			throw new AppError({ code: ESessionErrorCode.SESSION_IS_NOT_ACTIVE, message: 'session is unactive' });
		}

		if (session.expiresAt.valueOf() < Date.now()) {
			throw new AppError({ code: ESessionErrorCode.SESSION_EXPIRED, message: 'session expired' });
		}

		return { user, session };
	}

	async deactivateSession(session: SessionDocument): Promise<SessionDocument> {
		return this.sessionRepository.update({ session, active: false });
	}
}
