import { Construct } from "constructs";
import { Reference } from "./reference.ts";
import type { Schema } from "./schema.ts";

type ContentType =
	| "application/json"
	| "application/octet-stream"
	| "application/x-www-form-urlencoded"
	| "multipart/form-data"
	| "text/plain"
	| "image/*"
	| (string & {});

export type MediaTypeOptions = { contentType: ContentType } & (
	| { schema: Schema | Reference<Schema> }

	// OpenAPI 3.2 describes each item of a sequential type, such as an event
	| { itemSchema: Schema | Reference<Schema> }
);

function refOf(schema: Schema | Reference<Schema>) {
	return schema instanceof Reference
		? schema.synth()
		: schema.referenceObject();
}

export class MediaType extends Construct {
	private options: MediaTypeOptions;

	public get contentType() {
		return this.options.contentType;
	}

	constructor(scope: Construct, id: string, options: MediaTypeOptions) {
		super(scope, id);
		this.options = options;
	}

	public synth() {
		return "itemSchema" in this.options
			? { itemSchema: refOf(this.options.itemSchema) }
			: { schema: refOf(this.options.schema) };
	}
}
