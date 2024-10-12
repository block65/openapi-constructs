/* eslint-disable no-new */
import {
  Api,
  HttpMethods,
  Schema,
  OpenApiVersion,
  Parameter,
  Path,
  Reference,
  Response,
  SecurityRequirement,
  SecurityScheme,
  Server,
  Tag,
} from '@block65/openapi-constructs';

export const exampleApi = new Api({
  openapi: OpenApiVersion.V3_1,
  info: {
    title: 'Example REST API',
    version: '1.0.0',
  },
});

new Server(exampleApi, 'ExampleServer', {
  url: new URL('https://api.example.com'),
});

const httpBearerJwtScheme = new SecurityScheme(
  exampleApi,
  'HttpBearerJwtScheme',
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
);

new SecurityRequirement(exampleApi, 'AllScopes', {
  securityScheme: httpBearerJwtScheme,
  scopes: [],
});

const userTag = new Tag(exampleApi, 'UserTag', {
  name: 'user',
});

const randomTag = new Tag(exampleApi, 'RandomTag', {
  name: 'random',
});

const userDeleteScopeReq = new SecurityRequirement(
  exampleApi,
  'UserReadScope',
  {
    securityScheme: httpBearerJwtScheme,
    scopes: ['users.delete'],
  },
);

const noSecurityRequirement = new SecurityRequirement(exampleApi, 'NoSecurity');

const addressSchema = new Schema(exampleApi, 'Address', {
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

const idSchema = new Schema(exampleApi, 'Id', {
  schema: {
    type: 'string',
  },
});

const user = new Schema(exampleApi, 'User', {
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
        anyOf: [
          {
            type: 'integer',
            format: 'int32',
            minimum: 0,
          },
          {
            type: 'null',
          },
        ],
      },
    },
  },
});

const updateUserRequest = new Schema(exampleApi, 'UpdateUserRequest', {
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
  },
});

const createUserRequest = new Reference(user, 'CreateUserRequest');

const users = new Schema(exampleApi, 'Users', {
  schema: {
    type: 'array',
    // additionalItems: false,
    uniqueItems: true,
    items: user.referenceObject(),
  },
});

/* const errorSchema = new Schema(api, 'ErrorSchema', {
  schema: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
      },
    },
  },
}); */

/* const idParameter = new Parameter(api, 'IdParam', {
  name: 'userId',
  in: 'path',
  required: true,
  schema: idSchema,
}); */

const userIdParameter = new Parameter(exampleApi, 'UserId', {
  name: 'userId',
  in: 'path',
  required: true,
  schema: idSchema,
});

/* const userIdentifiersSchema = new Schema(api, 'UserIdentifiers', {
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['userId'],
    properties: {
      userId: userIdParameter.referenceObject(),
    },
  },
}); */

/* const errorResponse = new Response(api, 'ErrorResponse', {
  description: 'Error response',
  content: new MediaType(api, 'Error', {
    contentType: 'application/json',
    schema: errorSchema,
  }),
}); */

new Path(exampleApi, {
  path: '/users',
  tags: new Set([userTag]),
})
  .addOperation(HttpMethods.GET, {
    operationId: 'listUsersCommand',
    responses: {
      200: new Response(exampleApi, 'ListUsers200Response', {
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
    tags: new Set([randomTag]),
    requestBody: {
      content: {
        contentType: 'application/json',
        schema: createUserRequest,
      },
    },
    responses: {
      200: new Response(exampleApi, 'CreateUser200Response', {
        description: 'User 200 response',
        content: {
          contentType: 'application/json',
          schema: users,
        },
      }),
    },
  });

new Path(exampleApi, {
  path: '/users/{userId}',
  parameters: [userIdParameter],
})
  .addOperation(HttpMethods.GET, {
    operationId: 'getUserByIdCommand',
    responses: {
      200: new Response(exampleApi, 'GetUserById', {
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
    tags: new Set([userTag, randomTag]),
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
      200: new Response(exampleApi, 'UpdateUserResponse200', {
        content: {
          contentType: 'application/json',
          schema: user,
        },
      }),
    },
  });
