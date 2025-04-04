import { EAnswerType } from '../response.interface';

import Joi from 'joi';

const baseAnswerInputValidatorKeys = {
	type: Joi.string()
		.valid(...Object.values(EAnswerType))
		.required(),
	questionId: Joi.string().required(),
	answeredAt: Joi.date(),
};

const AnswerMultipleChoiceInputValidator = Joi.object().keys({
	...baseAnswerInputValidatorKeys,
	optionIds: Joi.array().items(Joi.string()),
});

const AnswerSingleChoiceInputValidator = Joi.object().keys({
	...baseAnswerInputValidatorKeys,
	optionId: Joi.string(),
});

const AnswerTrueOrFalseInputValidator = Joi.object().keys({
	...baseAnswerInputValidatorKeys,
	optionId: Joi.string(),
});

const AnswerTextInputValidator = Joi.object().keys({
	...baseAnswerInputValidatorKeys,
	text: Joi.string().trim(),
});

const AnswerRatingInputValidator = Joi.object().keys({
	...baseAnswerInputValidatorKeys,
	rating: Joi.number().min(1).max(5),
});

export const AnswerDiscriminatorInputValidator = Joi.object().keys({
	type: Joi.string()
		.valid(...Object.values(EAnswerType))
		.required(),
	answerMultipleChoice: AnswerMultipleChoiceInputValidator.when('type', {
		is: Joi.string().valid(EAnswerType.MULTIPLE_CHOICE),
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	answerSingleChoice: AnswerSingleChoiceInputValidator.when('type', {
		is: Joi.string().valid(EAnswerType.SINGLE_CHOICE),
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	answerTrueOrFalse: AnswerTrueOrFalseInputValidator.when('type', {
		is: Joi.string().valid(EAnswerType.TRUE_OR_FALSE),
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	answerText: AnswerTextInputValidator.when('type', {
		is: Joi.string().valid(EAnswerType.TEXT),
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	answerRating: AnswerRatingInputValidator.when('type', {
		is: Joi.string().valid(EAnswerType.RATING),
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
});

export const PublicUpsertQuestResponseValidator = Joi.object().keys({
	answers: Joi.array().items(AnswerDiscriminatorInputValidator).required(),
	questionnaireId: Joi.string().required(),
	respondentToken: Joi.string(),
	userAgent: Joi.string().required(),
	ip: Joi.string().required(),
	completedAt: Joi.date().required(),
	startedAt: Joi.date().required(),
	authToken: Joi.string(),
	email: Joi.string(),
	name: Joi.string(),
});


export const FetchResponsesValidator = Joi.object().keys({
	user: Joi.object().required(),
	questionnaireSharedIds: Joi.array().items(Joi.string()),
	questionnaireIds: Joi.array().items(Joi.string()),
	textFilter: Joi.string().allow(''),
	pagination: Joi.object().keys({
		page: Joi.number().integer().positive(),
		limit: Joi.number().integer().positive(),
	})
});