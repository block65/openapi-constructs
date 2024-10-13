import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';

interface SchemaOptions<T extends OpenAPIV3_1.SchemaObject> {
  schema: T;
}

export class Schema<
  T extends OpenAPIV3_1.SchemaObject = OpenAPIV3_1.SchemaObject,
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

  public jsonPointer() {
    return `#/components/schemas/${this.schemaKey}`;
  }

  public referenceObject() {
    return {
      $ref: this.jsonPointer(),
    } satisfies OpenAPIV3_1.ReferenceObject;
  }

  // eslint-disable-next-line class-methods-use-this
  public validate() {
    return [];
  }

  public synth() {
    return this.options.schema;
  }
}
