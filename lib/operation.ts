import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
import type { HttpMethods } from './http-methods.js';
import type { Parameter } from './parameter.js';
import { RequestBody, type RequestBodyOptions } from './request-body.js';
import type { Response } from './response.js';
import type { SecurityRequirement } from './security-requirement.js';
import type { Tag } from './tag.js';
import type { ExtractRouteParams } from './types.js';
import { stripUndefined } from './utils.js';

export interface OperationOptions<TPath extends string = '/'> {
  operationId: string;
  summary?: string;
  description?: string;
  tags?: Set<Tag>;
  deprecated?: boolean;
  parameters?: Parameter<keyof ExtractRouteParams<TPath>>[];
  security?: SecurityRequirement;
  responses?: {
    [statusCode: string | number]: Response;
  };
  requestBody?: RequestBody | RequestBodyOptions;
  order?: number;
}

export class Operation<TPath extends string = '/'> extends Construct {
  private readonly options: OperationOptions<TPath>;

  public readonly method: HttpMethods;

  public readonly order: number;

  private requestBody?: RequestBody;

  public hasOperationId(operationId: OperationOptions['operationId']): boolean {
    return this.options.operationId === operationId;
  }

  constructor(
    scope: Construct,
    method: HttpMethods,
    options: OperationOptions<TPath>,
  ) {
    super(scope, method);
    this.method = method;
    this.options = options;

    this.order = options.order || 0;

    if (options.requestBody) {
      this.requestBody =
        options.requestBody instanceof RequestBody
          ? options.requestBody
          : new RequestBody(this, method, options.requestBody);
    }
  }

  public validate() {
    // const api = Api.of(this).node.findChild;

    const duplicateOperation = this.node.scope?.node.children
      .filter(
        (child): child is Operation =>
          child instanceof Operation && child !== this,
      )
      .find((child) => child.hasOperationId(this.options.operationId));

    if (duplicateOperation) {
      return [`Duplicate operationId ${this.options.operationId}`];
    }

    return [];
  }

  public synth() {
    return stripUndefined({
      operationId: this.options.operationId,
      description: this.options.description || undefined,
      summary: this.options.summary || undefined,
      tags:
        this.options.tags && [...this.options.tags].map((child) => child.name),
      deprecated: this.options.deprecated,
      ...(this.options.parameters && {
        parameters: this.options.parameters.map((child) => child.synth()),
      }),
      ...(this.options.security && {
        security: [this.options.security.synth()],
      }),
      ...(this.options.tags && {
        tags: Array.from(this.options.tags).map((child) => child.name),
      }),
      ...(this.requestBody && {
        requestBody: this.requestBody.synth(),
      }),
      ...(this.options.responses && {
        responses: Object.fromEntries(
          Object.entries(this.options.responses).map(([statusCode, child]) => [
            statusCode.toString(),
            child.synth(),
          ]),
        ),
      }),
    }) satisfies oas31.OperationObject;
  }
}
