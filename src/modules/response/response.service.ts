import { IUpsertResponseParams, IPublicUpsertResponseParams } from './response.interface';
import { AnswerTypes, ResponseDocument } from './schema';
import { ResponseRepository } from './response.repository';
import { ResponseHelper } from './response.helper';

import { EQuestionnaireErrorCode, EQuestionnaireType, QuestionnaireRepository } from '@modules/questionnaire';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SessionHelper } from '@modules/session';
import { AppError } from '@utils/*';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseService {
	constructor(
		@Inject(forwardRef(() => QuestionnaireRepository))
		private readonly questionnaireRepository: QuestionnaireRepository,
		@Inject(forwardRef(() => SessionHelper)) private readonly sessionHelper: SessionHelper,
		private readonly responseRepository: ResponseRepository,
		private readonly responseHelper: ResponseHelper,
	) {}

	async upsertQuestionnaireExamResponse(params: IUpsertResponseParams): Promise<ResponseDocument> {
		const { answers: answerDiscriminatorInputArray, questionnaireId, responseId } = params;
		await this.responseHelper.validateUpsertResponseParams(params);

		const answers = answerDiscriminatorInputArray.map((input) => {
			return this.responseHelper.getAnswerFromAnswerDiscriminatorInput(input) as AnswerTypes;
		});

		const questionnaire = await this.questionnaireRepository.fetchById(questionnaireId);
		if (!questionnaire || questionnaire.type !== EQuestionnaireType.QuestionnaireExam) {
			throw new AppError({
				code: EQuestionnaireErrorCode.QUESTIONNAIRE_NOT_FOUND,
				message: 'questionnaire not found',
			});
		}

		this.responseHelper.validateAnswers({ answers, questionnaire });
		this.responseHelper.correctAnswers({ answers, questionnaire });

		// update questionnaireMetrics

		const response = await this.responseRepository.fetchById(responseId);
		if (!response) {
			return this.responseRepository.create({ answers, questionnaireId });
		} else {
			response.answers = answers;
			return this.responseRepository.save(response);
		}
	}

	async publicUpsertSurveyResponse({
		answers: answerDiscriminatorInputArray,
		questionnaireId,
		authToken,
	}: IPublicUpsertResponseParams): Promise<{ authToken: string }> {
		const answers = answerDiscriminatorInputArray.map((input) => {
			return this.responseHelper.getAnswerFromAnswerDiscriminatorInput(input) as AnswerTypes;
		});

		const jwtPayload = await this.responseHelper.getGuestRespondentJwtPayload(authToken);
		let guestRespondentId = jwtPayload?.guestRespondentId;

		if (!guestRespondentId) {
			guestRespondentId = uuidv4();
			authToken = this.sessionHelper.signPublicUpsertResponseToken({ guestRespondentId });
		}

		await this.responseHelper.sendQuestionnaireResponseToKinesis({
			guestRespondentId,
			questionnaireId,
			answers,
		});

		return { authToken: authToken || '' };
	}
}
