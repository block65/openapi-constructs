import { Construct, type IConstruct } from 'constructs';
import type { Api } from './api.js';

export class ApiLowLevel extends Construct {
  public static of(c: IConstruct): Api {
    const { scope } = c.node;

    if (!scope) {
      // Api is the only construct without a scope.
      return c as Api;
    }

    return ApiLowLevel.of(scope);
  }
}
