import { Construct, IConstruct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import { Parameter } from './parameter.js';
import { Path } from './path.js';
import { Schema } from './schema.js';
import { SecurityRequirement } from './security-requirement.js';
import { SecurityScheme } from './security-scheme.js';
import type { OpenApiVersion } from './index.js';

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
    const schemas = this.node.children.filter(
      (child): child is Schema => child instanceof Schema,
    );

    const parameters = this.node
      .findAll()
      .filter((child): child is Parameter => child instanceof Parameter);

    return {
      openapi: this.options.openapi,
      info: this.options.info,
      components: {
        schemas: Object.fromEntries(
          schemas.map((child) => [
            child.node.id,
            child.synth() as OpenAPIV3_1.SchemaObject,
          ]),
        ),
        parameters: Object.fromEntries(
          parameters.map((child) => [child.node.id, child.synth()]),
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
}
