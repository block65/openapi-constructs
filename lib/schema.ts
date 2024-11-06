import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';

type InferExample<T> = T extends oas31.ReferenceObject
  ? any
  : T extends {
        type: 'string';
      }
    ? string
    : T extends {
          type: 'number' | 'integer';
        }
      ? number
      : T extends {
            type: 'boolean';
          }
        ? boolean
        : T extends oas31.SchemaObject & { type: 'object' }
          ? {
              [K in keyof T['properties']]: InferExample<T['properties'][K]>;
            }
          : T extends oas31.SchemaObject & { type: 'array' }
            ? InferExample<T['items']>[]
            : any;

export type SchemaOptions<T extends oas31.SchemaObject> = {
  schema: T & {
    examples?: InferExample<T>[];
  };
};

export class Schema<
  const T extends oas31.SchemaObject = oas31.SchemaObject,
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
    return {
      // default to disallow additional properties on objects
      ...(this.options.schema.type === 'object' && {
        additionalProperties: false,
      }),
      ...this.options.schema,
    };
  }
}
