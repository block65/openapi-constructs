import type { Parameter } from './parameter.ts';

/* eslint-disable @typescript-eslint/no-unused-vars */
export type ExtractRouteParams<T> = string extends T
  ? Record<string, string>
  : T extends `${infer _Start}{${infer Param}}/${infer Rest}`
    ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
    : T extends `${infer _Start}{${infer Param}}`
      ? { [k in Param]: string }
      : Record<string, never>;

export type ValidParameter<TPath extends string> =
  | Parameter<keyof ExtractRouteParams<TPath>, 'path'>
  | Parameter<string, 'query'>
  | Parameter<string, 'header'>
  | Parameter<string, 'cookie'>;
