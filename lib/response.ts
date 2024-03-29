import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import type { Header } from './header.js';
import { MediaType, type MediaTypeOptions } from './media-type.js';

interface ResponseOptions {
  content?: MediaType | MediaTypeOptions;
  description?: string;
  headers?: Header[];
}

export class Response extends Construct {
  private options: ResponseOptions;

  private content?: MediaType | undefined;

  constructor(scope: Construct, id: string, options: ResponseOptions = {}) {
    super(scope, id);
    this.options = options;

    if (options.content) {
      this.content =
        options.content instanceof MediaType
          ? options.content
          : new MediaType(this, `${id}MediaType`, options.content);
    }
  }

  public synth(): OpenAPIV3_1.ResponseObject {
    return {
      description: this.options.description || '',
      content: {
        ...(this.content && {
          [this.content.contentType]: this.content.synth(),
        }),
      },
    };
  }
}
