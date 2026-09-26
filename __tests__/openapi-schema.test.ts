import { validate } from "@hyperjump/json-schema/openapi-3-1";
import { validate as validate32 } from "@hyperjump/json-schema/openapi-3-2";
import { describe, expect, test } from "vitest";
import { eventStreamApi } from "./fixtures/apis/event-stream.ts";
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

describe("Event Stream", () => {
	const document = eventStreamApi.synth();

	test("OpenAPI", () => {
		expect(document).toMatchSnapshot();
	});

	test("OpenAPI 3.2 schema validate", async () => {
		const output = await validate32(
			"https://spec.openapis.org/oas/3.2/schema-base",
			toJson(document),
			"BASIC",
		);

		expect(output).toStrictEqual({ valid: true });
	});
});
