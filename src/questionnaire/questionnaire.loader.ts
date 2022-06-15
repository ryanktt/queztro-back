import { QuestionnaireRepository } from './questionnaire.repository';
import { QuestionnaireDocument } from './questionnaire.schema';

import { UtilsArray } from '@utils/*';
import DataLoader from 'dataloader';

export function questionnaireLoader(
	questionnaireRepository: QuestionnaireRepository,
	utilsArray: UtilsArray,
): DataLoader<string, QuestionnaireDocument, string> {
	return new DataLoader<string, QuestionnaireDocument>(async (ids: string[]) => {
		const questionnairezes = await questionnaireRepository.fetchByIds(ids);
		return utilsArray.getObjectsSortedByIds(questionnairezes, 'id', ids);
	});
}