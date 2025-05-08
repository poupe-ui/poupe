/*
 * CSSRuleObject inspired by tailwindcss/types/config's
 */
export interface CSSRuleObject {
  [key: string]: string | string[] | CSSRuleObject
};

function formatCSSRuleObject(rule: CSSRuleObject, indent: string, newLine: string, prefix: string): string {
  const out: string[] = [];
  const nextPrefix = prefix + indent;

  for (const key in rule) {
    // TODO: validate key;
    const value = rule[key];

    if (atRuleException(key, value)) {
      out.push(`${prefix}${key};`);
    } else if (typeof value === 'string') {
      // string
      if (value) {
        out.push(`${prefix}${key}: ${value};`);
      }
    } else if (Array.isArray(value)) {
      // string[]
      const ss1 = value as string[];
      const ss: string[] = [];
      let s: string = '';

      for (const s1 of ss1) {
        if (s1 !== '') {
          ss.push(s1);
        }
      }

      if (ss.length > 1) {
        s = ss.join(`;${newLine}${prefix}`);
      }

      if (s !== '') {
        out.push(`${prefix}${key} {${newLine}${nextPrefix}${s};${newLine}${prefix}}`);
      }
    } else if (typeof value === 'object') {
      // nested CSSRuleObject
      const s1 = formatCSSRuleObject(value as CSSRuleObject, indent, newLine, nextPrefix);
      if (s1 !== '') {
        out.push(`${prefix}${key} {${newLine}${s1}${newLine}${prefix}}`);
      }
    }
  }
  return out.join(newLine);
}

function atRuleException(key: string, value: unknown): boolean {
  if (key.startsWith('@') && value !== null && typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
}

export function formatCSSRuleObjects(rules: CSSRuleObject | CSSRuleObject[], indent: string = '\t', newLine: string = '\n', prefix: string = ''): string {
  if (Array.isArray(rules)) {
    const out: string[] = [];

    for (const rule of rules) {
      const s = formatCSSRuleObject(rule, indent, newLine, prefix);
      if (s !== '') {
        out.push(s);
      }
    }
    return out.join(newLine);
  }

  return formatCSSRuleObject(rules, indent, newLine, prefix);
}
