import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';

export class Tag<
  T extends oas31.TagObject = oas31.TagObject,
> extends Construct {
  private options: T;

  public get name() {
    return this.options.name;
  }

  constructor(scope: Construct, id: string, options: T) {
    super(scope, id);
    this.options = options;
  }

  public synth() {
    return this.options;
  }
}
