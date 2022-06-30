import { AnswerDiscriminatorInput, Answer } from './schema';

import { registerEnumType } from '@nestjs/graphql';
import { Questionnaire } from 'src/questionnaire';
import { RespondentDocument } from 'src/user';

export enum EAnswerType {
	MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
	SINGLE_CHOICE = 'SINGLE_CHOICE',
	TRUE_OR_FALSE = 'TRUE_OR_FALSE',
	TEXT = 'TEXT',
}
export enum EResponseErrorCode {
	CREATE_RESPONSE_INVALID_PARAMS = 'CREATE_RESPONSE_INVALID_PARAMS',
	CREATE_RESPONSE_ERROR = 'CREATE_RESPONSE_ERROR',
	FETCH_RESPONSES_ERROR = 'FETCH_RESPONSES_ERROR',
	FETCH_RESPONSE_ERROR = 'FETCH_RESPONSE_ERROR',
	INVALID_ANSWER = 'INVALID_ANSWER',
}

registerEnumType(EAnswerType, { name: 'AnswerType' });
registerEnumType(EResponseErrorCode, { name: 'SessionErrorCode' });

export interface IRepositoryCreateResponseParams {
	questionnaireId: string;
	answers: Answer[];
	attemptCount: number;
	startedAt?: Date;
}

export interface IRepositoryUpdateResponseParams {
	response: RespondentDocument;
	attemptCount: number;
	completedAt?: Date;
	answers?: Answer[];
	startedAt?: Date;
}

export interface ICreateResponseParams {
	answers: AnswerDiscriminatorInput[];
	questionnaireId: string;
	responseId?: string;
}

export interface IPublicCreateResponseParams {
	answers: AnswerDiscriminatorInput[];
	questionnaireId: string;
	authToken?: string;
}

export interface IValidateAnswers {
	questionnaire: Questionnaire;
	answers: Answer[];
}

export interface ICorrectAnswers {
	questionnaire: Questionnaire;
	answers: Answer[];
}
