import { IAWSSendToKinesis } from './utils.interface';

import { AppError, EGeneralErrorCode } from './utils.error';
import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

@Injectable()
export class UtilsAWS {
	async sendToKineses({ payload, key, streamName }: IAWSSendToKinesis): Promise<void> {
		const kinesis = new AWS.Kinesis({ region: 'us-east-1' });
		const params = {
			Data: JSON.stringify(payload),
			StreamName: streamName,
			PartitionKey: key,
		};

		await kinesis
			.putRecord(params)
			.promise()
			.catch((err) => {
				throw new AppError({
					originalError: err instanceof Error ? err : undefined,
					code: EGeneralErrorCode.AWS_SEND_TO_KINESIS_ERROR,
					message: 'fail to send data to aws kinesis stream',
				});
			});
	}
}