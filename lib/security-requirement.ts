import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
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

  public synth(): oas31.SecurityRequirementObject {
    return this.options.securityScheme
      ? {
          [this.options.securityScheme.node.id]: this.options.scopes || [],
        }
      : {};
  }
}
