import { Construct } from 'constructs';
import type { OpenAPI } from 'openapi-types';

interface InfoOptions {
  title: string;
  version: string;
  summary?: string;
  description?: string;
  termsOfService?: string;
  contact?: string;
  license?: string;
}

export class Info extends Construct {
  private options: InfoOptions;

  constructor(scope: Construct, id: string, options: InfoOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): OpenAPI.Document['info'] {
    return {
      title: this.options.title,
      version: this.options.version,
    };
  }
}
