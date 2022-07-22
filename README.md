# @block65/openapi-constructs

An experimental AWS Constructs based Open API schema builder

## Example

```typescript
import {
  Api,
  Info,
  OpenApiVersion,
  Path,
  Schema,
} from '@block65/openapi-constructs';

const api = new Api({
  openapi: OpenApiVersion.V3_1,
  info: {
    title: 'Test',
    version: '1.0.0',
  },
});

new Info(api, 'info', {
  title: 'Sites REST API',
  version: '1.0.0',
});

const addressSchema = new Schema(api, 'Address', {
  schema: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      postcode: {
        type: 'integer',
        format: 'int32',
        minimum: 1000,
        maximum: 9999,
      },
    },
  },
});

new Schema(api, 'User', {
  schema: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
      },
      address: addressSchema.toJSON(),
      age: {
        type: 'integer',
        format: 'int32',
        minimum: 0,
      },
    },
  },
});

const userIdentifiersSchema = new Schema(api, 'UserIdentifiers', {
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['userId'],
    properties: {
      userId: {
        type: 'string',
      },
    },
  },
});

new Path(api, {
  path: '/users/{userId}',
}).addOperation(OpenAPIV3.HttpMethods.GET, {
  operationId: 'getUserById',
  parameters: [
    {
      name: 'userId',
      in: 'path',
      required: true,
      schema: userIdentifiersSchema.toJSON(),
    },
  ],
});

process.stdout.write(JSON.stringify(api.synth(), null, 2));
```
