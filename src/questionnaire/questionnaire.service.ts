import {
	EQuestionnaireType,
	IFetchQuestionnaireParams,
	ICreateQuestionnaireParams,
	IFetchQuestionnairesParams,
} from './questionnaire.interface';
import { QuestionnaireRepository } from './questionnaire.repository';
import { QuestionnaireHelper } from './questionnaire.helper';
import { Question, Questionnaire } from './schema';

import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionnaireService {
	constructor(
		private readonly questionnaireRepository: QuestionnaireRepository,
		private readonly questionnaireHelper: QuestionnaireHelper,
	) {}

	async fetchQuestionnaire(params: IFetchQuestionnaireParams): Promise<Questionnaire | undefined> {
		const { questionnaireSharedId, questionnaireId, user } = params;
		await this.questionnaireHelper.validateFetchQuestionnaireParams(params);

		return this.questionnaireRepository.fetchQuestionnaire({
			...(questionnaireId ? { questionnaireId } : { questionnaireSharedId }),
			userId: user.id,
		});
	}

	async fetchQuestionnaires(params: IFetchQuestionnairesParams): Promise<Questionnaire[]> {
		const { questionnaireSharedIds, questionnaireIds, user } = params;
		await this.questionnaireHelper.validateFetchQuestionnairesParams(params);

		return this.questionnaireRepository.fetchQuestionnaires({
			questionnaireSharedIds,
			userIds: [user.id],
			questionnaireIds,
		});
	}

	async createQuestionnaire(params: ICreateQuestionnaireParams): Promise<Questionnaire> {
		const { questions: questionDiscriminatorInputArray, title, type, user } = params;
		await this.questionnaireHelper.validateCreateQuestionnaireParams(params);

		const questions = questionDiscriminatorInputArray.map((input) => {
			return this.questionnaireHelper.getQuestionFromQuestionDiscriminatorInput(input) as Question;
		});

		if (type === EQuestionnaireType.QuestionnaireQuiz) {
			return this.questionnaireRepository.createQuiz({ questions, title, userId: user.id });
		}
		if (type === EQuestionnaireType.QuestionnaireSurvey) {
			return this.questionnaireRepository.createSurvey({ questions, title, userId: user.id });
		}

		const { passingGradePercent, randomizeQuestions, maxRetryAmount, timeLimit } = params;
		return this.questionnaireRepository.createExam({
			passingGradePercent,
			randomizeQuestions,
			userId: user.id,
			maxRetryAmount,
			timeLimit,
			questions,
			title,
		});
	}
}
