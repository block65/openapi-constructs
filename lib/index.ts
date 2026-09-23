import { Construct } from "constructs";

// consumers build on this copy of constructs, so their constructs and ours
// share one class
export { Construct } from "constructs";

export { Api } from "./api.ts";
export { Header } from "./header.ts";
export { Parameter } from "./parameter.ts";
export { Path } from "./path.ts";
export { Reference } from "./reference.ts";
export { Response } from "./response.ts";
export { Schema, type SchemaOptions } from "./schema.ts";
export { SecurityRequirement } from "./security-requirement.ts";
export { SecurityScheme } from "./security-scheme.ts";
export { Server } from "./server.ts";
export { Tag } from "./tag.ts";

export class ServerVariable extends Construct {}

export class ExternalDocumentation extends Construct {}

export class Callback extends Construct {}

export class Example extends Construct {}

export class Link extends Construct {}

export class Discriminator extends Construct {}

export class OauthFlow extends Construct {}
