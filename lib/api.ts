import type { JSONSchema7 } from 'json-schema';
import type { oas31 } from 'openapi3-ts';
import { ApiLowLevel } from './ApiLowLevel.js';
import { Parameter } from './parameter.js';
import { Path } from './path.js';
import { Reference } from './reference.js';
import { Schema } from './schema.js';
import { SecurityRequirement } from './security-requirement.js';
import { SecurityScheme } from './security-scheme.js';
import { Server } from './server.js';
import { Tag } from './tag.js';

export enum OpenApiVersion {
  // V2 = '2.0',
  V3 = '3.0',
  V3_1 = '3.1.0',
}

export interface ApiOptions {
  openapi: OpenApiVersion; //  | `${OpenApiVersion}`;
  info: oas31.InfoObject;
}

export class Api extends ApiLowLevel {
  private options: ApiOptions;

  constructor(options: ApiOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    super(undefined as any, '');

    this.options = options;
  }

  public synth() {
    return {
      openapi: this.options.openapi,
      info: this.options.info,
      servers: this.node.children
        .filter((child): child is Server => child instanceof Server)
        .map((child) => child.synth()),
      tags: this.node.children
        .filter((child): child is Tag => child instanceof Tag)
        .map((child) => child.synth()),
      components: {
        schemas: Object.fromEntries(
          this.node.children
            .filter(
              (child): child is Schema | Reference<Schema> =>
                child instanceof Schema || child instanceof Reference,
            )
            .map((child) => [child.schemaKey, child.synth()]),
        ),
        parameters: Object.fromEntries(
          this.node.children
            .filter((child): child is Parameter => child instanceof Parameter)
            .map((child) => [child.schemaKey, child.synth()]),
        ),
        securitySchemes: Object.fromEntries(
          this.node.children
            .filter(
              (child): child is SecurityScheme =>
                child instanceof SecurityScheme,
            )
            .map((child) => [child.schemaKey, child.synth()]),
        ),
      },
      paths: Object.fromEntries(
        this.node.children
          .filter((child): child is Path => child instanceof Path)
          .map((child) => [child.schemaKey, child.synth()]),
      ),
      security: this.node.children
        .filter(
          (child): child is SecurityRequirement =>
            child instanceof SecurityRequirement,
        )
        .map((child) => child.synth()),
    } satisfies oas31.OpenAPIObject;
  }

  public synthJsonSchema() {
    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: Object.fromEntries(
        this.node.children
          .filter((child): child is Schema => child instanceof Schema)
          .map((child) => [child.schemaKey, child.synth()]),
      ),
    } satisfies JSONSchema7;
  }
}
