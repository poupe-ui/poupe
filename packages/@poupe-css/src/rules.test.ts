import { describe, it, expect } from 'vitest';
import {
  type CSSRules,
  type CSSRuleObject,
  type CSSRulesFormatOptions,
  defaultValidCSSRule,
  formatCSSRules,
  formatCSSRulesArray,
  getDeepRule,
  interleavedRules,
  renameRules,
  setDeepRule,
  stringifyCSSRules,
} from './rules';

describe('stringifyCSSRules', () => {
  it('formats basic CSS rules', () => {
    const rules: CSSRules = {
      '.container': {
        color: 'red',
        fontSize: '16px',
      },
    };

    const result = stringifyCSSRules(rules);

    expect(result).toBe(
      '.container {\n'
      + '  color: red;\n'
      + '  fontSize: 16px;\n'
      + '}',
    );
  });

  it('formats empty rules', () => {
    const rules: CSSRules = {};
    const result = stringifyCSSRules(rules);

    expect(result).toBe('');
  });

  it('handles nested rules', () => {
    const rules: CSSRules = {
      '.container': {
        'color': 'red',
        '.child': {
          backgroundColor: 'blue',
        },
      },
    };

    const result = stringifyCSSRules(rules);

    expect(result).toBe(
      '.container {\n'
      + '  color: red;\n'
      + '  .child {\n'
      + '    backgroundColor: blue;\n'
      + '  }\n'
      + '}',
    );
  });

  it('handles array values', () => {
    const rules: CSSRules = {
      '.container': {
        fontFamily: ['Arial', 'sans-serif'],
      },
    };

    const result = stringifyCSSRules(rules);

    expect(result).toBe(
      '.container {\n'
      + '  fontFamily: Arial, sans-serif;\n'
      + '}',
    );
  });

  it('respects custom options', () => {
    const rules: CSSRules = {
      '.container': {
        color: 'red',
        fontSize: '16px',
      },
    };

    const options: CSSRulesFormatOptions & { newLine: string } = {
      indent: '    ',
      prefix: '• ',
      newLine: '\r\n',
    };

    const result = stringifyCSSRules(rules, options);

    expect(result).toBe(
      '• .container {\r\n'
      + '•     color: red;\r\n'
      + '•     fontSize: 16px;\r\n'
      + '• }',
    );
  });

  it('handles at-rules correctly', () => {
    const rules: CSSRules = {
      '@media (max-width: 768px)': {
        '.container': {
          fontSize: '14px',
        },
      },
      '@import': 'url("styles.css")',
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      // Empty at-rule that should be preserved
      '@supports (display: grid)': {},
    };

    const result = stringifyCSSRules(rules);

    // The @supports rule with empty content should be preserved as is
    expect(result).toContain('@supports (display: grid);');

    // Other rules should be formatted normally
    expect(result).toContain('@import: url("styles.css");');
    expect(result).toContain('@media (max-width: 768px) {');
    expect(result).toContain('@keyframes spin {');
    expect(result).toContain('0% {');
    expect(result).toContain('transform: rotate(0deg);');
    expect(result).toContain('100% {');
    expect(result).toContain('transform: rotate(360deg);');
  });

  it('handles null values', () => {
    const rules: CSSRules = {
      '.container': {
        color: 'red',
        // eslint-disable-next-line unicorn/no-null
        backgroundColor: null,
        fontSize: '16px',
      },
    };

    const result = stringifyCSSRules(rules);

    // Null values should be ignored
    expect(result).not.toContain('backgroundColor');
    expect(result).toContain('color: red;');
    expect(result).toContain('fontSize: 16px;');
  });

  it('formats rules that are compatible with tailwindcss plugin API', () => {
    const rules: CSSRuleObject = {
      '.container': {
        'color': 'red',
        'fontSize': '16px',
        '@media (max-width: 768px)': {
          fontSize: '14px',
        },
      },
    };

    const result = stringifyCSSRules(rules);

    expect(result).toContain('.container {');
    expect(result).toContain('color: red;');
    expect(result).toContain('fontSize: 16px;');
    expect(result).toContain('@media (max-width: 768px) {');
    expect(result).toContain('fontSize: 14px;');
  });
});

describe('formatCSSRules', () => {
  it('returns empty array for empty rules', () => {
    const rules: CSSRules = {};
    const result = formatCSSRules(rules);

    expect(result).toEqual([]);
  });

  it('formats basic rules with string values', () => {
    const rules: CSSRules = {
      color: 'red',
      fontSize: '16px',
    };

    const result = formatCSSRules(rules);

    expect(result).toEqual([
      'color: red;',
      'fontSize: 16px;',
    ]);
  });

  it('ignores empty string values', () => {
    const rules: CSSRules = {
      color: 'red',
      border: '',
    };

    const result = formatCSSRules(rules);

    expect(result).toEqual(['color: red;']);
    expect(result).not.toContain('border: ;');
  });

  it('formats nested rules correctly', () => {
    const rules: CSSRules = {
      '.parent': {
        'color': 'red',
        '.child': {
          fontSize: '12px',
        },
      },
    };

    const result = formatCSSRules(rules);

    expect(result).toEqual([
      '.parent {',
      '  color: red;',
      '  .child {',
      '    fontSize: 12px;',
      '  }',
      '}',
    ]);
  });

  it('uses custom indentation and prefix', () => {
    const rules: CSSRules = {
      '.parent': {
        color: 'red',
        fontSize: '16px',
      },
    };

    const options: CSSRulesFormatOptions = {
      indent: '--',
      prefix: '> ',
    };

    const result = formatCSSRules(rules, options);

    expect(result).toEqual([
      '> .parent {',
      '> --color: red;',
      '> --fontSize: 16px;',
      '> }',
    ]);
  });

  it('applies custom validation function', () => {
    const rules: CSSRules = {
      color: 'red',
      fontSize: '16px',
      _internal: 'value', // Should be filtered out by custom validator
      margin: '10px',
    };

    // Custom validator that filters out keys starting with underscore
    const options: CSSRulesFormatOptions = {
      valid: key => !key.startsWith('_'),
    };

    const result = formatCSSRules(rules, options);

    expect(result).toContain('color: red;');
    expect(result).toContain('fontSize: 16px;');
    expect(result).toContain('margin: 10px;');
    expect(result).not.toContain('_internal');
  });
});

describe('formatCSSRulesArray', () => {
  it('handles array of strings', () => {
    const rules = ['color: red', 'font-size: 16px'];
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      'font-size: 16px;',
    ]);
  });

  it('handles array of objects', () => {
    const rules: CSSRules[] = [
      { color: 'red' },
      { fontSize: '16px' },
    ];

    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      'fontSize: 16px;',
    ]);
  });

  it('handles empty array', () => {
    const rules: string[] = [];
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([]);
  });

  it('preserves empty strings for whitespace', () => {
    const rules = ['color: red', '', 'font-size: 16px'];
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      '', // Empty string preserved as just a semicolon
      'font-size: 16px;',
    ]);
  });

  it('uses custom indentation and prefix', () => {
    const rules: CSSRules[] = [
      { color: 'red' },
      { fontSize: '16px' },
    ];

    const options: CSSRulesFormatOptions = {
      indent: '  ',
      prefix: '• ',
    };

    const result = formatCSSRulesArray(rules, options);

    expect(result).toEqual([
      '• color: red;',
      '• fontSize: 16px;',
    ]);
  });

  it('handles nested arrays', () => {
    const rules: (string | CSSRules)[] = [
      'color: red',
      {
        '.nested': {
          fontSize: '12px',
        },
      },
    ];

    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      '.nested {',
      '  fontSize: 12px;',
      '}',
    ]);
  });
});

describe('defaultValidCSSRule', () => {
  it('accepts valid rules', () => {
    expect(defaultValidCSSRule('color', 'red')).toBe(true);
    expect(defaultValidCSSRule('fontSize', '12')).toBe(true);
    expect(defaultValidCSSRule('margin', ['10px', '20px'])).toBe(true);
    expect(defaultValidCSSRule('child', { color: 'blue' })).toBe(true);
  });

  it('rejects empty keys', () => {
    expect(defaultValidCSSRule('', 'value')).toBe(false);
  });

  it('rejects null values', () => {
    // eslint-disable-next-line unicorn/no-null
    expect(defaultValidCSSRule('color', null)).toBe(false);
  });

  it('rejects undefined values', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(defaultValidCSSRule('color', undefined as any)).toBe(false);
  });
});

describe('at-rule handling', () => {
  it('preserves empty at-rules', () => {
    const rules: CSSRules = {
      '@supports (display: grid)': {},
      '@media print': [],
      '@charset': 'utf8',
    };

    const result = stringifyCSSRules(rules);

    expect(result).toContain('@supports (display: grid);');
    expect(result).toContain('@media print;');
    expect(result).toContain('@charset: utf8;');
  });

  it('properly formats non-empty at-rules', () => {
    const rules: CSSRules = {
      '@media (max-width: 768px)': {
        '.container': {
          fontSize: '14px',
        },
      },
    };

    const result = stringifyCSSRules(rules);

    expect(result).toContain('@media (max-width: 768px) {');
    expect(result).toContain('.container {');
    expect(result).toContain('fontSize: 14px;');
    expect(result).not.toContain('@media (max-width: 768px);'); // Should not be treated as empty
  });

  it('filters out null at-rules', () => {
    const rules: CSSRules = {
      '@import': 'url("styles.css")',
      // eslint-disable-next-line unicorn/no-null
      '@namespace': null,
    };

    const result = stringifyCSSRules(rules);

    expect(result).toContain('@import: url("styles.css");');
    expect(result).not.toContain('@namespace');
  });
});

describe('interleavedRules', () => {
  it('returns empty array for empty input', () => {
    const result = interleavedRules([]);
    expect(result).toEqual([]);
  });

  it('returns original array for single item', () => {
    const rules = [{ color: 'red' }];
    const result = interleavedRules(rules);
    expect(result).toEqual([{ color: 'red' }]);
  });

  it('interleaves rules with empty objects', () => {
    const rules: CSSRules[] = [
      { color: 'red' },
      { backgroundColor: 'blue' },
      { fontSize: '16px' },
    ];

    const result = interleavedRules(rules);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ color: 'red' });
    expect(result[1]).toEqual({});
    expect(result[2]).toEqual({ backgroundColor: 'blue' });
    expect(result[3]).toEqual({});
    expect(result[4]).toEqual({ fontSize: '16px' });
  });

  it('preserves object references', () => {
    const original = { color: 'red' };
    const rules = [original];

    const result = interleavedRules(rules);

    expect(result[0]).toBe(original); // Same reference
  });
});

describe('renameRules', () => {
  it('returns empty object for empty input', () => {
    const result = renameRules({}, key => key);
    expect(result).toEqual({});
  });

  it('renames keys using provided function', () => {
    const rules = {
      '.button': { color: 'blue' },
      '.card': { padding: '10px' },
    };

    const result = renameRules(rules, key => `@custom${key}`);

    expect(result).toEqual({
      '@custom.button': { color: 'blue' },
      '@custom.card': { padding: '10px' },
    });
  });

  it('filters out keys when function returns falsy value', () => {
    const rules = {
      '.button': { color: 'blue' },
      '.internal': { padding: '10px' },
    };

    const result = renameRules(rules, key =>
      key.startsWith('.int') ? '' : key,
    );

    expect(result).toEqual({
      '.button': { color: 'blue' },
    });
    expect(result['.internal']).toBeUndefined();
  });

  it('preserves nested object structures', () => {
    const rules = {
      '.parent': {
        color: 'red',
        nested: {
          fontSize: '12px',
        },
      },
    };

    const result = renameRules(rules, key => key.toUpperCase());

    expect(result).toEqual({
      '.PARENT': {
        color: 'red',
        nested: {
          fontSize: '12px',
        },
      },
    });
  });
});

describe('formatCSSRulesArray with blank line handling', () => {
  it('ignores empty strings at the beginning', () => {
    const rules = ['', '', 'color: red'];
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual(['color: red;']);
  });

  it('preserves a single empty string after content', () => {
    const rules = ['color: red', '', 'background: blue'];
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      '',
      'background: blue;',
    ]);
  });

  it('collapses multiple consecutive empty strings', () => {
    const rules = ['color: red', '', '', '', 'background: blue'];
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      '',
      'background: blue;',
    ]);
    expect(result).not.toEqual([
      'color: red;',
      '',
      '',
      '',
      'background: blue;',
    ]);
  });

  it('handles mixed content types correctly', () => {
    const rules: (string | CSSRules)[] = [
      'color: red',
      { fontSize: '16px' },
      '',
      { '@media screen': { color: 'blue' } },
    ];

    const result = formatCSSRulesArray(rules);

    expect(result).toContain('color: red;');
    expect(result).toContain('fontSize: 16px;');
    expect(result).toContain('@media screen {');

    // Verify there's exactly one blank line between content blocks
    const blankLineCount = result.filter(line => line === '').length;
    expect(blankLineCount).toBe(1);
  });

  it('ignores null and undefined values', () => {
    const rules = [
      'color: red',
      // eslint-disable-next-line unicorn/no-null
      null,
      undefined,
      'background: blue',
    ];

    // @ts-expect-error - intentionally passing invalid values for test
    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      'background: blue;',
    ]);
  });

  it('handles empty objects correctly', () => {
    const rules: (string | CSSRules)[] = [
      'color: red',
      {},
      { fontSize: '16px' },
    ];

    const result = formatCSSRulesArray(rules);

    expect(result).toEqual([
      'color: red;',
      '',
      'fontSize: 16px;',
    ]);
  });
});

describe('formatCSSRulesArray with formatting options', () => {
  it('applies custom indentation and prefix', () => {
    const rules = [
      { '.parent': { color: 'red' } },
    ];

    const options = {
      indent: '----',
      prefix: '> ',
    };

    const result = formatCSSRulesArray(rules, options);

    expect(result).toEqual([
      '> .parent {',
      '> ----color: red;',
      '> }',
    ]);
  });

  it('applies custom validation function', () => {
    const rules = [
      {
        color: 'red',
        _private: 'value', // Should be filtered out
        fontSize: '16px',
      },
    ];

    const options = {
      valid: (key: string) => !key.startsWith('_'),
    };

    const result = formatCSSRulesArray(rules, options);

    expect(result.join('\n')).toContain('color: red;');
    expect(result.join('\n')).toContain('fontSize: 16px;');
    expect(result.join('\n')).not.toContain('_private');
  });
});

describe('integration tests for CSS rule formatting', () => {
  it('combines interleavedRules with formatCSSRulesArray', () => {
    const rules: CSSRules[] = [
      { '--color-primary': 'blue' },
      { '--color-secondary': 'green' },
      { '--color-accent': 'purple' },
    ];

    const interleaved = interleavedRules(rules);
    const result = formatCSSRulesArray(interleaved);

    // Should have content, blank line, content, blank line, content
    expect(result).toEqual([
      '--color-primary: blue;',
      '',
      '--color-secondary: green;',
      '',
      '--color-accent: purple;',
    ]);
  });

  it('combines renameRules with formatCSSRulesArray', () => {
    const rules = {
      '.button': { color: 'blue' },
      '.card': { backgroundColor: 'white' },
    };

    const renamed = renameRules(rules, key => `@component${key}`);
    const result = stringifyCSSRules(renamed);

    expect(result).toContain('@component.button {');
    expect(result).toContain('color: blue;');
    expect(result).toContain('@component.card {');
    expect(result).toContain('backgroundColor: white;');
  });
});

describe('setDeepRule', () => {
  it('sets a rule at the top level with string path', () => {
    const target = {};
    const result = setDeepRule(target, 'button', { color: 'blue' });

    expect(result).toEqual({
      button: { color: 'blue' },
    });
    expect(result).toBe(target); // Should modify the original object
  });

  it('sets a rule at a nested path with array path', () => {
    const target = {};
    const result = setDeepRule(target, ['components', 'button'], { color: 'blue' });

    expect(result).toEqual({
      components: {
        button: { color: 'blue' },
      },
    });
  });

  it('creates intermediate objects as needed', () => {
    const target = {};
    const result = setDeepRule(target, ['theme', 'components', 'button'], {
      color: 'blue',
      fontSize: '16px',
    });

    expect(result).toEqual({
      theme: {
        components: {
          button: {
            color: 'blue',
            fontSize: '16px',
          },
        },
      },
    });
  });

  it('preserves existing properties in the target object', () => {
    const target = {
      existing: 'value',
      theme: {
        colors: {
          primary: 'red',
        },
      },
    };

    const result = setDeepRule(target, ['theme', 'components', 'button'], { color: 'blue' });

    expect(result).toEqual({
      existing: 'value',
      theme: {
        colors: {
          primary: 'red',
        },
        components: {
          button: { color: 'blue' },
        },
      },
    });
  });

  it('merges with existing properties at the target path', () => {
    const target = {
      components: {
        button: { color: 'red', margin: '5px' },
      },
    };

    const result = setDeepRule(target, ['components', 'button'], {
      color: 'blue',
      fontSize: '16px',
    });

    expect(result).toEqual({
      components: {
        button: {
          color: 'blue', // New value takes precedence
          margin: '5px', // Existing value preserved
          fontSize: '16px', // New value added
        },
      },
    });
  });

  it('merges deeply nested objects correctly', () => {
    const target = {
      button: {
        color: 'red',
        margin: '5px',
        hover: {
          color: 'darkred',
          scale: '1.1',
        },
      },
    };

    const result = setDeepRule(target, 'button', {
      color: 'blue',
      padding: '10px',
      hover: {
        color: 'darkblue',
        opacity: '0.9',
      },
    });

    expect(result).toEqual({
      button: {
        color: 'blue', // New value takes precedence
        margin: '5px', // Existing value preserved
        padding: '10px', // New value added
        hover: {
          color: 'darkblue', // New value takes precedence in nested object
          scale: '1.1', // Existing nested value preserved
          opacity: '0.9', // New nested value added
        },
      },
    });
  });

  it('new values take precedence over existing values', () => {
    const target: CSSRules = { button: { color: 'red', fontSize: '14px' } };

    const result = setDeepRule(target, 'button', {
      color: 'blue',
      fontSize: '16px',
    });

    expect((result.button as CSSRules).color).toBe('blue');
    expect((result.button as CSSRules).fontSize).toBe('16px');
  });

  it('preserves existing values not present in new object', () => {
    const target = {
      button: {
        color: 'red',
        margin: '5px',
        border: '1px solid',
      },
    };

    const result = setDeepRule(target, 'button', { color: 'blue' });

    expect(result).toEqual({
      button: {
        color: 'blue',
        margin: '5px',
        border: '1px solid',
      },
    });
  });

  it('handles empty array path by returning the target unchanged', () => {
    const target = { existing: 'value' };
    const result = setDeepRule(target, [], { color: 'blue' });

    expect(result).toEqual({ existing: 'value' });
    expect(result).toBe(target);
  });

  it('works with complex CSS rule objects', () => {
    const target: CSSRules = {};
    const cssRule = {
      'color': 'blue',
      'fontSize': '16px',
      '@media (max-width: 768px)': {
        fontSize: '14px',
      },
      '&:hover': {
        color: 'darkblue',
      },
    };

    const result = setDeepRule(target, ['theme', 'components', 'button'], cssRule);

    expect((result.theme as CSSRules).components).toBeDefined();
    expect(((result.theme as CSSRules).components as CSSRules).button).toEqual(cssRule);
  });

  it('works with numeric indices in path array', () => {
    const target: CSSRules = {
      variants: [
        { name: 'primary' },
        { name: 'secondary' },
      ],
    };

    // Using string representation of numeric index
    const result = setDeepRule(target, ['variants', '1', 'styles'], {
      color: 'green',
      border: '1px solid',
    });

    expect(result).toEqual({
      variants: [
        { name: 'primary' },
        {
          name: 'secondary',
          styles: {
            color: 'green',
            border: '1px solid',
          },
        },
      ],
    });
  });

  it('works with CSSRuleObject type for TailwindCSS compatibility', () => {
    const target: CSSRuleObject = {};
    const cssRule: CSSRuleObject = {
      'color': 'blue',
      'fontSize': '16px',
      '@media (max-width: 768px)': {
        fontSize: '14px',
      },
    };

    const result = setDeepRule(target, 'button', cssRule);

    expect(result).toEqual({
      button: cssRule,
    });
    // Type check: result should be CSSRuleObject
    expect(typeof result).toBe('object');
  });

  it('preserves type safety with overloaded signatures', () => {
    // Test CSSRules type
    const cssRulesTarget: CSSRules = {};
    const cssRulesObject: CSSRules = { color: 'blue' };
    const cssRulesResult = setDeepRule(cssRulesTarget, 'test', cssRulesObject);
    expect(cssRulesResult).toBe(cssRulesTarget);

    // Test CSSRuleObject type
    const cssRuleTarget: CSSRuleObject = {};
    const cssRuleObject: CSSRuleObject = { color: 'red' };
    const cssRuleResult = setDeepRule(cssRuleTarget, 'test', cssRuleObject);
    expect(cssRuleResult).toBe(cssRuleTarget);
  });
});

describe('getDeepRule', () => {
  const testRules: CSSRules = {
    components: {
      button: {
        color: 'blue',
        fontSize: '16px',
        variants: [
          { size: 'small', padding: '5px' },
          { size: 'large', padding: '15px' },
        ],
      },
      card: {
        backgroundColor: 'white',
        border: '1px solid gray',
      },
    },
    utils: ['clearfix', 'sr-only'],
    theme: {
      colors: {
        primary: 'blue',
        secondary: 'green',
      },
    },
    // eslint-disable-next-line unicorn/no-null
    emptyProp: null,
  };

  it('retrieves top-level string values', () => {
    const button = testRules.components as CSSRules;
    const result = getDeepRule(button.button as CSSRules, 'color');
    expect(result).toBe('blue');
  });

  it('retrieves top-level array values', () => {
    const result = getDeepRule(testRules, 'utils');
    expect(result).toEqual(['clearfix', 'sr-only']);
  });

  it('retrieves nested string values with array path', () => {
    const result = getDeepRule(testRules, ['components', 'button', 'color']);
    expect(result).toBe('blue');
  });

  it('retrieves nested object values', () => {
    const result = getDeepRule(testRules, ['components', 'button']);
    expect(result).toEqual({
      color: 'blue',
      fontSize: '16px',
      variants: [
        { size: 'small', padding: '5px' },
        { size: 'large', padding: '15px' },
      ],
    });
  });

  it('retrieves deeply nested values', () => {
    const result = getDeepRule(testRules, ['theme', 'colors', 'primary']);
    expect(result).toBe('blue');
  });

  it('returns undefined for non-existent paths', () => {
    expect(getDeepRule(testRules, ['components', 'header'])).toBeUndefined();
    expect(getDeepRule(testRules, ['nonexistent'])).toBeUndefined();
    expect(getDeepRule(testRules, ['components', 'button', 'nonexistent'])).toBeUndefined();
  });

  it('returns undefined for invalid path segments', () => {
    expect(getDeepRule(testRules, ['utils', 'length', 'invalid'])).toBeUndefined();
    expect(getDeepRule(testRules, ['components', 'button', 'color', 'invalid'])).toBeUndefined();
  });

  it('handles null values correctly', () => {
    const result = getDeepRule(testRules, 'emptyProp');
    // eslint-disable-next-line unicorn/no-null
    expect(result).toBe(null);
  });

  it('returns the target object itself for empty path array', () => {
    const result = getDeepRule(testRules, []);
    expect(result).toBe(testRules);
  });

  it('works with CSSRuleObject type', () => {
    const ruleObject: CSSRuleObject = {
      color: 'red',
      nested: {
        fontSize: '14px',
      },
    };

    expect(getDeepRule(ruleObject, 'color')).toBe('red');
    expect(getDeepRule(ruleObject, ['nested', 'fontSize'])).toBe('14px');
    expect(getDeepRule(ruleObject, 'nonexistent')).toBeUndefined();
  });

  it('preserves type safety with overloaded signatures', () => {
    // Test CSSRules type
    const cssRulesResult = getDeepRule(testRules, ['components', 'button']);
    expect(typeof cssRulesResult).toBe('object');

    // Test CSSRuleObject type
    const cssRuleObject: CSSRuleObject = { color: 'blue' };
    const cssRuleResult = getDeepRule(cssRuleObject, 'color');
    expect(cssRuleResult).toBe('blue');
  });

  it('handles array access with numeric string indices', () => {
    const result = getDeepRule(testRules, ['utils', '0']);
    expect(result).toBe('clearfix');

    const result2 = getDeepRule(testRules, ['utils', '1']);
    expect(result2).toBe('sr-only');
  });

  it('returns undefined for out-of-bounds array access', () => {
    const result = getDeepRule(testRules, ['utils', '10']);
    expect(result).toBeUndefined();
  });
});
