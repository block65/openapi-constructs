/* eslint-disable no-new */
import { writeFile } from 'node:fs/promises';
import SwaggerParser from '@apidevtools/swagger-parser';
import { describe, test } from '@jest/globals';
import { OpenAPIV3 } from 'openapi-types';
import yaml from 'yaml';
import { Api, OpenApiVersion } from '../lib/api.js';
import { Parameter } from '../lib/parameter.js';
import { Path } from '../lib/path.js';
import { Reference } from '../lib/reference.js';
import { Response } from '../lib/response.js';
import { Schema } from '../lib/schema.js';
import { SecurityRequirement } from '../lib/security-requirement.js';
import { SecurityScheme } from '../lib/security-scheme.js';
import { Server } from '../lib/server.js';
import { Tag } from '../lib/tag.js';

describe('Synth', () => {
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

  const randomTag = new Tag(api, 'RandomTag', {
    name: 'random',
  });

  const userDeleteScopeReq = new SecurityRequirement(api, 'UserReadScope', {
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
    },
  });

  const createUserRequest = new Reference(user, 'CreateUserRequest');

  const users = new Schema(api, 'Users', {
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

  const userIdParameter = new Parameter(api, 'UserId', {
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

  new Path(api, {
    path: '/users',
    tags: new Set([userTag]),
  })
    .addOperation(OpenAPIV3.HttpMethods.GET, {
      operationId: 'listUsersCommand',
      responses: {
        200: new Response(api, 'ListUsers200Response', {
          description: 'User 200 response',
          content: {
            contentType: 'application/json',
            schema: users,
          },
        }),
      },
    })
    .addOperation(OpenAPIV3.HttpMethods.POST, {
      operationId: 'createUserCommand',
      tags: new Set([randomTag]),
      requestBody: {
        content: {
          contentType: 'application/json',
          schema: createUserRequest,
        },
      },
      responses: {
        200: new Response(api, 'CreateUser200Response', {
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
    .addOperation(OpenAPIV3.HttpMethods.GET, {
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
    .addOperation(OpenAPIV3.HttpMethods.DELETE, {
      operationId: 'deleteUserByIdCommand',
      security: userDeleteScopeReq,
      tags: new Set([userTag, randomTag]),
    })
    .addOperation(OpenAPIV3.HttpMethods.HEAD, {
      operationId: 'checkUserIdAvailableCommand',
      security: noSecurityRequirement,
    })
    .addOperation(OpenAPIV3.HttpMethods.POST, {
      operationId: 'updateUserCommand',
      requestBody: {
        content: {
          contentType: 'application/json',
          schema: updateUserRequest,
        },
      },
      responses: {
        200: new Response(api, 'UpdateUserResponse200', {
          content: {
            contentType: 'application/json',
            schema: user,
          },
        }),
      },
    });

  test('OpenAPI', async () => {
    const document = api.synth();

    expect(document).toMatchInlineSnapshot(`
      {
        "components": {
          "parameters": {
            "UserId": {
              "in": "path",
              "name": "userId",
              "required": true,
              "schema": {
                "$ref": "#/components/schemas/Id",
              },
            },
          },
          "schemas": {
            "Address": {
              "additionalProperties": false,
              "properties": {
                "postcode": {
                  "format": "int32",
                  "maximum": 9999,
                  "minimum": 1000,
                  "type": "integer",
                },
              },
              "required": [
                "name",
              ],
              "type": "object",
            },
            "CreateUserRequest": {
              "additionalProperties": false,
              "properties": {
                "address": {
                  "$ref": "#/components/schemas/Address",
                },
                "age": {
                  "format": "int32",
                  "minimum": 0,
                  "type": "integer",
                },
                "name": {
                  "type": "string",
                },
                "userId": {
                  "$ref": "#/components/schemas/Id",
                },
              },
              "required": [
                "name",
              ],
              "type": "object",
            },
            "Id": {
              "type": "string",
            },
            "UpdateUserRequest": {
              "additionalProperties": false,
              "minProperties": 1,
              "properties": {
                "address": {
                  "$ref": "#/components/schemas/Address",
                },
                "age": {
                  "format": "int32",
                  "minimum": 0,
                  "type": "integer",
                },
              },
              "type": "object",
            },
            "User": {
              "additionalProperties": false,
              "properties": {
                "address": {
                  "$ref": "#/components/schemas/Address",
                },
                "age": {
                  "format": "int32",
                  "minimum": 0,
                  "type": "integer",
                },
                "name": {
                  "type": "string",
                },
                "userId": {
                  "$ref": "#/components/schemas/Id",
                },
              },
              "required": [
                "name",
              ],
              "type": "object",
            },
            "Users": {
              "items": {
                "$ref": "#/components/schemas/User",
              },
              "type": "array",
              "uniqueItems": true,
            },
          },
          "securitySchemes": {
            "HttpBearerJwtScheme": {
              "bearerFormat": "JWT",
              "scheme": "bearer",
              "type": "http",
            },
          },
        },
        "info": {
          "title": "Example REST API",
          "version": "1.0.0",
        },
        "openapi": "3.1.0",
        "paths": {
          "/users": {
            "get": {
              "operationId": "listUsersCommand",
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/Users",
                      },
                    },
                  },
                  "description": "User 200 response",
                },
              },
              "tags": [
                "user",
              ],
            },
            "post": {
              "operationId": "createUserCommand",
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/CreateUserRequest",
                    },
                  },
                },
                "description": "",
              },
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/Users",
                      },
                    },
                  },
                  "description": "User 200 response",
                },
              },
              "tags": [
                "user",
                "random",
              ],
            },
          },
          "/users/{userId}": {
            "delete": {
              "operationId": "deleteUserByIdCommand",
              "security": [
                {
                  "HttpBearerJwtScheme": [
                    "users.delete",
                  ],
                },
              ],
              "tags": [
                "user",
                "random",
              ],
            },
            "get": {
              "operationId": "getUserByIdCommand",
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/User",
                      },
                    },
                  },
                  "description": "User 200 response",
                },
              },
              "tags": [],
            },
            "head": {
              "operationId": "checkUserIdAvailableCommand",
              "security": [
                {},
              ],
              "tags": [],
            },
            "parameters": [
              {
                "$ref": "#/components/parameters/UserId",
              },
            ],
            "post": {
              "operationId": "updateUserCommand",
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/UpdateUserRequest",
                    },
                  },
                },
                "description": "",
              },
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/User",
                      },
                    },
                  },
                  "description": "",
                },
              },
              "tags": [],
            },
          },
        },
        "security": [
          {
            "HttpBearerJwtScheme": [],
          },
          {
            "HttpBearerJwtScheme": [
              "users.delete",
            ],
          },
          {},
        ],
      }
    `);

    const cloneObject = <T extends Record<string, unknown>>(obj: T): T =>
      JSON.parse(JSON.stringify(obj)) as T;

    await expect(
      // WARN: this function mutates the input
      SwaggerParser.validate(cloneObject(document)),
    ).resolves.toBeTruthy();

    await writeFile(
      new URL('./example.json', import.meta.url),
      JSON.stringify(api.synth(), null, 2),
    );

    await writeFile(
      new URL('./example.yaml', import.meta.url),
      yaml.stringify(api.synth()),
    );
  });

  test('JSON Schema', async () => {
    const schema = api.synthJsonSchema();

    expect(schema).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "definitions": {
          "Address": {
            "additionalProperties": false,
            "properties": {
              "postcode": {
                "format": "int32",
                "maximum": 9999,
                "minimum": 1000,
                "type": "integer",
              },
            },
            "required": [
              "name",
            ],
            "type": "object",
          },
          "CreateUserRequest": {
            "additionalProperties": false,
            "properties": {
              "address": {
                "$ref": "#/components/schemas/Address",
              },
              "age": {
                "format": "int32",
                "minimum": 0,
                "type": "integer",
              },
              "name": {
                "type": "string",
              },
              "userId": {
                "$ref": "#/components/schemas/Id",
              },
            },
            "required": [
              "name",
            ],
            "type": "object",
          },
          "Id": {
            "type": "string",
          },
          "UpdateUserRequest": {
            "additionalProperties": false,
            "minProperties": 1,
            "properties": {
              "address": {
                "$ref": "#/components/schemas/Address",
              },
              "age": {
                "format": "int32",
                "minimum": 0,
                "type": "integer",
              },
            },
            "type": "object",
          },
          "User": {
            "additionalProperties": false,
            "properties": {
              "address": {
                "$ref": "#/components/schemas/Address",
              },
              "age": {
                "format": "int32",
                "minimum": 0,
                "type": "integer",
              },
              "name": {
                "type": "string",
              },
              "userId": {
                "$ref": "#/components/schemas/Id",
              },
            },
            "required": [
              "name",
            ],
            "type": "object",
          },
          "Users": {
            "items": {
              "$ref": "#/components/schemas/User",
            },
            "type": "array",
            "uniqueItems": true,
          },
        },
      }
    `);
  });
});
