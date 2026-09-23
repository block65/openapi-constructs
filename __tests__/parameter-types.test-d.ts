import { expectTypeOf } from "vitest";
import type { Parameter } from "../lib/parameter.ts";
import type { ValidParameter } from "../lib/types.ts";

// Test that only matching path param names are allowed
type PathParams = ValidParameter<"/users/{userId}">;
expectTypeOf<Parameter<"userId", "path">>().toExtend<PathParams>();

// @ts-expect-error path parameter with wrong name is not allowed
expectTypeOf<Parameter<"notInRoute", "path">>().toExtend<PathParams>();

// Test that query parameters can be any string
expectTypeOf<Parameter<"anyName">>().toExtend<
	ValidParameter<"/users/{userId}">
>();

// Test that lowercase header parameters are allowed
expectTypeOf<Parameter<"x-custom-header", "header">>().toExtend<
	ValidParameter<"/users/{userId}">
>();

// @ts-expect-error uppercase header parameter names are not allowed (HTTP/2)
expectTypeOf<Parameter<"X-Custom-Header", "header">>().toExtend<
	ValidParameter<"/users/{userId}">
>();

// Test that cookie parameters can be any string
expectTypeOf<Parameter<"sessionId", "cookie">>().toExtend<
	ValidParameter<"/users/{userId}">
>();

// Test multi-param routes
type MultiParamRoute = ValidParameter<"/users/{userId}/notes/{noteId}">;
expectTypeOf<Parameter<"userId", "path">>().toExtend<MultiParamRoute>();
expectTypeOf<Parameter<"noteId", "path">>().toExtend<MultiParamRoute>();

// @ts-expect-error path parameter not in route
expectTypeOf<Parameter<"otherParam", "path">>().toExtend<MultiParamRoute>();

// Test that non-path parameters work for any route
expectTypeOf<Parameter<"limit">>().toExtend<MultiParamRoute>();
expectTypeOf<Parameter<"offset">>().toExtend<MultiParamRoute>();
