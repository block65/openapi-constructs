/* eslint-disable no-new */
import {
  Api,
  HttpMethods,
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
} from '@block65/openapi-constructs';

export const noteTakingApi = new Api({
  openapi: OpenApiVersion.V3_1,
  info: {
    title: 'Example REST API',
    version: '1.0.0',
  },
});

new Server(noteTakingApi, 'ExampleServer', {
  url: new URL('https://api.example.com'),
});

const httpBearerJwtScheme = new SecurityScheme(
  noteTakingApi,
  'HttpBearerJwtScheme',
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
);

new SecurityRequirement(noteTakingApi, 'AllScopes', {
  securityScheme: httpBearerJwtScheme,
  scopes: [],
});

const userApiTag = new Tag(noteTakingApi, 'UserApiTag', {
  name: 'user',
});

const userDeleteScopeReq = new SecurityRequirement(
  noteTakingApi,
  'UserDeleteScope',
  {
    securityScheme: httpBearerJwtScheme,
    scopes: ['users.delete'],
  },
);

const noSecurityRequirement = new SecurityRequirement(
  noteTakingApi,
  'NoSecurity',
);

const addressSchema = new Schema(noteTakingApi, 'Address', {
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

const idSchema = new Schema(noteTakingApi, 'Id', {
  schema: {
    type: 'string',
    minLength: 6,
    maxLength: 6,
  },
});

const user = new Schema(noteTakingApi, 'User', {
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

const updateUserRequest = new Schema(noteTakingApi, 'UpdateUserRequest', {
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

const users = new Schema(noteTakingApi, 'Users', {
  schema: {
    type: 'array',
    uniqueItems: true,
    items: user.referenceObject(),
  },
});

const userIdParameter = new Parameter(noteTakingApi, 'UserId', {
  name: 'userId',
  in: 'path',
  required: true,
  schema: idSchema,
});

new Path(noteTakingApi, {
  path: '/users',
  tags: new Set([userApiTag]),
})
  .addOperation(HttpMethods.GET, {
    operationId: 'listUsersCommand',
    responses: {
      200: new Response(noteTakingApi, 'ListUsersResponse', {
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
      200: new Response(noteTakingApi, 'CreateUserResponse', {
        description: 'User 200 response',
        content: {
          contentType: 'application/json',
          schema: users,
        },
      }),
    },
  });

new Path(noteTakingApi, {
  path: '/users/{userId}',
  parameters: [userIdParameter],
})
  .addOperation(HttpMethods.GET, {
    operationId: 'getUserByIdCommand',
    responses: {
      200: new Response(noteTakingApi, 'GetUserById', {
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
    responses: {
      204: new Response(noteTakingApi, 'HeadUserResponseFound'),
      404: new Response(noteTakingApi, 'HeadUserResponseNotFound'),
    },
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
      200: new Response(noteTakingApi, 'UpdateUserResponse', {
        content: {
          contentType: 'application/json',
          schema: user,
        },
      }),
    },
  });

const noteSchema = new Schema(noteTakingApi, 'Note', {
  schema: {
    type: 'object',
    required: ['title', 'content'],
    additionalProperties: false,
    properties: {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      labels: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
          maxLength: 256,
        },
      },
    },
  },
});

const createNoteRequest = new Reference(noteSchema, 'CreateNoteRequest');

const notes = new Schema(noteTakingApi, 'Notes', {
  schema: {
    type: 'array',
    uniqueItems: true,
    items: noteSchema.referenceObject(),
  },
});

const noteUserIdParameter = new Parameter(noteTakingApi, 'NoteUserId', {
  name: 'userId',
  in: 'path',
  required: true,
  schema: idSchema,
});

const noteIdParameter = new Parameter(noteTakingApi, 'NoteId', {
  name: 'noteId',
  in: 'path',
  required: true,
  schema: idSchema,
});

new Path(noteTakingApi, {
  path: '/users/{userId}/notes',
  tags: new Set([userApiTag]),
  parameters: [noteUserIdParameter],
})
  .addOperation(HttpMethods.GET, {
    operationId: 'listNotesCommand',
    responses: {
      200: new Response(noteTakingApi, 'ListNotesResponse', {
        description: 'Notes 200 response',
        content: {
          contentType: 'application/json',
          schema: notes,
        },
      }),
    },
  })
  .addOperation(HttpMethods.POST, {
    operationId: 'createNoteCommand',
    requestBody: {
      content: {
        contentType: 'application/json',
        schema: createNoteRequest,
      },
    },
    responses: {
      200: new Response(noteTakingApi, 'CreateNoteResponse', {
        description: 'Note created 200 response',
        content: {
          contentType: 'application/json',
          schema: noteSchema,
        },
      }),
    },
  });

const updateNoteRequest = new Schema(noteTakingApi, 'UpdateNoteRequest', {
  schema: {
    type: 'object',
    minProperties: 1,
    additionalProperties: false,
    properties: {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      labels: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
          maxLength: 256,
        },
      },
    },
  },
});

const noteDeleteScopeReq = new SecurityRequirement(
  noteTakingApi,
  'NoteDeleteScope',
  {
    securityScheme: httpBearerJwtScheme,
    scopes: ['notes.delete'],
  },
);

new Path(noteTakingApi, {
  path: '/users/{userId}/notes/{noteId}',
  parameters: [noteUserIdParameter, noteIdParameter],
})
  .addOperation(HttpMethods.GET, {
    operationId: 'getNoteCommand',
    responses: {
      200: new Response(noteTakingApi, 'GetNote', {
        description: 'Note 200 response',
        content: {
          contentType: 'application/json',
          schema: noteSchema,
        },
      }),
    },
  })
  .addOperation(HttpMethods.DELETE, {
    operationId: 'deleteNoteCommand',
    security: noteDeleteScopeReq,
  })
  .addOperation(HttpMethods.POST, {
    operationId: 'updateNoteCommand',
    requestBody: {
      content: {
        contentType: 'application/json',
        schema: updateNoteRequest,
      },
    },
    responses: {
      200: new Response(noteTakingApi, 'UpdateNoteResponse', {
        content: {
          contentType: 'application/json',
          schema: noteSchema,
        },
      }),
    },
  });
