import { Ajv2020 } from "ajv/dist/2020.js";
import { describe, expect, test } from "vitest";
import { exampleApi } from "./fixtures/apis/example.ts";
import { noteTakingApi } from "./fixtures/apis/note-taking.ts";
import oas31Schema from "./fixtures/oas31.json" with { type: "json" };

const ajv = new Ajv2020({
	// the official schema leaves the object type implicit beside object keywords
	strictTypes: false,
	// and lists components both by name and by a pattern that matches them
	allowMatchingProperties: true,
	// its formats are checked only with ajv-formats, which is not installed
	validateFormats: false,
});
const validateOas31 = ajv.compile(oas31Schema);

describe.each([
	["Example", exampleApi],
	["Note Taking", noteTakingApi],
])("%s", (_, api) => {
	const document = api.synth();

	test("OpenAPI", () => {
		expect(document).toMatchSnapshot();
	});

	test("OpenAPI 3.1 schema validate", () => {
		validateOas31(document);

		expect(validateOas31.errors ?? []).toStrictEqual([]);
	});

	test("OpenAPI 3.1 schema rejects an unknown top-level key", () => {
		expect(validateOas31({ ...document, bogus: true })).toBe(false);
	});
});
