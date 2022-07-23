import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import type { Api } from './api.js';

interface ServerOptions {
  url: string;
  description?: string;
}

export class Server extends Construct {
  private options: ServerOptions;

  constructor(scope: Api, id: string, options: ServerOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): OpenAPIV3_1.ServerObject {
    return this.options;
  }
}
