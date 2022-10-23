export const Constants = {
  DYNAMODB_TABLE_NAME: Deno.env.get('DynamoDBTableName') ?? 'NOT_DEFINED'
}
