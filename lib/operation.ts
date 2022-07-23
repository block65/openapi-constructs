import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import type { SecurityRequirement } from './security-requirement.js';
import type { Tag } from './tag.js';
import type { ParameterObjectFromPathParam } from './index.js';

export interface OperationOptions<TPath extends string> {
  summary?: string;
  description?: string;
  tags?: Tag[];
  operationId?: string;
  deprecated?: boolean;
  parameters?: ParameterObjectFromPathParam<TPath>[];
  security?: SecurityRequirement;
}

export class Operation<TPath extends string> extends Construct {
  private readonly options: OperationOptions<TPath>;

  public readonly method: OpenAPIV3_1.HttpMethods;

  constructor(
    scope: Construct,
    method: OpenAPIV3_1.HttpMethods,
    options: OperationOptions<TPath>,
  ) {
    super(scope, method);
    this.method = method;
    this.options = options;
  }

  public synth(): OpenAPIV3_1.OperationObject {
    return {
      ...(this.options.operationId && {
        operationId: this.options.operationId,
      }),
      ...(this.options.parameters && { parameters: this.options.parameters }),
      ...(this.options.security && {
        security: [this.options.security.synth()],
      }),
      ...(this.options.tags && {
        tags: this.options.tags.map((child) => child.name),
      }),
    };
  }
}
