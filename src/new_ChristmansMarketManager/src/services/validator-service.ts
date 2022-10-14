import Ajv from 'ajv'

export class ValidatorService {
  private static instance: undefined | ValidatorService
  private readonly ajvInstance

  private constructor() {
    this.ajvInstance = new Ajv()
  }

  public static getInstance(): ValidatorService {
    if (this.instance == null) {
      this.instance = new ValidatorService()
      return this.instance
    }
    return this.instance
  }

  public async validate(obj: object, schemaPath: string): Promise<boolean> {
    // Check if schema is already present by doing a get
    const ajvCachedSchema = this.ajvInstance.getSchema(schemaPath)
    // Get schema if present, add it if not
    if (ajvCachedSchema === undefined) {
      const schema = await import(schemaPath)
      this.ajvInstance.addSchema(schema, schemaPath)
      // Recall function in order to validate the object
      await this.validate(obj, schemaPath)
    }
    // Validate
    let validationResult = false
    if (ajvCachedSchema !== undefined) {
      validationResult = ajvCachedSchema(obj) as boolean
    }
    return validationResult
  }
}
