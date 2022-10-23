export interface ChristmasMarket {
  userId: string
  marketId: string
  marketName: string
  marketDescription: string
  marketAveragePrice: number
  marketApproved: boolean
  city: string
}

export interface DefaultResponse {
  message: string
}

export interface Response {
  statusCode: number
  body: string
}
