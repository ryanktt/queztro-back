import {
	QuestionText,
	QuestionTrueOrFalse,
	QuestionSingleChoice,
	QuestionMultipleChoice,
} from './quiz.schema';
import { registerEnumType } from '@nestjs/graphql';

export enum EQuizErrorCode {
	CREATE_QUIZ_EXAM_ERROR = 'CREATE_QUIZ_EXAM_ERROR',
	CREATE_QUIZ_SURVEY_ERROR = 'CREATE_QUIZ_SURVEY_ERROR',
	UPDATE_QUIZ_EXAM_ERROR = 'UPDATE_QUIZ_EXAM_ERROR',
	UPDATE_QUIZ_SURVEY_ERROR = 'UPDATE_QUIZ_SURVEY_ERROR',
	FETCH_QUIZZES_ERROR = 'FETCH_QUIZZES_ERROR',
	FETCH_QUIZ_ERROR = 'FETCH_QUIZ_ERROR',
	QUIZ_NOT_FOUND = 'QUIZ_NOT_FOUND',
}

export enum EQuestionType {
	MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
	SINGLE_CHOICE = 'SINGLE_CHOICE',
	TRUE_OR_FALSE = 'TRUE_OR_FALSE',
	TEXT = 'TEXT',
}
export enum EQuizType {
	SURVEY = 'SURVEY',
	EXAM = 'EXAM',
}
registerEnumType(EQuizErrorCode, { name: 'QuizErrorCode' });
registerEnumType(EQuestionType, { name: 'QuestionType' });
registerEnumType(EQuizType, { name: 'QuizType' });

export type IQuestionTypes =
	| QuestionSingleChoice
	| QuestionMultipleChoice
	| QuestionTrueOrFalse
	| QuestionText;
