import { Construct } from "constructs";
import type { oas31 } from "openapi3-ts";
import type { Header } from "./header.ts";
import { MediaType, type MediaTypeOptions } from "./media-type.ts";

type ResponseOptions = {
	content?: MediaType | MediaTypeOptions | (MediaType | MediaTypeOptions)[];
	description?: string;
	headers?: Record<Lowercase<string>, Header>;
};

export class Response extends Construct {
	private options: ResponseOptions;

	private contentEntries: MediaType[];

	constructor(scope: Construct, id: string, options: ResponseOptions = {}) {
		super(scope, id);
		this.options = options;

		const { content = [] } = options;
		const items = Array.isArray(content) ? content : [content];

		this.contentEntries = items.map((item, index) =>
			item instanceof MediaType
				? item
				: new MediaType(this, `${id}MediaType${index}`, item),
		);
	}

	public synth() {
		return {
			description: this.options.description || "Successful response",
			content: Object.fromEntries(
				this.contentEntries.map((entry) => [entry.contentType, entry.synth()]),
			),
			...(this.options.headers && {
				headers: Object.fromEntries(
					Object.entries(this.options.headers).map(([name, header]) => [
						name,
						header.synth(),
					]),
				),
			}),
		} satisfies oas31.ResponseObject;
	}
}
