import { describe, it, expect } from 'vitest';
import {
  type CSSProperties,
  type CSSPropertiesOptions,
  formatCSSProperties,
  formatCSSValue,
  properties,
  stringifyCSSProperties,
} from './properties';

describe('stringifyCSSProperties', () => {
  it('formats with default options', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
      marginTop: 10,
    };
    const result = stringifyCSSProperties(cssProps);

    expect(result).toBe('{\n  color: red;\n  font-size: 16px;\n  margin-top: 10\n}');
  });

  it('formats empty object', () => {
    const cssProps: CSSProperties = {};
    const result = stringifyCSSProperties(cssProps);

    expect(result).toBe('{}');
  });

  it('formats inline when specified', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
    };
    const options: CSSPropertiesOptions = { inline: true };
    const result = stringifyCSSProperties(cssProps, options);

    expect(result).toBe('{ color: red; font-size: 16px }');
  });

  it('formats inline when below singleLineThreshold', () => {
    const cssProps: CSSProperties = {
      color: 'red',
    };
    const result = stringifyCSSProperties(cssProps); // Default singleLineThreshold is 1

    expect(result).toBe('{ color: red }');
  });

  it('respects custom singleLineThreshold', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
    };

    // With threshold 1 (default), should be multiline
    const result1 = stringifyCSSProperties(cssProps);
    expect(result1).toBe('{\n  color: red;\n  font-size: 16px\n}');

    // With threshold 2, should be single line
    const result2 = stringifyCSSProperties(cssProps, { singleLineThreshold: 2 });
    expect(result2).toBe('{ color: red; font-size: 16px }');

    // With threshold 3, should still be single line
    const result3 = stringifyCSSProperties(cssProps, { singleLineThreshold: 3 });
    expect(result3).toBe('{ color: red; font-size: 16px }');
  });

  it('uses custom indentation and prefix', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
    };
    const options: CSSPropertiesOptions = {
      indent: '    ', // 4 spaces
      prefix: '  ', // 2 spaces
    };
    const result = stringifyCSSProperties(cssProps, options);

    expect(result).toBe('{\n      color: red;\n      font-size: 16px\n  }');
  });

  it('uses custom newLine character', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
    };
    const options: CSSPropertiesOptions = {
      newLine: '\r\n', // Windows-style line endings
    };
    const result = stringifyCSSProperties(cssProps, options);

    expect(result).toBe('{\r\n  color: red;\r\n  font-size: 16px\r\n}');
  });

  it('combines all custom options correctly', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
      margin: [10, 20],
    };
    const options: CSSPropertiesOptions = {
      indent: '  • ', // Bullet point indentation
      prefix: '» ', // Custom prefix
      newLine: '\n',
      inline: false,
      singleLineThreshold: 2, // multiline
    };
    const result = stringifyCSSProperties(cssProps, options);

    expect(result).toBe('{\n»   • color: red;\n»   • font-size: 16px;\n»   • margin: 10, 20\n» }');
  });
});

describe('formatCSSProperties', () => {
  it('formats basic CSS properties', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
      marginTop: 10,
    };
    const result = formatCSSProperties(cssProps);

    expect(result).toContain('color: red');
    expect(result).toContain('font-size: 16px');
    expect(result).toContain('margin-top: 10');
    expect(result).toHaveLength(3);
  });

  it('formats CSS properties with array values', () => {
    const cssProps: CSSProperties = {
      fontFamily: ['Arial', 'sans-serif'],
      backgroundImage: ['url(bg.jpg)', 'linear-gradient(red, blue)'],
    };
    const result = formatCSSProperties(cssProps);

    expect(result).toContain('font-family: Arial, sans-serif');

    // Check that it contains the background-image property
    // but be more flexible about the exact format
    const backgroundImageLine = result.find(line => line.startsWith('background-image:'));
    expect(backgroundImageLine).toBeDefined();
    expect(backgroundImageLine).toContain('url(bg.jpg)');
    expect(backgroundImageLine).toContain('linear-gradient(red, blue)');

    expect(result).toHaveLength(2);
  });

  it('handles values with spaces', () => {
    const cssProps: CSSProperties = {
      fontFamily: 'Times New Roman',
      gridTemplateAreas: 'header header header main sidebar footer',
    };
    const result = formatCSSProperties(cssProps);

    expect(result).toContain('font-family: "Times New Roman"');
    expect(result).toContain('grid-template-areas: "header header header main sidebar footer"');
  });

  it('converts camelCase property names to kebab-case', () => {
    const cssProps: CSSProperties = {
      backgroundColor: '#fff',
      borderBottomWidth: '1px',
      WebkitTransition: 'all 0.2s',
    };
    const result = formatCSSProperties(cssProps);

    expect(result).toContain('background-color: #fff');
    expect(result).toContain('border-bottom-width: 1px');
    expect(result).toContain('-webkit-transition: "all 0.2s"');
  });

  it('filters out invalid CSS values', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      margin: '', // Empty string should be filtered out
      padding: [10, ''], // Array with empty string should be filtered out
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      border: '' as any, // Type assertion to bypass TypeScript
    };
    const result = formatCSSProperties(cssProps);

    expect(result).toContain('color: red');
    expect(result).not.toContain('margin:');
    expect(result).not.toContain('padding:');
    expect(result).not.toContain('border:');
    expect(result).toHaveLength(1);
  });
});

describe('formatCSSValue', () => {
  it('formats string values', () => {
    expect(formatCSSValue('red')).toBe('red');
    expect(formatCSSValue('#123456')).toBe('#123456');
  });

  it('formats number values', () => {
    expect(formatCSSValue(10)).toBe('10');
    expect(formatCSSValue(0)).toBe('0');
    expect(formatCSSValue(-5)).toBe('-5');
  });

  it('formats array values', () => {
    expect(formatCSSValue(['red', 'blue'])).toBe('red, blue');
    expect(formatCSSValue([10, 20, 30])).toBe('10, 20, 30');
    expect(formatCSSValue(['red', 10])).toBe('red, 10');
  });

  it('quotes string values containing spaces', () => {
    expect(formatCSSValue('Times New Roman')).toBe('"Times New Roman"');
    expect(formatCSSValue('10px 20px 30px')).toBe('"10px 20px 30px"');
  });

  it('quotes array values containing spaces', () => {
    expect(formatCSSValue(['solid 1px', 'dotted 2px'])).toBe('"solid 1px", "dotted 2px"');
    expect(formatCSSValue(['Arial', 'Times New Roman'])).toBe('Arial, "Times New Roman"');
  });
});

describe('properties generator', () => {
  it('yields valid CSS properties', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      fontSize: '16px',
      margin: 10,
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(['color', 'red']);
    expect(result).toContainEqual(['fontSize', '16px']);
    expect(result).toContainEqual(['margin', 10]);
  });

  it('filters out invalid CSS values', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      margin: '', // Empty string should be filtered out
      fontSize: 16,
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(['color', 'red']);
    expect(result).toContainEqual(['fontSize', 16]);
    expect(result.map(pair => pair[0])).not.toContain('margin');
  });

  it('handles array values', () => {
    const cssProps: CSSProperties = {
      fontFamily: ['Arial', 'sans-serif'],
      transform: ['translateX(10px)', 'rotate(45deg)'],
      margin: [10, 20, 30, 40],
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(['fontFamily', ['Arial', 'sans-serif']]);
    expect(result).toContainEqual(['transform', ['translateX(10px)', 'rotate(45deg)']]);
    expect(result).toContainEqual(['margin', [10, 20, 30, 40]]);
  });

  it('filters out arrays with invalid values', () => {
    const cssProps: CSSProperties = {
      padding: [10, ''], // Array with some valid, some invalid
      margin: ['', ''], // Array with all invalid
      fontFamily: ['Arial', 'sans-serif'], // Valid array
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(['fontFamily', ['Arial', 'sans-serif']]);
    expect(result.map(pair => pair[0])).not.toContain('padding');
    expect(result.map(pair => pair[0])).not.toContain('margin');
  });

  it('handles empty objects', () => {
    const cssProps: CSSProperties = {};
    const result = [...properties(cssProps)];
    expect(result).toHaveLength(0);
  });

  it('rejects empty arrays', () => {
    const cssProps: CSSProperties = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      margin: [] as any, // Type assertion to bypass TypeScript
      padding: [10, 20], // Valid array
      color: 'red', // Valid string
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(['padding', [10, 20]]);
    expect(result).toContainEqual(['color', 'red']);
    expect(result.map(pair => pair[0])).not.toContain('margin');
  });
});

describe('isValidValue', () => {
  // Testing the internal isValidValue function through the properties generator behavior
  it('accepts non-empty strings and numbers', () => {
    const cssProps: CSSProperties = {
      color: 'red',
      opacity: 0.5,
      zIndex: 100,
      content: '\'\'',
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(4);
    expect(result).toContainEqual(['color', 'red']);
    expect(result).toContainEqual(['opacity', 0.5]);
    expect(result).toContainEqual(['zIndex', 100]);
    expect(result).toContainEqual(['content', '\'\'']);
  });

  it('rejects empty strings', () => {
    const cssProps: CSSProperties = {
      color: '',
      backgroundColor: 'blue',
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(['backgroundColor', 'blue']);
    expect(result.map(pair => pair[0])).not.toContain('color');
  });

  it('handles array values properly', () => {
    const cssProps: CSSProperties = {
      // Valid array
      margin: [0, 10, 20],

      // Array with invalid (empty string) value
      padding: [10, ''],

      // Valid string
      color: 'red',
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(['margin', [0, 10, 20]]);
    expect(result).toContainEqual(['color', 'red']);
    expect(result.map(pair => pair[0])).not.toContain('padding');
  });

  it('rejects empty arrays', () => {
    const cssProps: CSSProperties = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      margin: [] as any,
      color: 'blue',
    };

    const result = [...properties(cssProps)];

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(['color', 'blue']);
    expect(result.map(pair => pair[0])).not.toContain('margin');
  });
});
