import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import { Api } from './api.js';
import { Schema } from './schema.js';

type Target = Schema; // | Parameter;

export class Reference<T extends Target> extends Construct {
  private schema: Schema;

  constructor(target: T, id: string) {
    super(target, id);
    this.schema = new Schema(Api.of(this), `${id}Ref`, {
      schema: target.synth(),
    });
  }

  public synth(): OpenAPIV3_1.ReferenceObject {
    return this.schema.referenceObject();
  }

  public static from<T extends Target>(target: T): Reference<T> {
    return new Reference(target, `${target.node.id}From`);
  }
}
