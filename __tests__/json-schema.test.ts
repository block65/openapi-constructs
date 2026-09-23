import { validate } from "@hyperjump/json-schema/draft-07";
import { describe, expect, test } from "vitest";
import { exampleApi } from "./fixtures/apis/example.ts";
import { noteTakingApi } from "./fixtures/apis/note-taking.ts";
import { toJson } from "./json.ts";

describe.each([
	["Example", exampleApi],
	["Note Taking", noteTakingApi],
])("%s", (_, api) => {
	const jsonSchema = api.synthJsonSchema();

	test("JSON Schema snapshot", () => {
		expect(jsonSchema).toMatchSnapshot();
	});

	test("JSON Schema validates against the dialect it declares", async () => {
		const output = await validate(
			jsonSchema.$schema,
			toJson(jsonSchema),
			"BASIC",
		);

		expect(output).toStrictEqual({ valid: true });
	});

	test("JSON Schema dialect rejects an invalid type", async () => {
		const output = await validate(
			jsonSchema.$schema,
			toJson({ ...jsonSchema, definitions: { Invalid: { type: "nope" } } }),
			"BASIC",
		);

		expect(output.valid).toBe(false);
	});
});
