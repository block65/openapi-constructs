import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
import { Reference } from './reference.ts';
import type { Schema } from './schema.ts';

type ContentType =
  | 'application/json'
  | 'application/octet-stream'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | 'image/*'
  | (string & {});

export interface MediaTypeOptions {
  contentType: ContentType;
  schema: Schema | Reference<Schema>;
}

export class MediaType extends Construct {
  private options: MediaTypeOptions;

  public get contentType() {
    return this.options.contentType;
  }

  constructor(scope: Construct, id: string, options: MediaTypeOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): oas31.MediaTypeObject {
    return {
      schema:
        this.options.schema instanceof Reference
          ? this.options.schema.synth()
          : this.options.schema.referenceObject(),
    };
  }
}
