import { Construct } from 'constructs';
import type { OpenAPIV3 } from 'openapi-types';

interface SchemaOptions {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
}

export class Schema extends Construct {
  private options: SchemaOptions;

  constructor(scope: Construct, id: string, options: SchemaOptions) {
    super(scope, id);
    this.options = options;
  }

  public referenceObject(): OpenAPIV3.ReferenceObject {
    return {
      $ref: this.jsonPointer(),
    };
  }

  public jsonPointer(): string {
    return `#/components/schemas/${this.node.path}`;
  }

  public synth(): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject {
    return this.options.schema;
  }
}
