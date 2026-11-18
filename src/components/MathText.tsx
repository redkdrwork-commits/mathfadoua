import React from 'react';

interface VerticalFractionProps {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
  className?: string;
}

/**
 * Renders a classic stacked vertical fraction (numerator over horizontal vinculum line over denominator).
 */
export const VerticalFraction: React.FC<VerticalFractionProps> = ({
  numerator,
  denominator,
  className = '',
}) => (
  <span
    dir="ltr"
    className={`font-math inline-flex flex-col items-center justify-center align-middle mx-0.5 leading-[1.12] text-[0.92em] ${className}`}
  >
    <span className="border-b-[1.5px] border-current px-1.5 pb-[2px] text-center whitespace-nowrap">
      {numerator}
    </span>
    <span className="px-1.5 pt-[2px] text-center whitespace-nowrap">
      {denominator}
    </span>
  </span>
);

function stripOuterGroup(raw: string): string {
  const s = raw.trim();
  if (s.length < 2) return s;
  const open = s[0];
  const close = s[s.length - 1];
  const isParenPair = open === '(' && close === ')';
  const isBracketPair = open === '[' && close === ']';
  if (!isParenPair && !isBracketPair) return s;

  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0 && i < s.length - 1) {
        return s;
      }
    }
  }
  return s.slice(1, -1).trim();
}

const PARALLEL_TOKEN = '\uE000PARALLEL\uE000';

/**
 * Splits a string at depth-0 occurrences of single-character or multi-character delimiters.
 */
function splitTopLevelTokens(input: string): string[] {
  const tokens: string[] = [];
  let depth = 0;
  let start = 0;

  const multiOps = ['⟺', '⟹', '⟵', '<=', '>=', '!='];
  const singleOps = new Set(['=', '≠', '≈', '<', '>', '|', ';', ',', '×', '÷']);

  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
      i++;
      continue;
    }
    if (ch === ')' || ch === ']' || ch === '}') {
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }

    if (depth === 0) {
      // Check Arabic conjunction words surrounded by spaces
      if (input.startsWith(' أو ', i)) {
        if (i > start) tokens.push(input.slice(start, i));
        tokens.push(' أو ');
        i += 4;
        start = i;
        continue;
      }
      if (input.startsWith(' و ', i)) {
        if (i > start) tokens.push(input.slice(start, i));
        tokens.push(' و ');
        i += 3;
        start = i;
        continue;
      }

      // Check multi-char operators
      const matchedMulti = multiOps.find((op) => input.startsWith(op, i));
      if (matchedMulti) {
        if (i > start) tokens.push(input.slice(start, i));
        tokens.push(matchedMulti);
        i += matchedMulti.length;
        start = i;
        continue;
      }

      // Check binary + or - with spaces around them (so we don't split 10^-6 or -13√7)
      if ((ch === '+' || ch === '-') && i > start && input[i - 1] === ' ' && input[i + 1] === ' ') {
        tokens.push(input.slice(start, i - 1));
        tokens.push(` ${ch} `);
        i += 2;
        start = i;
        continue;
      }

      if (singleOps.has(ch)) {
        if (i > start) tokens.push(input.slice(start, i));
        tokens.push(ch);
        i += 1;
        start = i;
        continue;
      }
    }
    i++;
  }

  if (start < input.length) {
    tokens.push(input.slice(start));
  }
  return tokens;
}

function findTopLevelSpacedSlash(s: string): number {
  let depth = 0;
  for (let i = 1; i < s.length - 2; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
    else if (depth === 0 && ch === '/' && s[i - 1] === ' ' && s[i + 1] === ' ') {
      if (s[i + 2] !== '/' && s[i - 2] !== '/') {
        return i;
      }
    }
  }
  return -1;
}

function renderTightFractionsAndGroups(seg: string, keyPrefix: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let lastTextStart = 0;
  let partIdx = 0;

  const flushText = (end: number) => {
    if (end > lastTextStart) {
      const txt = seg.slice(lastTextStart, end).replaceAll(PARALLEL_TOKEN, '//');
      nodes.push(<React.Fragment key={`${keyPrefix}-t-${partIdx++}`}>{txt}</React.Fragment>);
    }
  };

  while (i < seg.length) {
    // 1) Check balanced (...) or [...] that might contain a fraction or be numerator of /
    if (seg[i] === '(' || seg[i] === '[') {
      const open = seg[i];
      const close = open === '(' ? ')' : ']';
      let depth = 1;
      let j = i + 1;
      while (j < seg.length && depth > 0) {
        if (seg[j] === open) depth++;
        else if (seg[j] === close) depth--;
        j++;
      }
      if (depth === 0) {
        // Check if followed immediately by '/' (no space, not '//')
        if (seg[j] === '/' && seg[j + 1] !== '/') {
          // Denominator right after '/'
          let k = j + 1;
          if (seg[k] === '(' || seg[k] === '[') {
            const dOpen = seg[k];
            const dClose = dOpen === '(' ? ')' : ']';
            let dDepth = 1;
            k++;
            while (k < seg.length && dDepth > 0) {
              if (seg[k] === dOpen) dDepth++;
              else if (seg[k] === dClose) dDepth--;
              k++;
            }
          } else {
            while (k < seg.length && !/[\s()[\]{}=≠≈<>|,;]/.test(seg[k])) {
              k++;
            }
          }
          const numStr = stripOuterGroup(seg.slice(i, j));
          const denStr = stripOuterGroup(seg.slice(j + 1, k));
          flushText(i);
          nodes.push(
            <VerticalFraction
              key={`${keyPrefix}-tf-${partIdx++}`}
              numerator={renderMathString(numStr, `${keyPrefix}-n-${partIdx}`)}
              denominator={renderMathString(denStr, `${keyPrefix}-d-${partIdx}`)}
            />
          );
          i = k;
          lastTextStart = k;
          continue;
        }

        // Otherwise if the inside of (...) contains '/', recursively render inside while keeping parens
        const inner = seg.slice(i + 1, j - 1);
        if (inner.includes('/')) {
          flushText(i);
          nodes.push(
            <React.Fragment key={`${keyPrefix}-grp-${partIdx++}`}>
              {open}
              {renderMathString(inner, `${keyPrefix}-in-${partIdx}`)}
              {close}
            </React.Fragment>
          );
          i = j;
          lastTextStart = j;
          continue;
        }
        i = j;
        continue;
      }
    }

    // 2) Tight slash without spaces between atoms: e.g. 2/3, AM/AB, 17/7, a/√b, 10^m/10^n
    if (seg[i] === '/' && seg[i - 1] !== '/' && seg[i + 1] !== '/') {
      let left = i - 1;
      while (left >= lastTextStart && !/[\s()[\]{}=≠≈<>|,;×÷+\-]/.test(seg[left])) {
        left--;
      }
      left++;

      let right = i + 1;
      if (seg[right] === '(' || seg[right] === '[') {
        const dOpen = seg[right];
        const dClose = dOpen === '(' ? ')' : ']';
        let dDepth = 1;
        right++;
        while (right < seg.length && dDepth > 0) {
          if (seg[right] === dOpen) dDepth++;
          else if (seg[right] === dClose) dDepth--;
          right++;
        }
      } else {
        while (right < seg.length && !/[\s()[\]{}=≠≈<>|,;×÷+]/.test(seg[right])) {
          right++;
        }
      }

      if (left < i && right > i + 1) {
        const numStr = seg.slice(left, i);
        const denStr = stripOuterGroup(seg.slice(i + 1, right));
        flushText(left);
        nodes.push(
          <VerticalFraction
            key={`${keyPrefix}-af-${partIdx++}`}
            numerator={renderMathString(numStr, `${keyPrefix}-an-${partIdx}`)}
            denominator={renderMathString(denStr, `${keyPrefix}-ad-${partIdx}`)}
          />
        );
        i = right;
        lastTextStart = right;
        continue;
      }
    }

    i++;
  }

  flushText(seg.length);
  return nodes.length === 1 ? nodes[0] : <>{nodes}</>;
}

function renderMathString(raw: string, keyPrefix = 'm'): React.ReactNode {
  const safe = raw.replaceAll('//', PARALLEL_TOKEN);
  if (!safe.includes('/')) {
    return raw;
  }

  const tokens = splitTopLevelTokens(safe);
  return (
    <>
      {tokens.map((token, idx) => {
        const trimmed = token.trim();
        if (!trimmed) {
          return <React.Fragment key={`${keyPrefix}-sp-${idx}`}>{token}</React.Fragment>;
        }

        // Preserve leading/trailing whitespace around the token
        const leadSpace = token.match(/^\s*/)?.[0] || '';
        const trailSpace = token.match(/\s*$/)?.[0] || '';

        const spacedSlash = findTopLevelSpacedSlash(trimmed);
        if (spacedSlash !== -1) {
          const leftRaw = trimmed.slice(0, spacedSlash).trim();
          const rightRaw = trimmed.slice(spacedSlash + 1).trim();
          const numStr = stripOuterGroup(leftRaw);
          const denStr = stripOuterGroup(rightRaw);

          return (
            <React.Fragment key={`${keyPrefix}-sf-${idx}`}>
              {leadSpace}
              <VerticalFraction
                numerator={renderMathString(numStr, `${keyPrefix}-sn-${idx}`)}
                denominator={renderMathString(denStr, `${keyPrefix}-sd-${idx}`)}
              />
              {trailSpace}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={`${keyPrefix}-seg-${idx}`}>
            {leadSpace}
            {renderTightFractionsAndGroups(trimmed, `${keyPrefix}-tg-${idx}`)}
            {trailSpace}
          </React.Fragment>
        );
      })}
    </>
  );
}

interface MathExprProps {
  expr: string;
  className?: string;
}

/**
 * Renders a standalone math formula/expression in LTR with vertical stacked fractions.
 */
export const MathExpr: React.FC<MathExprProps> = ({ expr, className = '' }) => {
  return (
    <span dir="ltr" className={`font-math inline-flex flex-wrap items-center justify-center gap-y-1 align-middle ${className}`}>
      {renderMathString(expr, 'expr')}
    </span>
  );
};

/**
 * Splits plain (non-backticked) text on inline fraction patterns while avoiding '//' parallel lines.
 */
function renderPlainTextWithFractions(text: string, keyPrefix: string): React.ReactNode {
  if (!text.includes('/')) return text;

  const safe = text.replaceAll('//', PARALLEL_TOKEN);
  // Match inline fractions like: (a + b) / (c + d), 1/3, AM/AB, -13√7 / 7, 5 / (2 + √3)
  const fracRegex =
    /(\([^()]+\)\s*\/\s*\([^()]+\)|\([^()]+\)\s*\/\s*[A-Za-z0-9√._^̂-]+|[A-Za-z0-9√._^̂-]+\s*\/\s*\([^()]+\)|-?[A-Za-z0-9√._^̂]+\s*\/\s*[A-Za-z0-9√._^̂]+)/g;

  const segments = safe.split(fracRegex);
  return (
    <>
      {segments.map((seg, i) => {
        if (!seg) return null;
        if (i % 2 === 1) {
          return (
            <span key={`${keyPrefix}-pf-${i}`} dir="ltr" className="inline-block align-middle mx-0.5 font-math">
              {renderMathString(seg, `${keyPrefix}-p-${i}`)}
            </span>
          );
        }
        return (
          <React.Fragment key={`${keyPrefix}-pt-${i}`}>
            {seg.replaceAll(PARALLEL_TOKEN, '//')}
          </React.Fragment>
        );
      })}
    </>
  );
}

interface MathInlineProps {
  text: string;
  className?: string;
}

/**
 * Renders Arabic text smoothly while isolating LTR math tokens wrapped in `...`
 * and rendering all fractions vertically (numerator over denominator bar).
 */
export const MathText: React.FC<MathInlineProps> = ({ text, className = '' }) => {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          const expr = part.slice(1, -1);
          return (
            <span
              key={idx}
              dir="ltr"
              className="font-math mx-1 inline-flex flex-wrap items-center align-middle rounded bg-slate-100 px-1.5 py-0.5 text-[0.92em] font-semibold text-sky-900 border border-slate-200/80"
            >
              {renderMathString(expr, `bt-${idx}`)}
            </span>
          );
        }
        return (
          <React.Fragment key={idx}>
            {renderPlainTextWithFractions(part, `pl-${idx}`)}
          </React.Fragment>
        );
      })}
    </span>
  );
};
