/* eslint-disable @typescript-eslint/no-unused-vars */
export type ExtractRouteParams<T> = string extends T
  ? Record<string, string>
  : T extends `${infer _Start}{${infer Param}}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer _Start}{${infer Param}}`
  ? { [k in Param]: string }
  : Record<string, never>;
