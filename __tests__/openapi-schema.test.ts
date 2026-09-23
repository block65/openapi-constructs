import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { test, expect, describe } from "vitest";
import { exampleApi } from "./fixtures/apis/example.ts";
import { noteTakingApi } from "./fixtures/apis/note-taking.ts";

// the JSON is validated, since openapi3-ts and openapi-types types disagree
async function validate(document: object) {
	const dir = await mkdtemp(path.join(tmpdir(), "openapi-constructs-"));
	const file = path.join(dir, "openapi.json");

	try {
		await writeFile(file, JSON.stringify(document));
		return await SwaggerParser.validate(file);
	} finally {
		await rm(dir, { recursive: true });
	}
}

describe("Example", () => {
	test("OpenAPI", async () => {
		const document = exampleApi.synth();
		expect(document).toMatchSnapshot();
	});

	test("Swagger Parser validate", async () => {
		const document = exampleApi.synth();

		const result = await validate(document);
		expect(result).toMatchSnapshot();
	});
});

describe("Note Taking", () => {
	test("OpenAPI", async () => {
		const document = noteTakingApi.synth();
		expect(document).toMatchSnapshot();
	});

	test("Swagger Parser validate", async () => {
		const document = noteTakingApi.synth();

		const result = await validate(document);
		expect(result).toMatchSnapshot();
	});
});
