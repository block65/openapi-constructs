import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';

type InferExample<TSchema, TStopRecurse extends boolean = false> = TSchema extends oas31.ReferenceObject
  ? any
  : TSchema extends {
        type: 'string';
      }
    ? string
    : TSchema extends {
          type: 'number' | 'integer';
        }
      ? number
      : TSchema extends {
            type: 'boolean';
          }
        ? boolean
        : TSchema extends oas31.SchemaObject & { type: 'object' }
          ? {
              [K in keyof TSchema['properties']]: TStopRecurse extends true ? unknown : InferExample<TSchema['properties'][K], true>;
            }
          : TSchema extends oas31.SchemaObject & { type: 'array' }
            ? TStopRecurse extends true ? unknown : InferExample<TSchema['items']>[]
            : any;


export type SchemaOptions<T extends Omit<oas31.SchemaObject, 'required'>> = {
  schema: T & {
    examples?: InferExample<T>[];
    required?: T extends { type: 'object', properties: infer P } ? (keyof P)[] : string[];
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
