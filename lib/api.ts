import { Construct, IConstruct } from 'constructs';
import type { JSONSchema4, JSONSchema7 } from 'json-schema';
import type { OpenAPIV3_1 } from 'openapi-types';
import { Parameter } from './parameter.js';
import { Path } from './path.js';
import { Reference } from './reference.js';
import { Schema } from './schema.js';
import { SecurityRequirement } from './security-requirement.js';
import { SecurityScheme } from './security-scheme.js';

export enum OpenApiVersion {
  V2 = '2.0',
  V3 = '3.0',
  V3_1 = '3.1.0',
}

export interface ApiOptions {
  openapi: OpenApiVersion; //  | `${OpenApiVersion}`;
  info: OpenAPIV3_1.InfoObject;
}

export class Api extends Construct {
  private options: ApiOptions;

  constructor(options: ApiOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    super(undefined as any, '');

    this.options = options;
  }

  public static of(c: IConstruct): Api {
    const { scope } = c.node;

    if (!scope) {
      // Api is the only construct without a scope.
      return c as Api;
    }

    return Api.of(scope);
  }

  public synth(): OpenAPIV3_1.Document {
    const parameters = this.node
      .findAll()
      .filter((child): child is Parameter => child instanceof Parameter);

    return {
      openapi: this.options.openapi,
      info: this.options.info,
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
          parameters.map((child) => [child.schemaKey, child.synth()]),
        ),
        securitySchemes: Object.fromEntries(
          this.node.children
            .filter(
              (child): child is SecurityScheme =>
                child instanceof SecurityScheme,
            )
            .map((child) => [child.node.id, child.synth()]),
        ),
      },
      paths: Object.fromEntries(
        this.node
          .findAll()
          .filter((child): child is Path => child instanceof Path)
          .map((child) => [child.options.path, child.synth()]),
      ),
      security: this.node.children
        .filter(
          (child): child is SecurityRequirement =>
            child instanceof SecurityRequirement,
        )
        .map((child) => child.synth()),
    };
  }

  public synthJsonSchema(): JSONSchema4 | JSONSchema7 {
    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: Object.fromEntries(
        this.node.children
          .filter((child): child is Schema => child instanceof Schema)
          .map((child) => [child.schemaKey, child.synth()]),
      ),
    };
  }
}
