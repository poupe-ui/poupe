/** @returns a typed array of keys of the object */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;
