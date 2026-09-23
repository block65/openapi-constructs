import type { Validator } from "@hyperjump/json-schema/openapi-3-1";

type Json = Parameters<Validator>[0];

/**
 * Checks each value, since the construct types admit values JSON cannot hold
 */
export function toJson(value: unknown): Json {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item: unknown) => toJson(item));
	}

	if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, item]) => item !== undefined)
				.map(([key, item]) => [key, toJson(item)]),
		);
	}

	throw new TypeError(`A ${typeof value} is not JSON`);
}
