import { SessionDocument } from './session.schema';

import { AdminDocument, RespondentDocument, UserDocument } from '@modules/user';
import { registerEnumType } from '@nestjs/graphql';

export enum ESessionErrorCode {
	SESSION_IS_NOT_ACTIVE = 'SESSION_IS_NOT_ACTIVE',
	CREATE_SESSION_ERROR = 'CREATE_SESSION_ERROR',
	UPDATE_SESSION_ERROR = 'UPDATE_SESSION_ERROR',
	FETCH_SESSION_ERROR = 'FETCH_SESSION_ERROR',
	SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
	SESSION_EXPIRED = 'SESSION_EXPIRED',
	INVALID_SESSION = 'INVALID_SESSION',
}

registerEnumType(ESessionErrorCode, { name: 'SessionErrorCode' });

export interface ICreateSessionParams {
	userAgent: string;
	expiresAt: Date;
	userId: string;
	ip: string;
	active?: boolean;
}

export interface IUpdateSessionParams {
	session: SessionDocument;
	active: boolean;
}

export interface IJwtPayload {
	sessionId: string;
	userId: string;
}

export interface IPublicContext {
	userAgent: string;
	authToken: string;
	clientIp: string;
}

export interface IAdminContext extends IPublicContext {
	session: SessionDocument;
	user: AdminDocument;
}

export interface IUserContext extends IPublicContext {
	session: SessionDocument;
	user: UserDocument;
}

export interface IRespondentContext extends IPublicContext {
	session: SessionDocument;
	user: RespondentDocument;
}