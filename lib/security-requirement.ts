import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import type { Api } from './api.js';
import type { SecurityScheme } from './security-scheme.js';

interface SecurityRequirementOptions {
  securityScheme?: SecurityScheme;
  scopes?: string[];
}

export class SecurityRequirement extends Construct {
  private options: SecurityRequirementOptions;

  constructor(
    scope: Api,
    id: string,
    options: SecurityRequirementOptions = {},
  ) {
    super(scope, id);
    this.options = options;
  }

  public synth(): OpenAPIV3_1.SecurityRequirementObject {
    return this.options.securityScheme
      ? {
          [this.options.securityScheme.node.id]: this.options.scopes || [],
        }
      : {};
  }
}
