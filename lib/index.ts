/* eslint-disable max-classes-per-file */
import { Construct } from 'constructs';
import type { OpenAPIV3_1 } from 'openapi-types';
import type { SetRequired } from 'type-fest';

export type ParameterObjectFromPathParam<TParam extends string> = {
  name: TParam | string;
} & SetRequired<
  Omit<OpenAPIV3_1.ParameterObject, 'name'>,
  'schema' | 'required'
>;

export class ServerVariable extends Construct {}

export class ExternalDocumentation extends Construct {}

export class Callback extends Construct {}

export class Example extends Construct {}

export class Link extends Construct {}

export class Discriminator extends Construct {}

export class OauthFlow extends Construct {}
