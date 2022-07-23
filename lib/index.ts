/* eslint-disable max-classes-per-file */
import { Construct } from 'constructs';
import type { OpenAPI, OpenAPIV3_1 } from 'openapi-types';
import type { SetRequired } from 'type-fest';

export enum OpenApiVersion {
  V2 = '2.0',
  V3 = '3.0',
  V3_1 = '3.1.0',
}

export interface DocumentOptions {
  openapi: OpenApiVersion; //  | `${OpenApiVersion}`;
  info?: OpenAPI.Document['info'];
}

export class Contact extends Construct {}

export class License extends Construct {}

export type ParameterObjectFromPathParam<TParam extends string> = {
  name: TParam | string;
} & SetRequired<
  Omit<OpenAPIV3_1.ParameterObject, 'name'>,
  'schema' | 'required'
>;

export class ServerVariable extends Construct {}

// interface PathItemOptions {
//   // path: string;
//   summary?: string;
//   description?: string;
// }
// export class PathItem extends Construct {
//   private readonly options: PathItemOptions;

//   public readonly path: IConstruct;

//   constructor(scope: Construct, path: string, options: PathItemOptions = {}) {
//     super(scope, path);
//     this.options = options;

//     this.path = Api.of(this).node.tryFindChild(path) || new Path(this, path, {
//       path
//     });
//   }

//   public synth(): OpenAPIV3_1.PathItemObject {
//     return {
//       ...this.options.summary && {
//         summary: this.options.summary,
//       },
//       ...this.options.description && {
//         description: this.options.description,
//       },
//       servers: [],
//       parameters: [],
//       ...Object.fromEntries(this.node.children
//         .filter((child): child is Operation => child instanceof Operation)
//         .map((child) => [child.method, child.synth()])),
//     };
//   }
// }

export class ExternalDocumentation extends Construct {}

export class Parameter extends Construct {}

export class RequestBody extends Construct {}

export class MediaType extends Construct {}

export class Encoding extends Construct {}

export class Response extends Construct {}

export class Callback extends Construct {}

export class Example extends Construct {}

export class Link extends Construct {}

export class Header extends Construct {}

export class Reference extends Construct {}

export class Discriminator extends Construct {}

export class OauthFlow extends Construct {}
