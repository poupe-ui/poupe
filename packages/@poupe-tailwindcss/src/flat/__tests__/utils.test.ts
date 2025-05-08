import { describe, it, expect } from 'vitest';
import {
  getShadeValue,
  getStringValue,
  getStringOrBooleanValue,
  getBooleanValue,
} from '../utils';

describe('getShadeValue', () => {
  it('returns the value when it is a valid integer', () => {
    expect(getShadeValue(50)).toBe(50);
    expect(getShadeValue(100)).toBe(100);
    expect(getShadeValue(1)).toBe(1);
    expect(getShadeValue(999)).toBe(999);
  });

  it('returns undefined when value is not a number', () => {
    expect(getShadeValue('50')).toBeUndefined();
    expect(getShadeValue(0)).toBeUndefined();
    expect(getShadeValue(1000)).toBeUndefined();
    // eslint-disable-next-line unicorn/no-null
    expect(getShadeValue(null)).toBeUndefined();
    expect(getShadeValue(undefined)).toBeUndefined();
    expect(getShadeValue({})).toBeUndefined();
    expect(getShadeValue([])).toBeUndefined();
  });

  it('returns undefined when value is not an integer', () => {
    expect(getShadeValue(50.5)).toBeUndefined();
    expect(getShadeValue(100.1)).toBeUndefined();
  });

  it('handles negative values correctly when negative flag is true', () => {
    expect(getShadeValue(-50, true)).toBe(-50);
    expect(getShadeValue(-100, true)).toBe(-100);
  });

  it('returns undefined for negative values when negative flag is false', () => {
    expect(getShadeValue(-50)).toBeUndefined();
    expect(getShadeValue(-100)).toBeUndefined();
  });
});

describe('getStringValue', () => {
  it('returns the string when value is a string', () => {
    expect(getStringValue('hello')).toBe('hello');
    expect(getStringValue('')).toBe('');
  });

  it('returns undefined when value is not a string', () => {
    expect(getStringValue(50)).toBeUndefined();
    // eslint-disable-next-line unicorn/no-null
    expect(getStringValue(null)).toBeUndefined();
    expect(getStringValue(undefined)).toBeUndefined();
    expect(getStringValue({})).toBeUndefined();
    expect(getStringValue([])).toBeUndefined();
    expect(getStringValue(true)).toBeUndefined();
  });
});

describe('getStringOrBooleanValue', () => {
  it('returns the string when value is a normal string', () => {
    expect(getStringOrBooleanValue('hello')).toBe('hello');
    expect(getStringOrBooleanValue('')).toBe('');
  });

  it('returns boolean when value is a boolean', () => {
    expect(getStringOrBooleanValue(true)).toBe(true);
    expect(getStringOrBooleanValue(false)).toBe(false);
  });

  it('converts "true" and "false" strings to boolean values', () => {
    expect(getStringOrBooleanValue('true')).toBe(true);
    expect(getStringOrBooleanValue('false')).toBe(false);
  });

  it('returns undefined when value is not a string or boolean', () => {
    expect(getStringOrBooleanValue(50)).toBeUndefined();
    // eslint-disable-next-line unicorn/no-null
    expect(getStringOrBooleanValue(null)).toBeUndefined();
    expect(getStringOrBooleanValue(undefined)).toBeUndefined();
    expect(getStringOrBooleanValue({})).toBeUndefined();
    expect(getStringOrBooleanValue([])).toBeUndefined();
  });
});

describe('getBooleanValue', () => {
  it('returns the boolean when value is a boolean', () => {
    expect(getBooleanValue(true)).toBe(true);
    expect(getBooleanValue(false)).toBe(false);
  });

  it('converts "true" and "false" strings to boolean values', () => {
    expect(getBooleanValue('true')).toBe(true);
    expect(getBooleanValue('false')).toBe(false);
  });

  it('returns undefined for other strings', () => {
    expect(getBooleanValue('hello')).toBeUndefined();
    expect(getBooleanValue('')).toBeUndefined();
  });

  it('returns undefined when value is not a boolean or "true"/"false" strings', () => {
    expect(getBooleanValue(50)).toBeUndefined();
    // eslint-disable-next-line unicorn/no-null
    expect(getBooleanValue(null)).toBeUndefined();
    expect(getBooleanValue(undefined)).toBeUndefined();
    expect(getBooleanValue({})).toBeUndefined();
    expect(getBooleanValue([])).toBeUndefined();
  });
});
