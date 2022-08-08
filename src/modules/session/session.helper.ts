import { IJwtPayload } from './session.interface';

import { UtilsDate, UtilsPromise } from '@utils/*';
import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class SessionHelper {
	constructor(private readonly utilsPromise: UtilsPromise, private readonly utilsDate: UtilsDate) {}

	async validateAndGetJwtPayload(token: string): Promise<IJwtPayload> {
		return this.utilsPromise.promisify(() => jwt.verify(token, 'JWT Secret') as IJwtPayload);
	}

	async validateAndGetJwtPublicPayload(token: string): Promise<{ responseId: string }> {
		return this.utilsPromise.promisify(() => jwt.verify(token, 'JWT Secret') as { responseId: string });
	}

	signJwtToken(payload: IJwtPayload | { responseId: string }, expiresAt: Date): string {
		return jwt.sign(payload, 'JWT Secret', { expiresIn: this.utilsDate.getDateInMs(expiresAt) });
	}

	getExpirationDate(): Date {
		return this.utilsDate.addTimeToDate(new Date(), 'days', 2);
	}
}