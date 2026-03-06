/* eslint-disable no-new */
import { test } from 'vitest';
import { Api, Schema } from '@block65/openapi-constructs';

test('Regression', async () => {
  const api = new Api({
    openapi: '3.1.0',
    info: {
      title: 'Example',
      version: '1.0.0',
    },
  });

  const schema1 = new Schema(api, 'Test1', {
    schema: {
      type: 'object',
      additionalProperties: false,
      minProperties: 1,
      properties: {
        description: {
          oneOf: [
            {
              type: ['string', 'null'],
              minLength: 1,
              maxLength: 1024,
            },
            {
              type: 'null',
            },
          ],
        },
      },
    },
  });

  new Schema(api, 'Test2', {
    schema: {
      allOf: [
        schema1.schema,
        {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      ],
    },
  });
});
