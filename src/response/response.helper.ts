import { AnswerDiscriminatorInput, AnswerInput, Answer, CreateResponseValidator } from './schema';
import { EAnswerType, EResponseErrorCode, ICreateResponseParams } from './response.interface';

import { AppError, UtilsPromise } from '@utils/*';
import { Injectable } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class ResponseHelper {
	constructor(private readonly utilsPromise: UtilsPromise) {}

	async validateCreateResponseParams(params: ICreateResponseParams): Promise<void> {
		await this.utilsPromise
			.promisify(() => Joi.assert(params, CreateResponseValidator))
			.catch((originalError: Error) => {
				throw new AppError({
					code: EResponseErrorCode.CREATE_RESPONSE_INVALID_PARAMS,
					message: 'invalid params to create response',
					originalError,
				});
			});
	}

	getAnswerFromAnswerDiscriminatorInput(
		answerDiscriminatorInput: AnswerDiscriminatorInput,
	): Answer | undefined {
		const map: Record<EAnswerType, AnswerInput | undefined> = {
			[EAnswerType.MULTIPLE_CHOICE]: answerDiscriminatorInput.answerMultipleChoice,
			[EAnswerType.SINGLE_CHOICE]: answerDiscriminatorInput.answerSingleChoice,
			[EAnswerType.TRUE_OR_FALSE]: answerDiscriminatorInput.answerTrueOrFalse,
			[EAnswerType.TEXT]: answerDiscriminatorInput.answerText,
		};

		const answerInput = map[answerDiscriminatorInput.type];
		if (!answerInput) return;

		const answer: Partial<Answer> & Partial<AnswerInput> & Partial<Record<string, unknown>> = {
			...answerInput,
		};

		answer.question = answer.questionId;
		delete answer.questionId;
		if ('optionIds' in answer) {
			answer.options = answer.optionIds;
			delete answer.optionIds;
		}
		if ('optionId' in answer) {
			answer.option = answer.optionId;
			delete answer.optionId;
		}

		return answer as Answer;
	}
}
