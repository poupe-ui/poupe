import { describe, it, expect } from 'vitest';
import { type CSSRules, type CSSRuleObject } from '@poupe/css';
import {
  type CSSRulesStringifyOptions,
  stringifyCSSRulesArray,
  stringifyCSSRulesArrayStream,
  stringifyCSSRulesArrayAsStream,
  stringifyCSSRulesArrayAsResponse,
  stringifyCSSRulesArrayAsStreamingResponse,
} from '../stringify';

describe('stringifyCSSRulesArray', () => {
  it('should return empty string for empty array', () => {
    expect(stringifyCSSRulesArray([])).toBe('');
  });

  it('should stringify simple CSS rules', () => {
    const rules = [
      { 'color': 'red', 'font-size': '16px' },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe('color: red;\nfont-size: 16px;');
  });

  it('should handle string rules', () => {
    const rules = [
      'display: block',
      { color: 'blue' },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe('display: block;\ncolor: blue;');
  });

  it('should handle nested rules', () => {
    const rules = [
      {
        '.button': {
          color: 'white',
          background: 'blue',
        },
      },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe('.button {\n  color: white;\n  background: blue;\n}');
  });

  it('should handle empty strings as blank lines', () => {
    const rules: (string | CSSRules | CSSRuleObject)[] = [
      { color: 'red' },
      '',
      { background: 'blue' },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe('color: red;\n\nbackground: blue;');
  });

  it('should use custom newLine character', () => {
    const rules: (string | CSSRules | CSSRuleObject)[] = [
      { color: 'red' },
      { background: 'blue' },
    ];
    const options: CSSRulesStringifyOptions = { newLine: '\r\n' };
    const result = stringifyCSSRulesArray(rules, options);
    expect(result).toBe('color: red;\r\nbackground: blue;');
  });

  it('should pass through format options', () => {
    const rules = [
      {
        '.custom': {
          color: 'green',
        },
      },
    ];
    const options: CSSRulesStringifyOptions = {
      indent: '    ', // 4 spaces
    };
    const result = stringifyCSSRulesArray(rules, options);
    expect(result).toBe('.custom {\n    color: green;\n}');
  });

  it('should preserve property names as-is (no automatic camelCase conversion)', () => {
    const rules = [
      {
        fontSize: '16px',
        backgroundColor: 'blue',
        borderTopLeftRadius: '4px',
        WebkitTransform: 'scale(1)',
        msFlexDirection: 'row',
        textDecoration: 'underline',
        marginTop: '10px',
        paddingBottom: '5px',
        zIndex: '999',
        lineHeight: '1.5',
      },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe(
      'fontSize: 16px;\n'
      + 'backgroundColor: blue;\n'
      + 'borderTopLeftRadius: 4px;\n'
      + 'WebkitTransform: scale(1);\n'
      + 'msFlexDirection: row;\n'
      + 'textDecoration: underline;\n'
      + 'marginTop: 10px;\n'
      + 'paddingBottom: 5px;\n'
      + 'zIndex: 999;\n'
      + 'lineHeight: 1.5;',
    );
  });

  it('should handle kebab-case properties correctly', () => {
    const rules = [
      {
        'font-size': '14px',
        'background-color': 'red',
        'margin-top': '8px',
        'border-radius': '2px',
      },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe(
      'font-size: 14px;\n'
      + 'background-color: red;\n'
      + 'margin-top: 8px;\n'
      + 'border-radius: 2px;',
    );
  });

  it('should handle vendor prefixes as kebab-case', () => {
    const rules = [
      {
        '-webkit-transform': 'rotate(45deg)',
        '-moz-user-select': 'none',
        '-ms-transition': 'all 0.3s',
        '-o-transform': 'skew(10deg)',
      },
    ];
    const result = stringifyCSSRulesArray(rules);
    expect(result).toBe(
      '-webkit-transform: rotate(45deg);\n'
      + '-moz-user-select: none;\n'
      + '-ms-transition: all 0.3s;\n'
      + '-o-transform: skew(10deg);',
    );
  });

  it('should convert camelCase to kebab-case when normalizeProperties is enabled', () => {
    const rules = [
      {
        fontSize: '16px',
        backgroundColor: 'blue',
        borderTopLeftRadius: '4px',
        WebkitTransform: 'scale(1)',
        msFlexDirection: 'row',
        textDecoration: 'underline',
        marginTop: '10px',
        paddingBottom: '5px',
        zIndex: '999',
        lineHeight: '1.5',
      },
    ];
    const result = stringifyCSSRulesArray(rules, { normalizeProperties: true });
    expect(result).toBe(
      'font-size: 16px;\n'
      + 'background-color: blue;\n'
      + 'border-top-left-radius: 4px;\n'
      + '-webkit-transform: scale(1);\n'
      + '-ms-flex-direction: row;\n'
      + 'text-decoration: underline;\n'
      + 'margin-top: 10px;\n'
      + 'padding-bottom: 5px;\n'
      + 'z-index: 999;\n'
      + 'line-height: 1.5;',
    );
  });

  it('should normalize properties but preserve selectors', () => {
    const rules = [
      {
        '.button': {
          fontSize: '14px',
          backgroundColor: 'red',
        },
        '@media (max-width: 768px)': {
          marginTop: '8px',
        },
        ':hover': {
          borderRadius: '2px',
        },
      },
    ];
    const result = stringifyCSSRulesArray(rules, { normalizeProperties: true });
    expect(result).toBe(
      '.button {\n'
      + '  font-size: 14px;\n'
      + '  background-color: red;\n'
      + '}\n'
      + '@media (max-width: 768px) {\n'
      + '  margin-top: 8px;\n'
      + '}\n'
      + ':hover {\n'
      + '  border-radius: 2px;\n'
      + '}',
    );
  });

  it('should handle mixed camelCase and kebab-case with normalization', () => {
    const rules = [
      {
        'font-size': '14px', // kebab-case (should stay)
        'backgroundColor': 'red', // camelCase (should convert)
        'margin-top': '8px', // kebab-case (should stay)
        'borderRadius': '2px', // camelCase (should convert)
      },
    ];
    const result = stringifyCSSRulesArray(rules, { normalizeProperties: true });
    expect(result).toBe(
      'font-size: 14px;\n'
      + 'background-color: red;\n'
      + 'margin-top: 8px;\n'
      + 'border-radius: 2px;',
    );
  });
});

describe('stringifyCSSRulesArrayStream', () => {
  it('should yield nothing for empty array', async () => {
    const stream = stringifyCSSRulesArrayStream([]);
    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual([]);
  });

  it('should yield lines with newlines', async () => {
    const rules = [
      { 'color': 'red', 'font-size': '16px' },
    ];
    const stream = stringifyCSSRulesArrayStream(rules);
    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual(['color: red;\n', 'font-size: 16px;\n']);
  });

  it('should use custom newLine character', async () => {
    const rules: (string | CSSRules | CSSRuleObject)[] = [
      { color: 'red' },
      { background: 'blue' },
    ];
    const options: CSSRulesStringifyOptions = { newLine: '\r\n' };
    const stream = stringifyCSSRulesArrayStream(rules, options);
    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual(['color: red;\r\n', 'background: blue;\r\n']);
  });

  it('should handle nested rules', async () => {
    const rules = [
      {
        '.button': {
          color: 'white',
        },
      },
    ];
    const stream = stringifyCSSRulesArrayStream(rules);
    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual(['.button {\n', '  color: white;\n', '}\n']);
  });
});

describe('stringifyCSSRulesArrayAsStream', () => {
  it('should return ReadableStream', () => {
    const rules = [{ color: 'red' }];
    const stream = stringifyCSSRulesArrayAsStream(rules);

    expect(stream).toBeInstanceOf(ReadableStream);
  });

  it('should stream CSS content', async () => {
    const rules = [
      { 'color': 'red', 'font-size': '16px' },
    ];
    const stream = stringifyCSSRulesArrayAsStream(rules);
    const response = new Response(stream);
    const content = await response.text();

    expect(content).toBe('color: red;\nfont-size: 16px;\n');
  });

  it('should handle empty rules with stream', async () => {
    const stream = stringifyCSSRulesArrayAsStream([]);
    const response = new Response(stream);
    const content = await response.text();

    expect(content).toBe('');
  });

  it('should use custom newLine in stream', async () => {
    const rules: (string | CSSRules | CSSRuleObject)[] = [
      { color: 'red' },
      { background: 'blue' },
    ];
    const stream = stringifyCSSRulesArrayAsStream(rules, {
      newLine: '\r\n',
    });
    const response = new Response(stream);
    const content = await response.text();

    expect(content).toBe('color: red;\r\nbackground: blue;\r\n');
  });

  it('should handle nested rules in stream', async () => {
    const rules = [
      {
        '.button': {
          color: 'white',
          background: 'blue',
        },
      },
    ];
    const stream = stringifyCSSRulesArrayAsStream(rules);
    const response = new Response(stream);
    const content = await response.text();

    expect(content).toBe('.button {\n  color: white;\n  background: blue;\n}\n');
  });

  it('should handle large CSS efficiently with stream', async () => {
    // Create a large number of rules to test streaming efficiency
    const rules = Array.from({ length: 1000 }, (_, i) => ({
      [`.class-${i}`]: {
        'color': 'red',
        'font-size': '16px',
      },
    }));

    const stream = stringifyCSSRulesArrayAsStream(rules);
    const response = new Response(stream);
    const content = await response.text();

    // Should start with the first rule
    expect(content).toMatch(/^\.class-0 \{/);
    // Should end with the last rule and a newline
    expect(content).toMatch(/\}\n$/);
    // Should contain all 1000 rules
    expect(content.split('.class-').length - 1).toBe(1000);
  });
});

describe('stringifyCSSRulesArrayAsResponse', () => {
  it('should return Response with CSS content type', () => {
    const rules = [{ color: 'red' }];
    const response = stringifyCSSRulesArrayAsResponse(rules);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/css; charset=utf-8');
  });

  it('should include CSS content in response body', async () => {
    const rules = [
      { 'color': 'red', 'font-size': '16px' },
    ];
    const response = stringifyCSSRulesArrayAsResponse(rules);
    const content = await response.text();

    expect(content).toBe('color: red;\nfont-size: 16px;\n');
  });

  it('should allow custom headers', () => {
    const rules = [{ color: 'red' }];
    const response = stringifyCSSRulesArrayAsResponse(rules, {
      headers: {
        'Cache-Control': 'max-age=3600',
        'X-Custom-Header': 'test',
      },
    });

    expect(response.headers.get('Cache-Control')).toBe('max-age=3600');
    expect(response.headers.get('X-Custom-Header')).toBe('test');
    expect(response.headers.get('Content-Type')).toBe('text/css; charset=utf-8');
  });

  it('should not override custom Content-Type', () => {
    const rules = [{ color: 'red' }];
    const response = stringifyCSSRulesArrayAsResponse(rules, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });

  it('should handle empty rules', async () => {
    const response = stringifyCSSRulesArrayAsResponse([]);
    const content = await response.text();

    expect(content).toBe('');
  });

  it('should use custom newLine in response', async () => {
    const rules: (string | CSSRules | CSSRuleObject)[] = [
      { color: 'red' },
      { background: 'blue' },
    ];
    const response = stringifyCSSRulesArrayAsResponse(rules, {
      newLine: '\r\n',
    });
    const content = await response.text();

    expect(content).toBe('color: red;\r\nbackground: blue;\r\n');
  });
});

describe('stringifyCSSRulesArrayAsStreamingResponse', () => {
  it('should return streaming Response with CSS content type', () => {
    const rules = [{ color: 'red' }];
    const response = stringifyCSSRulesArrayAsStreamingResponse(rules);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/css; charset=utf-8');
    expect(response.body).toBeInstanceOf(ReadableStream);
  });

  it('should stream CSS content', async () => {
    const rules = [
      { 'color': 'red', 'font-size': '16px' },
    ];
    const response = stringifyCSSRulesArrayAsStreamingResponse(rules);
    const content = await response.text();

    expect(content).toBe('color: red;\nfont-size: 16px;\n');
  });

  it('should allow custom headers', () => {
    const rules = [{ color: 'red' }];
    const response = stringifyCSSRulesArrayAsStreamingResponse(rules, {
      headers: {
        'Cache-Control': 'max-age=3600',
        'X-Custom-Header': 'test',
      },
    });

    expect(response.headers.get('Cache-Control')).toBe('max-age=3600');
    expect(response.headers.get('X-Custom-Header')).toBe('test');
    expect(response.headers.get('Content-Type')).toBe('text/css; charset=utf-8');
  });

  it('should not override custom Content-Type', () => {
    const rules = [{ color: 'red' }];
    const response = stringifyCSSRulesArrayAsStreamingResponse(rules, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });

  it('should handle empty rules with streaming', async () => {
    const response = stringifyCSSRulesArrayAsStreamingResponse([]);
    const content = await response.text();

    expect(content).toBe('');
  });

  it('should use custom newLine in streaming response', async () => {
    const rules: (string | CSSRules | CSSRuleObject)[] = [
      { color: 'red' },
      { background: 'blue' },
    ];
    const response = stringifyCSSRulesArrayAsStreamingResponse(rules, {
      newLine: '\r\n',
    });
    const content = await response.text();

    expect(content).toBe('color: red;\r\nbackground: blue;\r\n');
  });

  it('should handle large CSS efficiently', async () => {
    // Create a large number of rules to test streaming efficiency
    const rules = Array.from({ length: 1000 }, (_, i) => ({
      [`.class-${i}`]: {
        'color': 'red',
        'font-size': '16px',
      },
    }));

    const response = stringifyCSSRulesArrayAsStreamingResponse(rules);
    const content = await response.text();

    // Should start with the first rule
    expect(content).toMatch(/^\.class-0 \{/);
    // Should end with the last rule and a newline
    expect(content).toMatch(/\}\n$/);
    // Should contain all 1000 rules
    expect(content.split('.class-').length - 1).toBe(1000);
  });
});
