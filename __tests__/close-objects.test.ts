import { Api, Schema } from "@block65/openapi-constructs";
import type { oas31 } from "openapi3-ts";
import { describe, expect, test } from "vitest";

const inner = {
	type: "object",
	properties: { name: { type: "string" } },
} satisfies oas31.SchemaObject;

const closedInner = { additionalProperties: false, ...inner };

// JSON Schema 2020-12 keywords that oas31.SchemaObject leaves out
type JsonSchemaObject = oas31.SchemaObject & {
	patternProperties?: Record<string, oas31.SchemaObject>;
	unevaluatedProperties?: boolean;
};

const withPatternProperties: JsonSchemaObject = {
	...inner,
	patternProperties: { "^x-": {} },
};

const withUnevaluatedProperties: JsonSchemaObject = {
	...inner,
	unevaluatedProperties: true,
};

function synth(schema: oas31.SchemaObject) {
	const api = new Api({
		openapi: "3.1.0",
		info: { title: "Close objects", version: "1.0.0" },
	});

	return new Schema(api, "Subject", { schema }).synth();
}

describe("an inline object with properties is closed", () => {
	test.each<[string, oas31.SchemaObject, oas31.SchemaObject]>([
		[
			"under properties",
			{ type: "object", properties: { child: inner } },
			{
				additionalProperties: false,
				type: "object",
				properties: { child: closedInner },
			},
		],
		[
			"under items",
			{ type: "array", items: inner },
			{ type: "array", items: closedInner },
		],
		[
			"under prefixItems",
			{ type: "array", prefixItems: [inner, { type: "string" }] },
			{ type: "array", prefixItems: [closedInner, { type: "string" }] },
		],
		["under oneOf", { oneOf: [inner] }, { oneOf: [closedInner] }],
		["under anyOf", { anyOf: [inner] }, { anyOf: [closedInner] }],
		[
			"under a schema-valued additionalProperties",
			{ type: "object", additionalProperties: inner },
			{ type: "object", additionalProperties: closedInner },
		],
		[
			"several levels down",
			{ type: "array", items: { oneOf: [{ properties: { child: inner } }] } },
			{
				type: "array",
				items: {
					oneOf: [
						{ additionalProperties: false, properties: { child: closedInner } },
					],
				},
			},
		],
		[
			"at the root without type object",
			{ type: ["object", "null"], properties: { name: { type: "string" } } },
			{
				additionalProperties: false,
				type: ["object", "null"],
				properties: { name: { type: "string" } },
			},
		],
	])("%s", (_, schema, expected) => {
		expect(synth(schema)).toStrictEqual(expected);
	});
});

describe("an object stays as written", () => {
	test.each<[string, oas31.SchemaObject]>([
		[
			"a map",
			{
				type: "array",
				items: { type: "object", additionalProperties: { type: "string" } },
			},
		],
		["a free-form object", { type: "array", items: { type: "object" } }],
		[
			"an allOf member",
			{ allOf: [inner, { properties: { age: { type: "integer" } } }] },
		],
		[
			"an explicit additionalProperties",
			{ type: "array", items: { ...inner, additionalProperties: true } },
		],
		["a patternProperties", { type: "array", items: withPatternProperties }],
		[
			"an unevaluatedProperties",
			{ type: "array", items: withUnevaluatedProperties },
		],
		[
			"a $ref",
			{
				type: "array",
				items: {
					$ref: "#/components/schemas/Other",
					properties: inner.properties,
				},
			},
		],
	])("%s", (_, schema) => {
		expect(synth(schema)).toStrictEqual(schema);
	});
});

test("the root keeps closing a type object without properties", () => {
	expect(synth({ type: "object" })).toStrictEqual({
		additionalProperties: false,
		type: "object",
	});
});

test("the schema passed in is not modified", () => {
	const schema = {
		type: "array",
		items: { oneOf: [inner] },
	} satisfies oas31.SchemaObject;
	const copy = structuredClone(schema);

	synth(schema);

	expect(schema).toStrictEqual(copy);
});
