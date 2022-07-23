import { Construct, IConstruct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import { Info } from './info.js';
import { Path } from './path.js';
import { Schema } from './schema.js';
import { SecurityRequirement } from './security-requirement.js';
import { SecurityScheme } from './security-scheme.js';
import type { DocumentOptions, OpenApiVersion } from './index.js';

export class Api extends Construct {
  private openapi: OpenApiVersion;

  constructor(options: DocumentOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    super(undefined as any, '');

    this.openapi = options.openapi;
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
    const [info] = this.node
      .findAll()
      .filter((child): child is Info => child instanceof Info);

    if (!info) {
      throw new Error('bad');
    }

    const schemas = this.node
      .findAll()
      .filter((child): child is Schema => child instanceof Schema);

    return {
      openapi: this.openapi,
      info: info.synth(),
      components: {
        schemas: schemas.reduce<
          Required<OpenAPIV3_1.ComponentsObject>['schemas']
        >((acc, schema) => {
          acc[schema.name] = schema.synth();
          return acc;
        }, {}),
        securitySchemes: Object.fromEntries(
          this.node
            .findAll()
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
