import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';

interface SchemaOptions {
  schema: OpenAPIV3_1.SchemaObject;
}
export class Schema extends Construct {
  private options: SchemaOptions;

  public name: string;

  constructor(scope: Construct, id: string, options: SchemaOptions) {
    super(scope, id);
    this.options = options;
    this.name = id;
  }

  public toJSON(): OpenAPIV3_1.ReferenceObject {
    return {
      $ref: this.jsonPointer(),
    };
  }

  public jsonPointer(): string {
    return `#/components/schemas/${this.name}`;
  }

  public synth(): OpenAPIV3_1.SchemaObject {
    return {
      ...this.options.schema,
    };
  }
}
