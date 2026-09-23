import { Construct, type IConstruct } from "constructs";
import type { Api } from "./api.ts";

export class ApiLowLevel extends Construct {
	public static of(c: IConstruct): Api {
		const { scope } = c.node;

		if (!scope) {
			// the root of the tree, which the API constructor creates. That class
			// imports this module, so instanceof would be a circular import
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the root
			return c as Api;
		}

		return ApiLowLevel.of(scope);
	}
}
