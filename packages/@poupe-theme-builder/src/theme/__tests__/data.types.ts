import { Variant } from '../../core';

// `data.test.ts`'s ascending-order test labels failures via
// `Variant[Number(variantKey)]` — TS's reverse-lookup map for
// numeric enums. If MCU ever migrates `Variant` to a string
// enum, `Number(variantKey)` would return `NaN` and the label
// would silently degrade to `undefined`. Pin the numeric-enum
// contract at type-check time.
type Assert<T extends true> = T;
export type VariantIsNumeric = Assert<Variant extends number ? true : false>;
