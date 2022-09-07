import { ResponseQuestionnaireRepository } from './response-questionnaire.repository';
import { ResponseQuestionnaireHelper } from './response-questionnaire.helper';

import { QuestionnaireSchema } from '@modules/questionnaire/schema/questionnaire.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule } from '@utils/utils.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Questionnaire', schema: QuestionnaireSchema }]), UtilsModule],
	providers: [ResponseQuestionnaireHelper, ResponseQuestionnaireRepository],
	exports: [ResponseQuestionnaireHelper, ResponseQuestionnaireRepository],
})
export class ResponseQuestionnaireModule {}