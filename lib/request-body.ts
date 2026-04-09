import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
import { MediaType, type MediaTypeOptions } from './media-type.ts';

export interface RequestBodyOptions {
  content: MediaType | MediaTypeOptions | (MediaType | MediaTypeOptions)[];
  description?: string;
  required?: boolean;
}

export class RequestBody extends Construct {
  private options: RequestBodyOptions;

  private contentEntries: MediaType[];

  constructor(scope: Construct, id: string, options: RequestBodyOptions) {
    super(scope, id);
    this.options = {
      required: true,
      ...options,
    };

    const items = Array.isArray(options.content)
      ? options.content
      : [options.content];

    this.contentEntries = items.map((item, index) =>
      item instanceof MediaType
        ? item
        : new MediaType(this, `${id}${index}`, item),
    );
  }

  public synth(): oas31.RequestBodyObject {
    return {
      description: this.options.description || '',
      content: Object.fromEntries(
        this.contentEntries.map((entry) => [
          entry.contentType,
          entry.synth(),
        ]),
      ),
      ...(this.options.required && { required: this.options.required }),
    };
  }
}
