import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

import { InputModels, ResponseModels } from './interfaces/index.ts'

import { logger } from './utils/index.ts'
import { dispatcher } from './dispatcher.ts'

const LOG_PREFIX = 'Handler'

// deno-lint-ignore require-await
export async function handler(
  event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyResultV2> {
  logger.info(`${LOG_PREFIX} #LAMBDA_START#`)
  logger.info('Received event', { event })

  let response: ResponseModels.Response

  try {
    // Transform Event
    const transformedEvent: InputModels.Input = {
      pathParameters: event.pathParameters,
      queryParameters: event.queryStringParameters,
      requestBody: event.body !== null ? JSON.parse(event.body) : null,
      httpMethod: event.httpMethod,
      path: event.resource
    }
    logger.info('Transformed event', { transformedEvent })

    // Dispatch Service
    response = await dispatcher(transformedEvent)
  } catch (error: any) {
    logger.error(error)
    const errorObject = JSON.parse(error.message)
    response = {
      statusCode: errorObject.statusCode,
      body: errorObject.message
    }
  }

  logger.info(`${LOG_PREFIX} #LAMBDA_END#`, response)
  return response
}