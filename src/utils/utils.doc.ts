import { AppError, EGeneralErrorCode } from './utils.error';
import { UtilsPromise } from './utils.promise';
import { DocumentType } from './utils.schema';

import { LeanDocument, ClientSession, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

type AnyObj = Record<string, unknown>;

@Injectable()
export class UtilsDoc {
	constructor(
		@InjectConnection() private readonly connection: Connection,
		private readonly utilsPromise: UtilsPromise,
	) { }

	async validateUserDocAccess<T extends DocumentType<AnyObj>, U extends DocumentType<AnyObj>>(
		docToVal: U | undefined,
		refDocsArr: { doc: T; refKey: keyof LeanDocument<U> }[],
	): Promise<void> {
		await this.utilsPromise.promisify(() => {
			if (!docToVal) return;
			refDocsArr.forEach(({ refKey, doc }) => {
				const docToValName = docToVal.constructor.modelName;

				if (docToVal[refKey as keyof U] !== doc.id) {
					throw new AppError({
						message: `user does not have access to ${docToValName}`,
						code: EGeneralErrorCode.ACCESS_DENIED,
					});
				}
			});
		});
	}

	handleFieldUpdate<T extends LeanDocument<DocumentType<AnyObj>>, K extends keyof T>(params: {
		doc: T;
		field: K;
		value?: T[K] | null;
		defaultValue?: T[K];
	}): T | undefined {
		const { doc, field, value, defaultValue } = params;

		if (value === null && doc[field] !== defaultValue) {
			doc[field] = defaultValue as typeof doc[typeof field];
			return doc;
		}

		if (value !== undefined && doc[field] !== value) {
			doc[field] = value as typeof doc[typeof field];
			return doc;
		}
		return;
	}

	async startMongodbSession<T>(
		cb: (session: ClientSession) => Promise<T>,
		session?: ClientSession,
	): Promise<T> {
		let result;
		if (!session || !session.inTransaction()) {
			const newSession = await this.connection.startSession();
			await newSession.withTransaction(async () => {
				result = await cb(newSession);
			});
		} else {
			result = await cb(session);
		}
		return result as T;
	}
}
