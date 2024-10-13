import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import { ApiLowLevel } from './ApiLowLevel.js';
import { Schema } from './schema.js';

type Target = Schema; // | Parameter;

export class Reference<T extends Target> extends Construct {
  private schema: Schema;

  constructor(target: T, id: string) {
    super(target, id);
    // NOTE: Api.of causes a circular dependency
    this.schema = new Schema(ApiLowLevel.of(this), id, {
      // NOTE: synth because refs are not valid as #/component/schemas
      // if it did, we could use referenceObject here instead
      schema: target.synth(),
    });
  }

  public get schemaKey() {
    return this.schema.schemaKey;
  }

  public synth(): OpenAPIV3_1.ReferenceObject {
    return this.schema.referenceObject();
  }
}
