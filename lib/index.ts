/* eslint-disable max-classes-per-file */
import { Construct } from 'constructs';
import { OpenAPIV3 } from 'openapi-types';

export const { HttpMethods } = OpenAPIV3;

// export the version of Constructs we are using to ensure we're
// everyone is using the same version
export { Construct };

export { Api, OpenApiVersion } from './api.js';
export { Parameter } from './parameter.js';
export { Path } from './path.js';
export { Reference } from './reference.js';
export { Response } from './response.js';
export { Schema } from './schema.js';
export { SecurityRequirement } from './security-requirement.js';
export { SecurityScheme } from './security-scheme.js';
export { Server } from './server.js';
export { Tag } from './tag.js';

export class ServerVariable extends Construct {}

export class ExternalDocumentation extends Construct {}

export class Callback extends Construct {}

export class Example extends Construct {}

export class Link extends Construct {}

export class Discriminator extends Construct {}

export class OauthFlow extends Construct {}
