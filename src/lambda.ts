/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import 'reflect-metadata';
import { eventContext } from 'aws-serverless-express/middleware';
import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';

import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
	if (!cachedServer) {
		const expressApp = express();
		const nestApp = await NestFactory.create(
			AppModule,
			new ExpressAdapter(expressApp),
		);
		nestApp.use(eventContext());
		await nestApp.init();
		cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
	}
	return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
	cachedServer = await bootstrapServer();

	return proxy(cachedServer, event, context, 'PROMISE').promise;
};
