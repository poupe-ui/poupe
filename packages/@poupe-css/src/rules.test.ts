import { describe, it, expect } from 'vitest';
import {
  type CSSRules,
  type CSSRuleObject,
  type CSSRulesFormatOptions,
  stringifyCSSRules,
  formatCSSRules,
  formatCSSRulesArray,
  defaultValidCSSRule,
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
