import { validate } from "@hyperjump/json-schema/openapi-3-1";
import { describe, expect, test } from "vitest";
import { exampleApi } from "./fixtures/apis/example.ts";
import { noteTakingApi } from "./fixtures/apis/note-taking.ts";
import { toJson } from "./json.ts";

// schema-base also checks each Schema Object against the OpenAPI 3.1 dialect
const oas31SchemaBase = "https://spec.openapis.org/oas/3.1/schema-base";

describe.each([
	["Example", exampleApi],
	["Note Taking", noteTakingApi],
])("%s", (_, api) => {
	const document = api.synth();

	test("OpenAPI", () => {
		expect(document).toMatchSnapshot();
	});

	test("OpenAPI 3.1 schema validate", async () => {
		const output = await validate(oas31SchemaBase, toJson(document), "BASIC");

		expect(output).toStrictEqual({ valid: true });
	});

	test("OpenAPI 3.1 schema rejects an unknown top-level key", async () => {
		const output = await validate(
			oas31SchemaBase,
			toJson({ ...document, bogus: true }),
			"BASIC",
		);

		expect(output.valid).toBe(false);
	});
});
