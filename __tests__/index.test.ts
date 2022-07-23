/* eslint-disable no-new */
import SwaggerParser from '@apidevtools/swagger-parser';
import { describe, test } from '@jest/globals';
import { OpenAPIV3 } from 'openapi-types';
import {
  Api,
  Info,
  OpenApiVersion,
  Path,
  Schema,
  SecurityRequirement,
  SecurityScheme,
  Tag,
  Server,
} from '../lib/index.js';

describe('Basic', () => {
  test('Nothing', async () => {
    const api = new Api({
      openapi: OpenApiVersion.V3_1,
      info: {
        title: 'Test',
        version: '1.0.0',
      },
    });

    new Server(api, 'ExampleServer', {
      url: 'https://api.example.com',
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

    const userDeleteScopeReq = new SecurityRequirement(api, 'UserReadScope', {
      securityScheme: httpBearerJwtScheme,
      scopes: ['users.delete'],
    });

    const noSecurityRequirement = new SecurityRequirement(api, 'NoSecurity');

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
    })
      .addOperation(OpenAPIV3.HttpMethods.GET, {
        operationId: 'getUserById',
        tags: [userTag],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: userIdentifiersSchema.toJSON(),
          },
        ],
      })
      .addOperation(OpenAPIV3.HttpMethods.DELETE, {
        operationId: 'deleteUserById',
        security: userDeleteScopeReq,
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: userIdentifiersSchema.toJSON(),
          },
        ],
      })
      .addOperation(OpenAPIV3.HttpMethods.HEAD, {
        operationId: 'checkUserIdAvailable',
        security: noSecurityRequirement,
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: userIdentifiersSchema.toJSON(),
          },
        ],
      });

    expect(api.synth()).toMatchInlineSnapshot(`
      Object {
        "components": Object {
          "schemas": Object {
            "Address": Object {
              "additionalProperties": false,
              "properties": Object {
                "postcode": Object {
                  "format": "int32",
                  "maximum": 9999,
                  "minimum": 1000,
                  "type": "integer",
                },
              },
              "required": Array [
                "name",
              ],
              "type": "object",
            },
            "User": Object {
              "additionalProperties": false,
              "properties": Object {
                "address": Object {
                  "$ref": "#/components/schemas/Address",
                },
                "age": Object {
                  "format": "int32",
                  "minimum": 0,
                  "type": "integer",
                },
                "name": Object {
                  "type": "string",
                },
              },
              "required": Array [
                "name",
              ],
              "type": "object",
            },
            "UserIdentifiers": Object {
              "additionalProperties": false,
              "properties": Object {
                "userId": Object {
                  "type": "string",
                },
              },
              "required": Array [
                "userId",
              ],
              "type": "object",
            },
          },
          "securitySchemes": Object {
            "HttpBearerJwtScheme": Object {
              "bearerFormat": "JWT",
              "scheme": "bearer",
              "type": "http",
            },
          },
        },
        "info": Object {
          "title": "Sites REST API",
          "version": "1.0.0",
        },
        "openapi": "3.1.0",
        "paths": Object {
          "/users/{userId}": Object {
            "delete": Object {
              "operationId": "deleteUserById",
              "parameters": Array [
                Object {
                  "in": "path",
                  "name": "userId",
                  "required": true,
                  "schema": Object {
                    "$ref": "#/components/schemas/UserIdentifiers",
                  },
                },
              ],
              "security": Array [
                Object {
                  "HttpBearerJwtScheme": Array [
                    "users.delete",
                  ],
                },
              ],
            },
            "get": Object {
              "operationId": "getUserById",
              "parameters": Array [
                Object {
                  "in": "path",
                  "name": "userId",
                  "required": true,
                  "schema": Object {
                    "$ref": "#/components/schemas/UserIdentifiers",
                  },
                },
              ],
              "tags": Array [
                "user",
              ],
            },
            "head": Object {
              "operationId": "checkUserIdAvailable",
              "parameters": Array [
                Object {
                  "in": "path",
                  "name": "userId",
                  "required": true,
                  "schema": Object {
                    "$ref": "#/components/schemas/UserIdentifiers",
                  },
                },
              ],
              "security": Array [
                Object {},
              ],
            },
          },
        },
        "security": Array [
          Object {
            "HttpBearerJwtScheme": Array [],
          },
          Object {
            "HttpBearerJwtScheme": Array [
              "users.delete",
            ],
          },
          Object {},
        ],
      }
    `);

    await expect(SwaggerParser.validate(api.synth())).resolves.toBeTruthy();
  });
});
