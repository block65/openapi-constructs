import { Construct } from "constructs";
import type { oas31 } from "openapi3-ts";
import type { Api } from "./api.ts";
import type { Schema } from "./schema.ts";

type StyleForIn<TIn extends "query" | "header" | "path" | "cookie"> =
	TIn extends "path"
		? "matrix" | "label" | "simple"
		: TIn extends "query"
			? "form" | "spaceDelimited" | "pipeDelimited" | "deepObject"
			: TIn extends "header"
				? "simple"
				: TIn extends "cookie"
					? "form"
					: never;

type ParameterName<
	TName extends string | number | symbol,
	TIn extends "query" | "header" | "path" | "cookie",
> = TIn extends "header" ? TName & Lowercase<TName & string> : TName;

type ParameterOptionsBase<
	TName extends string | number | symbol,
	TIn extends "query" | "header" | "path" | "cookie",
> = {
	name: ParameterName<TName, TIn>;
	in: TIn;
	required: boolean;
	description?: string;
	deprecated?: boolean;
	allowEmptyValue?: boolean;
	allowReserved?: boolean;
	style?: StyleForIn<TIn>;
	explode?: boolean;
};

interface ParameterOptions<
	TName extends string | number | symbol,
	TIn extends "query" | "header" | "path" | "cookie",
> extends ParameterOptionsBase<TName, TIn> {
	schema: Schema;
}

export class Parameter<
	TName extends string | number | symbol = "",
	TIn extends "query" | "header" | "path" | "cookie" = "query",
> extends Construct {
	private options: ParameterOptions<TName, TIn>;

	constructor(scope: Api, id: string, options: ParameterOptions<TName, TIn>) {
		super(scope, id);
		this.options = options;
	}

	public referenceObject(): oas31.ReferenceObject {
		return {
			$ref: this.jsonPointer(),
		};
	}

	public get schemaKey() {
		return this.node.id;
	}

	public jsonPointer(): string {
		return `#/components/parameters/${this.schemaKey}`;
	}

	public synth() {
		return {
			name: this.options.name.toString(),
			in: this.options.in,
			...(this.options.description && {
				description: this.options.description,
			}),
			...(this.options.allowReserved && {
				allowReserved: this.options.allowReserved,
			}),
			required: this.options.required,
			...(this.options.allowEmptyValue && {
				allowEmptyValue: this.options.allowEmptyValue,
			}),
			...(this.options.style && { style: this.options.style }),
			...(this.options.explode !== undefined && {
				explode: this.options.explode,
			}),
			...(this.options.schema && {
				schema: this.options.schema.referenceObject(),
			}),
		} satisfies oas31.ParameterObject | oas31.ReferenceObject;
	}
}
