import SwaggerParser from '@apidevtools/swagger-parser';
import { test, expect, describe } from 'vitest';
import { exampleApi } from './fixtures/apis/example.js';
import { noteTakingApi } from './fixtures/apis/note-taking.js';

describe('Example', () => {
  test('OpenAPI', async () => {
    const document = exampleApi.synth();
    expect(document).toMatchSnapshot();
  });

  test('Swagger Parser validate', async () => {
    const document = exampleApi.synth();
    // WARN: this function mutates the input
    const result = await SwaggerParser.validate(structuredClone(document));
    expect(result).toMatchSnapshot();
  });
});

describe('Note Taking', () => {
  test('OpenAPI', async () => {
    const document = noteTakingApi.synth();
    expect(document).toMatchSnapshot();
  });

  test('Swagger Parser validate', async () => {
    const document = noteTakingApi.synth();
    // WARN: this function mutates the input
    const result = await SwaggerParser.validate(structuredClone(document));
    expect(result).toMatchSnapshot();
  });
});
