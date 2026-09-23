type WithoutUndefinedProperties<T extends object> = {
	[P in keyof T]: Exclude<T[P], undefined>;
};

export type OptionalToUndefined<T extends object> = {
	[P in keyof T]: undefined extends T[P] ? T[P] | undefined : T[P];
};

export function stripUndefined<T extends object>(obj: OptionalToUndefined<T>) {
	const kept = Object.entries(obj).filter(([, v]) => v !== undefined);

	// fromEntries returns an index signature, never the mapped type
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- by design
	return Object.fromEntries(kept) as WithoutUndefinedProperties<T>;
}
