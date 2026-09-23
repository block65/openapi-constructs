import { Construct } from "constructs";
import type { oas31 } from "openapi3-ts";
import type { Schema } from "./schema.ts";

type HeaderOptions = {
	description?: string;
	required?: boolean;
	deprecated?: boolean;
	allowEmptyValue?: boolean;
	style?: "simple";
	explode?: boolean;
	allowReserved?: boolean;
	schema: Schema;
};

export class Header<TName extends string = string> extends Construct {
	private options: HeaderOptions;

	constructor(
		scope: Construct,
		id: TName & Lowercase<TName>,
		options: HeaderOptions,
	) {
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
		return `#/components/headers/${this.schemaKey}`;
	}

	public synth() {
		return {
			...(this.options.description && {
				description: this.options.description,
			}),
			...(this.options.required && {
				required: this.options.required,
			}),
			...(this.options.deprecated && {
				deprecated: this.options.deprecated,
			}),
			...(this.options.allowEmptyValue && {
				allowEmptyValue: this.options.allowEmptyValue,
			}),
			...(this.options.style && {
				style: this.options.style,
			}),
			...(this.options.explode && {
				explode: this.options.explode,
			}),
			...(this.options.allowReserved && {
				allowReserved: this.options.allowReserved,
			}),
			...(this.options.schema && {
				schema: this.options.schema.referenceObject(),
			}),
		} satisfies oas31.HeaderObject;
	}
}
