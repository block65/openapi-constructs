export type WithoutUndefinedProperties<T extends object> = {
  [P in keyof T]: Exclude<T[P], undefined>;
};

export type OptionalToUndefined<T extends object> = {
  [P in keyof T]: undefined extends T[P] ? T[P] | undefined : T[P];
};

// this is a better version that uses Object.fromEntries
export function stripUndefined<T extends object>(obj: OptionalToUndefined<T>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v !== 'undefined'),
  ) as WithoutUndefinedProperties<T>;
}
