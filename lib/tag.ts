import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';

interface TagOptions {
  name: string;
  description?: string;
  externalDocs?: oas31.ExternalDocumentationObject;
}

export class Tag extends Construct {
  private options: TagOptions;

  public get name() {
    return this.options.name;
  }

  constructor(scope: Construct, id: string, options: TagOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): oas31.TagObject {
    return this.options;
  }
}
