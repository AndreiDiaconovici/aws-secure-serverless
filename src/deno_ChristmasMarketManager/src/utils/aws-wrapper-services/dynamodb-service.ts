import { ApiFactory } from 'https://deno.land/x/aws_api/client/mod.ts';
import { AttributeValue, DeleteItemInput, DynamoDB, GetItemInput, GetItemOutput, QueryInput, QueryOutput } from 'https://aws-api.deno.dev/v0.3/services/dynamodb.ts';
import { logger } from '../logger.ts'
import { ResponseModels } from "../../interfaces/index.ts";

const LOG_PREFIX_CLASS = 'DynamoDBService'

export class DynamoDBService {
  private static instance: DynamoDBService | undefined

  private readonly dynamoDBInstance
  private readonly dynamoDBTable

  private constructor(dynamoDBTable: string) {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | constructor | `
    this.dynamoDBInstance = new ApiFactory().makeNew(DynamoDB);
    this.dynamoDBTable = dynamoDBTable
    logger.info(`${LOG_PREFIX_FUNCTION}`, dynamoDBTable)
  }

  /**
   * Singleton pattern
   * @param dynamoDBTable dynamoDBTable name to operate on
   * @returns DynamoDBService
   */
  public static getInstance(dynamoDBTable: string): DynamoDBService {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | getInstance | `
    if (this.instance == null) {
      logger.info(`${LOG_PREFIX_FUNCTION} creating instance`)
      this.instance = new DynamoDBService(dynamoDBTable)
      return this.instance
    }
    logger.info(`${LOG_PREFIX_FUNCTION} instance already created`)
    return this.instance
  }

  /**
   * Query dynamoDBtable based on GSI
   * @param indexName
   * @param indexValue
   * @returns QueryOutput.Items
   */
  public async queryItemsByIndex(indexName: string, indexValue: string): Promise<ResponseModels.ChristmasMarket[]> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | queryItemsByIndex | `
    const params = {
      TableName: this.dynamoDBTable,
      IndexName: indexName,
      KeyConditionExpression: `${indexName} = :${indexName}`,
      ExpressionAttributeValues: {
        [`:${indexName}`]: { "S": indexValue }
      },
      ReturnConsumedCapacity: 'TOTAL'
    }
    logger.info(`${LOG_PREFIX_FUNCTION} START`, params)
    const result = await this.dynamoDBInstance.query(params)
    logger.info(`${LOG_PREFIX_FUNCTION} Result`, result)
    if (result.Items !== null && result.Items !== undefined) {
      return result.Items.map(i => {
        return {
          userId: i['userId'] !== undefined && i['userId'] !== null ? i['userId']['S'] as string : '',
          marketId: i['marketId'] !== undefined && i['marketId'] !== null ? i['marketId']['S'] as string : '',
          city: i['city'] !== undefined && i['city'] !== null ? i['city']['S'] as string : '',
          marketAveragePrice:  i['marketAveragePrice'] !== undefined && i['marketAveragePrice'] !== null ? Number(i['marketAveragePrice']['N']) as number : 0,
          marketDescription: i['marketDescription'] !== undefined && i['marketDescription'] !== null ? i['marketDescription']['S'] as string : '',
          marketName: i['marketName'] !== undefined && i['marketName'] !== null ? i['marketName']['S'] as string : '',
          marketApproved:  i['marketApproved'] !== undefined && i['marketApproved'] !== null ? i['marketApproved']['BOOL'] as boolean : false
        }
      })
    } else {
      return [];
    }
  }

  public async createItem(item: any): Promise<void> {
    await this.dynamoDBInstance.putItem({
      TableName: this.dynamoDBTable,
      Item: {
        "userId": {
          "S": item.userId
        },
        "marketId": {
          "S": item.marketId
        },
        "city": {
          "S": item.city
        },
        "marketAveragePrice": {
          "N": `${item.marketAveragePrice}`
        },
        "marketDescription": {
          "S": item.marketDescription
        },
        "marketName": {
          "S": item.marketName
        },
        "marketApproved": {
          "BOOL": false
        }
      },
      ReturnConsumedCapacity: 'TOTAL'
    })
  }

  /**
   * Update the item
   * @param key contains the object passed as key params to dynamoDB
   * @param payload contains the properties of the object that must be updated
   */
  public async updateItem(key: any, payload: any): Promise<void> {
    const params: GetItemInput = {
      TableName: this.dynamoDBTable,
      Key: { "userId": { "S": key.userId }, "marketId": { "S": key.marketId } },
      ReturnConsumedCapacity: 'TOTAL'
    }
    const response: GetItemOutput = await this.dynamoDBInstance.getItem(params)
    const item = response.Item as {[key: string]: AttributeValue}

    if (item === undefined) {
      throw new Error('Item not founded')
    }

    for (const prop of Object.getOwnPropertyNames(payload)) {
      item[prop][Object.keys(item[prop])[0]] = `${payload[prop]}`
    }

    await this.dynamoDBInstance.putItem({
      TableName: this.dynamoDBTable,
      Item: item!,
      ReturnConsumedCapacity: 'TOTAL'
    })
  }

  /**
   * Query dynamoDBtable based on Partition Key
   * @param keyName
   * @param keyValue
   * @returns QueryOutput.Items
   */
  public async queryItemByPartitionKey(keyName: string, keyValue: string): Promise<ResponseModels.ChristmasMarket[]> {
    const params: QueryInput = {
      TableName: this.dynamoDBTable,
      KeyConditionExpression: `#${keyName} = :${keyName}`,
      ExpressionAttributeNames: {
        [`#${keyName}`]: keyName
      },
      ExpressionAttributeValues: {
        [`:${keyName}`]: { "S": keyValue }
      },
      ReturnConsumedCapacity: 'TOTAL'
    }

    const result = await this.dynamoDBInstance.query(params)
    if (result.Items !== null && result.Items !== undefined) {
      return result.Items.map(i => {
        return {
          userId: i['userId'] !== undefined && i['userId'] !== null ? i['userId']['S'] as string : '',
          marketId: i['marketId'] !== undefined && i['marketId'] !== null ? i['marketId']['S'] as string : '',
          city: i['city'] !== undefined && i['city'] !== null ? i['city']['S'] as string : '',
          marketAveragePrice:  i['marketAveragePrice'] !== undefined && i['marketAveragePrice'] !== null ? Number(i['marketAveragePrice']['N']) as number : 0,
          marketDescription: i['marketDescription'] !== undefined && i['marketDescription'] !== null ? i['marketDescription']['S'] as string : '',
          marketName: i['marketName'] !== undefined && i['marketName'] !== null ? i['marketName']['S'] as string : '',
          marketApproved:  i['marketApproved'] !== undefined && i['marketApproved'] !== null ? i['marketApproved']['BOOL'] as boolean : false
        }
      })
    } else {
      return [];
    }
  }

  /**
   * Delete the item
   * @param key contains the object passed as key params to dynamoDB
   */
  public async deleteItem(key: any): Promise<void> {
    const params: DeleteItemInput = {
      TableName: this.dynamoDBTable,
      Key: { "userId": { "S": key.userId }, "marketId": { "S": key.marketId } },
      ReturnConsumedCapacity: 'TOTAL'
    }

    await this.dynamoDBInstance.deleteItem(params)
  }
}
