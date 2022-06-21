import { EResponseErrorCode, ICreateResponseParams } from './response.interface';
import { ResponseRepository } from './response.repository';
import { Answer, Response } from './response.schema';
import { ResponseHelper } from './response.helper';

import { EQuestionnaireErrorCode, QuestionnaireRepository } from 'src/questionnaire';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppError, UtilsAuth } from '@utils/*';

@Injectable()
export class ResponseService {
	constructor(
		private readonly questionnaireRepository: QuestionnaireRepository,
		private readonly responseRepository: ResponseRepository,
		private readonly responseHelper: ResponseHelper,
		@Inject(forwardRef(() => UtilsAuth)) private readonly utilsAuth: UtilsAuth,
	) {}

	async createResponse({
		answers: answerDiscriminatorInputArray,
		questionnaireId,
		user,
	}: ICreateResponseParams): Promise<Response> {
		const errCollector = AppError.collectorInstance();

		const answers = answerDiscriminatorInputArray.map((input, i) => {
			const answer = this.responseHelper.getAnswerFromAnswerDiscriminatorInput(input);
			const errorObj = {
				message: `object of specified type ${input.type} was not provided at index[${i}]`,
				code: EResponseErrorCode.INVALID_ANSWER,
			};
			if (!answer) errCollector.collect(new AppError(errorObj));
			return answer as Answer;
		});

		errCollector.run({
			code: EResponseErrorCode.CREATE_RESPONSE_INVALID_PARAMS,
			message: 'invalid params to create response',
		});

		const questionnaire = await this.questionnaireRepository.fetchById(questionnaireId);
		if (!questionnaire) {
			throw new AppError({
				code: EQuestionnaireErrorCode.QUESTIONNAIRE_NOT_FOUND,
				message: 'questionnaire not found',
			});
		}

		return this.responseRepository.create({ answers, userId: user.id, questionnaireId });
	}
}