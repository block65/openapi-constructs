import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import { MediaType, type MediaTypeOptions } from './media-type.js';

export interface RequestBodyOptions {
  content: MediaType | MediaTypeOptions;
  description?: string;
  required?: boolean;
}

export class RequestBody extends Construct {
  private options: RequestBodyOptions;

  private content: MediaType;

  constructor(scope: Construct, id: string, options: RequestBodyOptions) {
    super(scope, id);
    this.options = options;

    this.content =
      options.content instanceof MediaType
        ? options.content
        : new MediaType(this, id, options.content);
  }

  public synth(): OpenAPIV3_1.RequestBodyObject {
    return {
      description: this.options.description || '',
      content: {
        [this.options.content.contentType]: this.content.synth(),
      },
      ...(this.options.required && { required: this.options.required }),
    };
  }
}
