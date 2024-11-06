/* eslint-disable no-new */
import {
  Api,
  OpenApiVersion,
  Parameter,
  Path,
  Reference,
  Response,
  Schema,
  SecurityRequirement,
  SecurityScheme,
  Server,
  Tag,
  HttpMethods,
} from '@block65/openapi-constructs';

const api = new Api({
  openapi: OpenApiVersion.V3_1,
  info: {
    title: 'Example REST API',
    version: '1.0.0',
  },
});

new Server(api, 'ExampleServer', {
  url: new URL('https://api.example.com'),
});

const httpBearerJwtScheme = new SecurityScheme(api, 'HttpBearerJwtScheme', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

new SecurityRequirement(api, 'AllScopes', {
  securityScheme: httpBearerJwtScheme,
  scopes: [],
});

const userTag = new Tag(api, 'UserTag', {
  name: 'user',
});

const userDeleteScopeReq = new SecurityRequirement(api, 'UserDeleteScope', {
  securityScheme: httpBearerJwtScheme,
  scopes: ['users.delete'],
});

const noSecurityRequirement = new SecurityRequirement(api, 'NoSecurity');

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

const idSchema = new Schema(api, 'Id', {
  schema: {
    type: 'string',
    minLength: 6,
    maxLength: 6,
  },
});

const user = new Schema(api, 'User', {
  schema: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      userId: idSchema.referenceObject(),
      name: {
        type: 'string',
      },
      address: addressSchema.referenceObject(),
      age: {
        type: 'integer',
        format: 'int32',
        minimum: 0,
      },
    },
  },
});

const updateUserRequest = new Schema(api, 'UpdateUserRequest', {
  schema: {
    type: 'object',
    minProperties: 1,
    additionalProperties: false,
    properties: {
      address: addressSchema.referenceObject(),
      age: {
        type: 'integer',
        format: 'int32',
        minimum: 0,
      },
    },
    examples: [{ age: 10, address: { postcode: 2000 } }],
  },
});

const createUserRequest = new Reference(user, 'CreateUserRequest');

const users = new Schema(api, 'Users', {
  schema: {
    type: 'array',
    uniqueItems: true,
    items: user.referenceObject(),
    examples: [[1, 2, 3]],
  },
});

const userIdParameter = new Parameter(api, 'UserId', {
  name: 'userId',
  in: 'path',
  required: true,
  schema: idSchema,
});

new Path(api, {
  path: '/users',
  tags: new Set([userTag]),
})
  .addOperation(HttpMethods.GET, {
    operationId: 'listUsersCommand',
    responses: {
      200: new Response(api, 'ListUsersResponse', {
        description: 'User 200 response',
        content: {
          contentType: 'application/json',
          schema: users,
        },
      }),
    },
  })
  .addOperation(HttpMethods.POST, {
    operationId: 'createUserCommand',
    requestBody: {
      content: {
        contentType: 'application/json',
        schema: createUserRequest,
      },
    },
    responses: {
      200: new Response(api, 'CreateUserResponse', {
        description: 'User 200 response',
        content: {
          contentType: 'application/json',
          schema: users,
        },
      }),
    },
  });

new Path(api, {
  path: '/users/{userId}',
  parameters: [userIdParameter],
})
  .addOperation(HttpMethods.GET, {
    operationId: 'getUserByIdCommand',
    responses: {
      200: new Response(api, 'GetUserById', {
        description: 'User 200 response',
        content: {
          contentType: 'application/json',
          schema: user,
        },
      }),
    },
  })
  .addOperation(HttpMethods.DELETE, {
    operationId: 'deleteUserByIdCommand',
    security: userDeleteScopeReq,
  })
  .addOperation(HttpMethods.HEAD, {
    operationId: 'checkUserIdAvailableCommand',
    security: noSecurityRequirement,
  })
  .addOperation(HttpMethods.POST, {
    operationId: 'updateUserCommand',
    requestBody: {
      content: {
        contentType: 'application/json',
        schema: updateUserRequest,
      },
    },
    responses: {
      200: new Response(api, 'UpdateUserResponse', {
        content: {
          contentType: 'application/json',
          schema: user,
        },
      }),
    },
  });

process.stdout.write(JSON.stringify(api.synth(), null, 2));
