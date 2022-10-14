import { Context, APIGatewayEvent } from 'aws-lambda'
import { InputModels, ResponseModels } from './interfaces'

import { logger } from './utils'
import { dispatcher } from './dispatcher'

const LOG_PREFIX = 'Handler'

const handler = async (event: APIGatewayEvent, _context: Context): Promise<any> => {
  logger.info(`${LOG_PREFIX} #LAMBDA_START#`)
  logger.info('Received event', { event })

  let response: ResponseModels.Response

  try {
    // Transform Event
    const transformedEvent: InputModels.Input = {
      pathParameters: event.pathParameters,
      queryParameters: event.queryStringParameters,
      requestBody: event.body,
      httpMethod: event.httpMethod,
      path: event.resource
    }
    logger.info('Transformed event', { transformedEvent })

    // Dispatch Service
    response = await dispatcher(transformedEvent)
  } catch (error: any) {
    logger.error(error)
    response = {
      statusCode: error.statusCode,
      body: error.message
    }
  }

  logger.info(`${LOG_PREFIX} #LAMBDA_END#`)
  return response
}

export { handler }
