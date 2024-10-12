/* eslint-disable no-new */
import { Ajv } from 'ajv';
import { test, expect, describe } from 'vitest';
import { exampleApi } from './fixtures/apis/example.js';
import { noteTakingApi } from './fixtures/apis/note-taking.js';

describe('Example', () => {
  const jsonSchema = exampleApi.synthJsonSchema();

  test('JSON Schema snapshot', async () => {
    expect(jsonSchema).toMatchSnapshot();
  });

  test('JSON Schema AJV validate', async () => {
    const ajv = new Ajv();
    expect(ajv.validateSchema(jsonSchema)).toBeTruthy();
  });
});

describe('Note Taking', () => {
  const jsonSchema = noteTakingApi.synthJsonSchema();

  test('JSON Schema snapshot', async () => {
    expect(jsonSchema).toMatchSnapshot();
  });

  test('JSON Schema AJV validate', async () => {
    const ajv = new Ajv();
    expect(ajv.validateSchema(jsonSchema)).toBeTruthy();
  });
});
