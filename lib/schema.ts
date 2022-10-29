import { Construct } from 'constructs';
import type { OpenAPIV3 } from 'openapi-types';

interface SchemaOptions<T extends OpenAPIV3.SchemaObject> {
  schema: T;
}

export class Schema<
  T extends OpenAPIV3.SchemaObject = OpenAPIV3.SchemaObject,
> extends Construct {
  private options: SchemaOptions<T>;

  constructor(scope: Construct, id: string, options: SchemaOptions<T>) {
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

  public synth(): T {
    return this.options.schema;
  }
}
