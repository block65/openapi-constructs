import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';

export class SecurityScheme extends Construct {
  private options: oas31.SecuritySchemeObject;

  constructor(
    scope: Construct,
    id: string,
    options: oas31.SecuritySchemeObject,
  ) {
    super(scope, id);
    this.options = options;
  }

  public get schemaKey() {
    return this.node.id;
  }

  public synth(): oas31.SecuritySchemeObject {
    return this.options;
  }
}
