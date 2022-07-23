import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';

interface TagOptions {
  name: string;
  description?: string;
  externalDocs?: OpenAPIV3_1.ExternalDocumentationObject;
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

  public synth(): OpenAPIV3_1.TagObject {
    return this.options;
  }
}
