import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';

export class SecurityScheme extends Construct {
  private options: OpenAPIV3_1.SecuritySchemeObject;

  constructor(
    scope: Construct,
    id: string,
    options: OpenAPIV3_1.SecuritySchemeObject,
  ) {
    super(scope, id);
    this.options = options;
  }

  public synth(): OpenAPIV3_1.SecuritySchemeObject {
    return this.options;
  }
}
