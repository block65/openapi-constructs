/* eslint-disable max-classes-per-file */
import { Construct } from 'constructs';
import { OpenAPIV3 } from 'openapi-types';

export const { HttpMethods } = OpenAPIV3;

// export the version of Constructs we are using to ensure we're
// everyone is using the same version
export { Construct };

export { Api, OpenApiVersion } from '../lib/api.js';
export { Parameter } from '../lib/parameter.js';
export { Path } from '../lib/path.js';
export { Reference } from '../lib/reference.js';
export { Response } from '../lib/response.js';
export { Schema } from '../lib/schema.js';
export { SecurityRequirement } from '../lib/security-requirement.js';
export { SecurityScheme } from '../lib/security-scheme.js';
export { Server } from '../lib/server.js';
export { Tag } from '../lib/tag.js';

export class ServerVariable extends Construct {}

export class ExternalDocumentation extends Construct {}

export class Callback extends Construct {}

export class Example extends Construct {}

export class Link extends Construct {}

export class Discriminator extends Construct {}

export class OauthFlow extends Construct {}
