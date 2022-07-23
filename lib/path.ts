import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import type { OperationOptions, Operation } from './operation.js';
import type { Server } from './server.js';

interface PathOptions<TPath extends string> {
  path: TPath;
  summary?: string;
  servers?: Server[];
}

export class Path<TPath extends string = '/'> extends Construct {
  public options: PathOptions<TPath>;

  constructor(scope: Construct, options: PathOptions<TPath>) {
    super(scope, options.path);
    this.options = options;
  }

  public addOperation(
    method: OpenAPIV3_1.HttpMethods,
    options: OperationOptions<TPath>,
  ): this {
    // eslint-disable-next-line no-new
    new Operation(this, method, options);
    return this;
  }

  public synth(): OpenAPIV3_1.PathItemObject {
    return {
      ...Object.fromEntries(
        this.node
          .findAll()
          .filter(
            (child): child is Operation<TPath> => child instanceof Operation,
          )
          .map((child) => [child.method, child.synth()]),
      ),
      ...(this.options.servers && {
        servers: this.options.servers.map((child) => child.synth()),
      }),
      ...(this.options.summary && { summary: this.options.summary }),
    };
  }
}
