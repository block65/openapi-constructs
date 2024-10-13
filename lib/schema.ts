import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';

interface SchemaOptions<T extends oas31.SchemaObject> {
  schema: T;
}

export class Schema<
  T extends oas31.SchemaObject = oas31.SchemaObject,
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

  public referenceObject(): oas31.ReferenceObject {
    return {
      $ref: this.jsonPointer(),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  public validate() {
    return [];
  }

  public synth() {
    return this.options.schema;
  }
}
