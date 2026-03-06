import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
import type { Api } from './api.ts';
import type { HttpMethod } from './http-method.ts';
import { Operation, type OperationOptions } from './operation.ts';
import type { Parameter } from './parameter.ts';
import type { Server } from './server.ts';
import type { Tag } from './tag.ts';
import type { ExtractRouteParams } from './types.ts';

interface PathOptions<TPath extends string> {
  path: TPath;
  summary?: string;
  servers?: Server[];
  parameters?: Parameter<keyof ExtractRouteParams<TPath>>[];
  tags?: Set<Tag>;
}

export class Path<TPath extends string = '/'> extends Construct {
  public options: PathOptions<TPath>;

  constructor(scope: Api, options: PathOptions<TPath>) {
    super(scope, options.path);
    this.options = options;
  }

  public addOperation(
    method: HttpMethod,
    options: OperationOptions<TPath>,
  ): this {
    // make sure we are not duplicating tags
    // options.tags?.forEach((tag) => strict(!this.options.tags?.has(tag)));

    // eslint-disable-next-line no-new
    new Operation(this, method, {
      ...options,
      tags: new Set([...(this.options.tags || []), ...(options.tags || [])]),
    });
    return this;
  }

  public get schemaKey() {
    return this.options.path;
  }

  public synth() {
    return {
      ...Object.fromEntries(
        this.node
          .findAll()
          .filter(
            (child): child is Operation<TPath> => child instanceof Operation,
          )
          .sort((a, b) => a.order - b.order)
          .map((child) => [child.method, child.synth()]),
      ),
      ...(this.options.servers && {
        servers: this.options.servers.map((child) => child.synth()),
      }),
      ...(this.options.parameters && {
        parameters: this.options.parameters.map((child) =>
          child.referenceObject(),
        ),
      }),
      ...(this.options.summary && { summary: this.options.summary }),
    } satisfies oas31.PathItemObject;
  }
}
