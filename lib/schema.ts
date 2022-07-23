import { Construct } from 'constructs';
import type { OpenAPIV3 } from 'openapi-types';

interface SchemaOptions {
  schema: OpenAPIV3.SchemaObject;
}

export class Schema extends Construct {
  private options: SchemaOptions;

  constructor(scope: Construct, id: string, options: SchemaOptions) {
    super(scope, id);

    this.options = options;
  }

  public get schema() {
    return this.options.schema;
  }

  public get schemaKey() {
    return this.node.id;
  }

  public jsonPointer(): string {
    return `#/components/schemas/${this.schemaKey}`;
  }

  public referenceObject(): OpenAPIV3.ReferenceObject {
    return {
      $ref: this.jsonPointer(),
    };
  }

  public validate() {
    return [];
  }

  public synth(): OpenAPIV3.SchemaObject {
    return this.options.schema;
  }
}
