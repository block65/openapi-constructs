import { RootConstruct, type IConstruct } from "constructs";

export class ApiLowLevel extends RootConstruct {
	public static of<T extends ApiLowLevel>(
		this: abstract new (...args: never[]) => T,
		c: IConstruct,
	): T {
		const { root } = c.node;

		if (root instanceof this) {
			return root;
		}

		throw new TypeError(`${c.node.path} is not in a ${this.name} tree`);
	}
}
