/* eslint-disable max-classes-per-file */
import { Construct, IConstruct } from 'constructs';
import type { OpenAPI, OpenAPIV3_1 } from 'openapi-types';
import type { SetRequired } from 'type-fest';

export enum OpenApiVersion {
  V2 = '2.0',
  V3 = '3.0',
  V3_1 = '3.1.0',
}

interface DocumentOptions {
  openapi: OpenApiVersion; //  | `${OpenApiVersion}`;
  info?: OpenAPI.Document['info'];
}


interface InfoOptions {
  title: string;
  version: string;
  summary?: string;
  description?: string;
  termsOfService?: string;
  contact?: string;
  license?: string;
}
export class Info extends Construct {
  private options: InfoOptions;

  constructor(scope: Construct, id: string, options: InfoOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): OpenAPI.Document['info'] {
    return {
      title: this.options.title,
      version: this.options.version,
    };
  }
}




export class Contact extends Construct {}

export class License extends Construct {}

export class Server extends Construct {}

type ParameterObjectFromPathParam<TParam extends string> = {
  name: TParam | string;
} & SetRequired<Omit<OpenAPIV3_1.ParameterObject, 'name'>, 'schema' | 'required'>

interface OperationOptions<TPath extends string> {
  summary?: string;
  description?: string;
  tags?: string[];
  operationId?: string;
  deprecated?: boolean;
  parameters?: ParameterObjectFromPathParam<TPath>[];
}

export class Operation<TPath extends string> extends Construct {
  private readonly options: OperationOptions<TPath>;

  public readonly method: OpenAPIV3_1.HttpMethods;

  constructor(scope: Construct, method: OpenAPIV3_1.HttpMethods, options: OperationOptions<TPath>) {
    super(scope, method);
    this.method = method;
    this.options = options;
  }


  public synth(): OpenAPIV3_1.OperationObject {
    return {
      ...this.options.operationId && {operationId: this.options.operationId,},
      ...this.options.parameters && {parameters: this.options.parameters,},
      // requestBody: {
      //   content: {}
      // }
    };
  }
}

interface PathOptions<TPath extends string> {
  path: TPath;
}
export class Path<TPath extends string = '/'> extends Construct {
  public options: PathOptions<TPath>;

  constructor(scope: Construct, options: PathOptions<TPath>) {
    super(scope, options.path);
    this.options = options;
  }

  public addOperation(method: OpenAPIV3_1.HttpMethods, options: OperationOptions<TPath>) {
    return new Operation(this, method, options);
  }

  public synth(): OpenAPIV3_1.PathItemObject {
    return Object.fromEntries(this.node
      .findAll()
      .filter((child): child is Operation<TPath> => child instanceof Operation)
      .map((child) => [child.method, child.synth()]));
  }
}

export class ServerVariable extends Construct {}



export class Api extends Construct {
  private openapi: OpenApiVersion;

  constructor(options: DocumentOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    super(undefined as any, '');

    this.openapi = options.openapi;
  }

  public static of(c: IConstruct): Api {
    const { scope } = c.node;

    if (!scope) {
      // Api is the only construct without a scope.
      return c as Api;
    }

    return Api.of(scope);
  }

  public synth(): OpenAPIV3_1.Document {
    const [info] = this.node
      .findAll()
      .filter((child): child is Info => child instanceof Info);

    if (!info) {
      throw new Error('bad');
    }

    const schemas = this.node
      .findAll()
      .filter((child): child is Schema => child instanceof Schema);

    return {
      openapi: this.openapi,
      info: info.synth(),
      components: {
        schemas: schemas.reduce<
          Required<OpenAPIV3_1.ComponentsObject>['schemas']
        >((acc, schema) => {
          acc[schema.name] = schema.synth();
          return acc;
        }, {}),
      },
      paths: Object.fromEntries(this.node
        .findAll()
        .filter((child): child is Path => child instanceof Path)
        .map((path) => [path.options.path, path.synth()]))
    };
  }
}


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

export class Tag extends Construct {}

export class Reference extends Construct {}

interface SchemaOptions {
  schema: OpenAPIV3_1.SchemaObject;
}
export class Schema extends Construct {
  private options: SchemaOptions;

  public name: string;

  constructor(scope: Construct, id: string, options: SchemaOptions) {
    super(scope, id);
    this.options = options;
    this.name = id;
  }

  public toJSON(): OpenAPIV3_1.ReferenceObject {
    return {
      $ref: this.jsonPointer()
    };
  }

  public jsonPointer(): string {
    return `#/components/schemas/${this.name}`;
  }

  public synth(): OpenAPIV3_1.SchemaObject {
    return {
      ...this.options.schema,
    };
  }
}

export class Discriminator extends Construct {}

export class SecurityScheme extends Construct {}

export class OauthFlow extends Construct {}

export class SecurityRequirement extends Construct {}
