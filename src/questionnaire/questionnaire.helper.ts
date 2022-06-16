import { EQuestionnaireErrorCode, EQuestionType } from './questionnaire.interface';
import { QuestionDiscriminatorInput, QuestionInput } from './questionnaire.input';
import { Question } from './questionnaire.schema';

import { AppError, UtilsPromise } from '@utils/*';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionnaireHelper {
	constructor(private readonly utilsPromise: UtilsPromise) {}

	async validateTitle(title: string): Promise<void> {
		return this.utilsPromise.promisify(() => {
			const code = EQuestionnaireErrorCode.INVALID_TITLE;
			if (title.length < 3) throw new AppError({ message: 'invalid title, min character length: 3', code });
			if (title.length > 350) {
				throw new AppError({ message: 'invalid title, max character length: 350', code });
			}
		});
	}

	getQuestionFromQuestionDiscriminatorInput(
		questionDiscriminatorInput: QuestionDiscriminatorInput,
	): Question | undefined {
		const map: Record<EQuestionType, QuestionInput> = {
			[EQuestionType.MULTIPLE_CHOICE]: questionDiscriminatorInput.questionMultipleChoice,
			[EQuestionType.SINGLE_CHOICE]: questionDiscriminatorInput.questionSingleChoice,
			[EQuestionType.TRUE_OR_FALSE]: questionDiscriminatorInput.questionTrueOrFalse,
			[EQuestionType.TEXT]: questionDiscriminatorInput.questionText,
		};

		return map[questionDiscriminatorInput.type] as Question | undefined;
	}
}