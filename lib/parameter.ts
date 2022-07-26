import { Construct } from 'constructs';
import type { OpenAPIV3 } from 'openapi-types';
import type { Api } from './api.js';
import type { Schema } from './schema.js';

interface ParameterOptionsBase<TName extends string | number | symbol> {
  name: TName;
  in: 'query' | 'header' | 'path' | 'cookie';
  required: boolean;
  description?: string;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: 'simple';
}

interface ParameterOptions<TName extends string | number | symbol>
  extends ParameterOptionsBase<TName> {
  schema: Schema;
}

// interface ParameterOptions<TName extends string | number | symbol>
//   extends ParameterOptionsBase<TName> {
//   content: unknown;
// }

export class Parameter<
  TName extends string | number | symbol = '',
> extends Construct {
  private options: ParameterOptions<TName>;

  constructor(scope: Api, id: string, options: ParameterOptions<TName>) {
    super(scope, id);
    this.options = options;
  }

  public referenceObject(): OpenAPIV3.ReferenceObject {
    return {
      $ref: this.jsonPointer(),
    };
  }

  public get schemaKey() {
    return this.node.id;
  }

  public jsonPointer(): string {
    return `#/components/parameters/${this.schemaKey}`;
  }

  public synth(): OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject {
    return {
      name: this.options.name.toString(),
      in: this.options.in,
      required: this.options.required,
      ...(this.options.allowEmptyValue && {
        allowEmptyValue: this.options.allowEmptyValue,
      }),
      ...(this.options.style && { style: this.options.style }),
      ...(this.options.schema && {
        schema: this.options.schema.referenceObject(),
      }),
    };
  }
}
