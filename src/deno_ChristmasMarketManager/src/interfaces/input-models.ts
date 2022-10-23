export interface Input {
  requestBody?: any
  pathParameters?: any
  queryParameters?: any
  httpMethod: string
  path: string
}

// B2C Get Market
export interface B2CGetMarket extends Input {
  pathParameters: {
    userId: string
  }
}

// B2C Create Market
export interface B2CCreateMarket extends Input {
  pathParameters: {
    userId: string
  }
  requestBody: RequestBodyB2CreateMarket
}

export interface RequestBodyB2CreateMarket {
  marketName: string
  marketDescription: string
  marketAveragePrice: number
  city: string
}

// B2C Update Market
export type RequestBodyB2CUpdateMarket = Omit<RequestBodyB2CreateMarket, 'city'>

export interface B2CUpdateMarket extends Input {
  pathParameters: {
    userId: string
    marketId: string
  }
  requestBody: RequestBodyB2CUpdateMarket
}

// B2C Delete Market
export interface B2CDeleteMarket extends Input {
  pathParameters: {
    userId: string
    marketId: string
  }
}

// B2B Approve Market
export interface B2BApproveMarket extends Input {
  pathParameters: {
    userId: string
    marketId: string
  }
  requestBody: {
    approved: boolean
  }
}

// B2B Get Markets by City
export interface B2BGetMarketsByCity extends Input {
  pathParameters: {
    city: string
  }
}
