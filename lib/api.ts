import type { JSONSchema7 } from 'json-schema';
import type { oas31 } from 'openapi3-ts';
import { ApiLowLevel } from './ApiLowLevel.ts';
import { Parameter } from './parameter.ts';
import { Path } from './path.ts';
import { Reference } from './reference.ts';
import { Schema } from './schema.ts';
import { SecurityRequirement } from './security-requirement.ts';
import { SecurityScheme } from './security-scheme.ts';
import { Server } from './server.ts';
import { Tag } from './tag.ts';

export type OpenApiVersion  = '3.0' | '3.1.0';

export interface ApiOptions {
  openapi: OpenApiVersion;
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
