import { InputModels } from './interfaces/index.ts'
import { ChristmasMarketsService, ValidatorService } from './services/index.ts'
import { logger } from './utils/index.ts'

enum Endpoints {
  // B2B
  B2B_GET_CHRISTMAS_MARKETS = '/v1/b2b/christmas-markets/city/{city}:GET',
  B2B_PATCH_CHRISTMAS_MARKETS = '/v1/b2b/christmas-markets/{marketId}/user/{userId}:PATCH',
  // B2C
  B2C_GET_CHRISTMAS_MARKET = '/v1/b2c/christmas-markets/user/{userId}:GET',
  B2C_POST_CHRISTMAS_MARKET = '/v1/b2c/christmas-markets/user/{userId}:POST',
  B2C_PATCH_CHRISTMAS_MARKET = '/v1/b2c/christmas-markets/{marketId}/user/{userId}:PATCH',
  B2C_DELETE_CHRISTMAS_MARKET = '/v1/b2c/christmas-markets/{marketId}/user/{userId}:DELETE'
}

export async function dispatcher(transformedEvent: InputModels.Input): Promise<{ statusCode: number, body: any }> {
  const christmasMarketService = new ChristmasMarketsService()
  const validator = ValidatorService.getInstance()
  const API = `${transformedEvent.path}:${transformedEvent.httpMethod}`

  await validator.validate(transformedEvent, API)
  switch (API) {
    case Endpoints.B2B_GET_CHRISTMAS_MARKETS: {
      return await christmasMarketService.b2bGetChristmasMarkets(transformedEvent as InputModels.B2BGetMarketsByCity)
    }
    case Endpoints.B2B_PATCH_CHRISTMAS_MARKETS: {
      return await christmasMarketService.b2bApproveChristmasMarket(transformedEvent as InputModels.B2BApproveMarket)
    }
    case Endpoints.B2C_GET_CHRISTMAS_MARKET: {
      return await christmasMarketService.b2cGetChristmasMarkets(transformedEvent as InputModels.B2CGetMarket)
    }
    case Endpoints.B2C_POST_CHRISTMAS_MARKET: {
      return await christmasMarketService.b2cCreateChristmasMarket(transformedEvent as InputModels.B2CCreateMarket)
    }
    case Endpoints.B2C_PATCH_CHRISTMAS_MARKET: {
      return await christmasMarketService.b2cUpdateChristmasMarket(transformedEvent as InputModels.B2CUpdateMarket)
    }
    case Endpoints.B2C_DELETE_CHRISTMAS_MARKET: {
      return await christmasMarketService.b2cDeleteChristmasMarket(transformedEvent as InputModels.B2CDeleteMarket)
    }
    default: {
      logger.error(`Method not implemented! - ${transformedEvent.path}:${transformedEvent.httpMethod}`)
      throw new Error(JSON.stringify({ message: 'Method not implemented!', statusCode: 501 }))
    }
  }
}
