/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ESessionErrorCode, IAdminContext } from './session.interface';
import { SessionService } from './session.service';

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminDocument, EUserType } from 'src/user';
import { AppError, ERole } from '@utils/*';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(private readonly sessionService: SessionService, private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.getArgByIndex(2).req;

		const authToken = req.headers.auth as string;
		const userAgent = req.headers['user-agent'];

		req.userAgent = userAgent;
		req.authToken = authToken;

		const role = this.reflector.get<ERole>('role', context.getHandler());

		if (role) {
			const { user, session } = await this.sessionService.authenticateUser(authToken);

			if (role === ERole.ADMIN) {
				if (user.type !== EUserType.ADMIN) {
					throw new AppError({ code: ESessionErrorCode.INVALID_SESSION, message: 'invalid session' });
				}

				const adminRequest = req as IAdminContext;
				adminRequest.user = user as AdminDocument;
				adminRequest.session = session;
			}
		}

		return true;
	}
}
