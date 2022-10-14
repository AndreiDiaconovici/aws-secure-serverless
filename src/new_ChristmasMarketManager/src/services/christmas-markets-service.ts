import { InputModels, ResponseModels } from '../interfaces'
import { logger } from '../utils'
import { DynamoDBService } from '../utils/aws-wrapper-services'
import { Constants } from '../constants'
import * as uuid from 'uuid'

const LOG_PREFIX_CLASS = 'ChristmasMarketsService'

export class ChristmasMarketsService {
  private readonly dynamoDBService: DynamoDBService

  constructor() {
    this.dynamoDBService = DynamoDBService.getInstance(Constants.DYNAMODB_TABLE_NAME)
  }

  public async b2bGetChristmasMarkets(transformedEvent: InputModels.B2BGetMarketsByCity): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | b2bGetChristmasMarkets |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    const markets: ResponseModels.ChristmasMarket[] = await this.dynamoDBService.queryItemsByIndex('city', transformedEvent.pathParameters.city) as ResponseModels.ChristmasMarket[]

    return {
      statusCode: 200,
      body: JSON.stringify({ markets })
    }
  }

  public async b2bApproveChristmasMarket(transformedEvent: InputModels.B2BApproveMarket): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | b2bApproveChristmasMarket |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    await this.dynamoDBService.updateItem({
      userId: transformedEvent.pathParameters.userId,
      marketId: transformedEvent.pathParameters.marketId
    }, transformedEvent.requestBody)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success' })
    }
  }

  public async b2cGetChristmasMarkets(transformedEvent: InputModels.B2CGetMarket): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | b2cGetChristmasMarkets |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    const markets: ResponseModels.ChristmasMarket[] = await this.dynamoDBService.queryItemByPartitionKey('userId', transformedEvent.pathParameters.userId) as ResponseModels.ChristmasMarket[]

    return {
      statusCode: 200,
      body: JSON.stringify({ markets })
    }
  }

  public async b2cCreateChristmasMarket(transformedEvent: InputModels.B2CCreateMarket): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | b2cCreateChristmasMarket |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    const item = { ...transformedEvent.requestBody, marketApproved: false, marketId: uuid.v4() }

    await this.dynamoDBService.createItem(item)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success' })
    }
  }

  public async b2cUpdateChristmasMarket(transformedEvent: InputModels.B2CUpdateMarket): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | b2cUpdateChristmasMarket |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    await this.dynamoDBService.updateItem({
      userId: transformedEvent.pathParameters.userId,
      marketId: transformedEvent.pathParameters.marketId
    }, transformedEvent.requestBody)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success' })
    }
  }

  public async b2cDeleteChristmasMarket(transformedEvent: InputModels.B2CDeleteMarket): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | b2cDeleteChristmasMarket |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    await this.dynamoDBService.deleteItem({
      userId: transformedEvent.pathParameters.userId,
      marketId: transformedEvent.pathParameters.marketId
    })
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success' })
    }
  }
}
