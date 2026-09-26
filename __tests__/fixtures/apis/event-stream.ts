import { Api, Path, Response, Schema } from "@block65/openapi-constructs";

export const eventStreamApi = new Api({
	openapi: "3.2.0",
	info: { title: "Event Stream API", version: "1.0.0" },
});

const tick = new Schema(eventStreamApi, "Tick", {
	schema: {
		type: "object",
		properties: { count: { type: "integer" } },
		required: ["count"],
	},
});

const tickEvent = new Schema(eventStreamApi, "TickEvent", {
	schema: {
		type: "object",
		properties: {
			event: { const: "tick" },
			data: {
				type: "string",
				contentMediaType: "application/json",
				contentSchema: tick.referenceObject(),
			},
			id: { type: "string" },
		},
		required: ["event", "data"],
	},
});

new Path(eventStreamApi, { path: "/ticks" }).addOperation("get", {
	operationId: "streamTicksCommand",
	responses: {
		200: new Response(eventStreamApi, "StreamTicksResponse", {
			description: "One tick per second",
			content: { contentType: "text/event-stream", itemSchema: tickEvent },
		}),
	},
});
