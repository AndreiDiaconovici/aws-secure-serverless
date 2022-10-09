const uuid = require('uuid');
const AWS = require('aws-sdk');
exports.handler = async (event) => {

    const dynamoDBName = process.env.DynamoDBTableName;
    const dynamoDBClient =  new AWS.DynamoDB.DocumentClient({
        apiVersion: "2012-08-10"
    });
    console.info(event);
    const transformedEvent = {
        resource: event.resource,
        httpMethod: event.httpMethod,
        pathParameters: event.pathParameters,
        body: event.body !== null ? JSON.parse(event.body) : null
    }
    const api = transformedEvent.resource+':'+transformedEvent.httpMethod;
    console.info('api: '+api);
    // dispatch logic
    switch(api) {
        case '/v1/b2b/christmas-markets/city/{city}:GET': {
            const params = {
                TableName: dynamoDBName,
                IndexName: "city",
                KeyConditionExpression: "city = :city",
                ExpressionAttributeValues: {
                    ':city': transformedEvent.pathParameters.city
                }
            }

            try {
                const item = await dynamoDBClient.query(params).promise();
                return {
                   body: JSON.stringify(item.Items),
                   statusCode: 200
                };
            } catch (error) {
                throw new Error('DynamoDB Processing Failed: '+ JSON.stringify(error));
            }
        }
        case '/v1/b2b/christmas-markets/{marketId}/user/{userId}:PATCH': {
            const params = {
                TableName: dynamoDBName,
                Key: {
                    userId: transformedEvent.pathParameters.userId,
                    marketId: transformedEvent.pathParameters.marketId,
                },
                ReturnConsumedCapacity: 'TOTAL'
            }

            try {
                const response = await dynamoDBClient.get(params).promise();
                const item = response.Item;
                item.marketApproved = transformedEvent.body.approved;
                await dynamoDBClient.put({
                    TableName: dynamoDBName,
                    Item: item,
                    ReturnConsumedCapacity: 'TOTAL'
                }).promise();
                return {
                    body: JSON.stringify({message: 'success'}),
                    statusCode: 200
                 };
            } catch (error) {
                throw new Error('DynamoDB Processing Failed: '+ JSON.stringify(error));
            }
        }
        case '/v1/b2c/christmas-markets/user/{userId}:GET': {
            const params = {
                TableName: dynamoDBName,
                KeyConditionExpression: '#userId = :userId',
                ExpressionAttributeNames: {
                    '#userId': 'userId'
                },
                ExpressionAttributeValues: {
                    ':userId': transformedEvent.pathParameters.userId
                },
                ReturnConsumedCapacity: 'TOTAL'
            }

            try {
                const item = await dynamoDBClient.query(params).promise();
                return {
                    body: JSON.stringify(item.Items),
                    statusCode: 200
                 };
            } catch (error) {
                throw new Error('DynamoDB Processing Failed: '+ JSON.stringify(error));
            }
        }
        case '/v1/b2c/christmas-markets/user/{userId}:POST': {
            const item = {
                marketApproved: false,
                userId: event.pathParameters.userId,
                marketId: uuid.v4(),
                marketName: transformedEvent.body.marketName,
                marketDescription: transformedEvent.body.marketDescription,
                marketAveragePrice: transformedEvent.body.marketAveragePrice,
                city: transformedEvent.body.city
            }
            const params = {
                TableName: dynamoDBName,
                Item: item,
                ReturnConsumedCapacity: 'TOTAL'
            }
    
            await dynamoDBClient.put(params).promise();
            return {
                body: JSON.stringify({message: 'success'}),
                statusCode: 200
             };
        }
        case '/v1/b2c/christmas-markets/{marketId}/user/{userId}:PATCH': {
            const params = {
                TableName: dynamoDBName,
                Key: {
                    userId: transformedEvent.pathParameters.userId,
                    marketId: transformedEvent.pathParameters.marketId,
                },
                ReturnConsumedCapacity: 'TOTAL'
            }

            try {
                const response = await dynamoDBClient.get(params).promise();
                const item = response.Item;
                item.marketName = transformedEvent.body.marketName;
                item.marketDescription = transformedEvent.body.marketDescription;
                item.marketAveragePrice = transformedEvent.body.marketAveragePrice;
                item.marketApproved = false;
                await dynamoDBClient.put({
                    TableName: dynamoDBName,
                    Item: item,
                    ReturnConsumedCapacity: 'TOTAL'
                }).promise();
                return {
                    body: JSON.stringify({message: 'success'}),
                    statusCode: 200
                };
            } catch (error) {
                throw new Error('DynamoDB Processing Failed: '+ JSON.stringify(error));
            }
        }
        case '/v1/b2c/christmas-markets/{marketId}/user/{userId}:DELETE': {
            const params = {
                TableName: dynamoDBName,
                Key: {
                    userId: transformedEvent.pathParameters.userId,
                    marketId: transformedEvent.pathParameters.marketId
                },
                ReturnConsumedCapacity: 'TOTAL'
            }

            try {
                await dynamoDBClient.delete(params).promise();
                return {
                    body: JSON.stringify({message: 'success'}),
                    statusCode: 200
                 };
            } catch (error) {
                throw new Error('DynamoDB Processing Failed: '+ JSON.stringify(error));
            }
        }
        default:
            throw new Error('Method not implemented')
    }
};






