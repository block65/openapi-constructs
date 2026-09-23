import { Construct } from "constructs";
import type { oas31 } from "openapi3-ts";

type InferExample<
	TSchema,
	TStopRecurse extends boolean = false,
> = TSchema extends oas31.ReferenceObject
	? unknown
	: TSchema extends {
				type: "string";
		  }
		? string
		: TSchema extends {
					type: "number" | "integer";
			  }
			? number
			: TSchema extends {
						type: "boolean";
				  }
				? boolean
				: TSchema extends oas31.SchemaObject & { type: "object" }
					? {
							[K in keyof TSchema["properties"]]: TStopRecurse extends true
								? unknown
								: InferExample<TSchema["properties"][K], true>;
						}
					: TSchema extends oas31.SchemaObject & { type: "array" }
						? TStopRecurse extends true
							? unknown
							: InferExample<TSchema["items"]>[]
						: unknown;

export type SchemaOptions<T extends Omit<oas31.SchemaObject, "required">> = {
	schema: T & {
		examples?: InferExample<T>[];
		required?: T extends { type: "object"; properties: infer P }
			? (keyof P)[]
			: string[];
	};
};
export class Schema<
	const T extends oas31.SchemaObject = oas31.SchemaObject,
> extends Construct {
	private options: SchemaOptions<T>;

	constructor(scope: Construct, id: string, options: SchemaOptions<T>) {
		super(scope, id);

		this.options = options;
	}

	public get schema() {
		return this.options.schema;
	}

	public get schemaKey() {
		return this.node.id;
	}

	public jsonPointer() {
		return `#/components/schemas/${this.schemaKey}`;
	}

	public referenceObject(): oas31.ReferenceObject {
		return {
			$ref: this.jsonPointer(),
		};
	}

	public validate() {
		return [];
	}

	public synth() {
		const { schema } = this.options;

		return {
			// default to disallow additional properties on objects
			...((schema.type === "object" || isOpenObject(schema)) && {
				additionalProperties: false,
			}),
			...schema,
			...closeNested(schema),
		};
	}
}

type SchemaOrReference = oas31.SchemaObject | oas31.ReferenceObject;

// JSON Schema lets through any key an object does not rule out
function isOpenObject(schema: oas31.SchemaObject) {
	return (
		schema.properties !== undefined &&
		schema.additionalProperties === undefined &&
		!("patternProperties" in schema) &&
		!("unevaluatedProperties" in schema)
	);
}

// allOf is left alone, because closed members reject each other's keys
function closeNested(schema: oas31.SchemaObject) {
	const { properties, items, prefixItems, oneOf, anyOf, additionalProperties } =
		schema;

	return {
		...(properties && {
			properties: Object.fromEntries(
				Object.entries(properties).map(([name, value]) => [name, close(value)]),
			),
		}),
		...(items && { items: close(items) }),
		...(prefixItems && { prefixItems: prefixItems.map((item) => close(item)) }),
		...(oneOf && { oneOf: oneOf.map((item) => close(item)) }),
		...(anyOf && { anyOf: anyOf.map((item) => close(item)) }),
		...(typeof additionalProperties === "object" && {
			additionalProperties: close(additionalProperties),
		}),
	} satisfies oas31.SchemaObject;
}

function close(schema: SchemaOrReference): SchemaOrReference {
	if ("$ref" in schema) {
		return schema;
	}

	return {
		...(isOpenObject(schema) && { additionalProperties: false }),
		...schema,
		...closeNested(schema),
	};
}
