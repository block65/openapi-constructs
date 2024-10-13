import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
import type { Api } from './api.js';

interface ServerOptions {
  url: URL;
  description?: string;
}

export class Server extends Construct {
  private options: ServerOptions;

  constructor(scope: Api, id: string, options: ServerOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): oas31.ServerObject {
    return {
      url: this.options.url.toString(),
      ...(this.options.description && {
        description: this.options.description,
      }),
    };
  }
}
