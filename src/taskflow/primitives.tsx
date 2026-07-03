import { forwardRef, useState } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  Ref,
} from 'react';
import { labelDefs, members } from './data';

/**
 * Small interactive primitives that reproduce the design's `style-hover` /
 * `style-focus` attributes by merging extra style on the relevant event.
 */

type WithHover<P> = P & { hoverStyle?: CSSProperties };

export const HDiv = forwardRef(function HDiv(
  { hoverStyle, style, onMouseEnter, onMouseLeave, ...rest }: WithHover<HTMLAttributes<HTMLDivElement>>,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      style={hover ? { ...style, ...hoverStyle } : style}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    />
  );
});

export function HButton({
  hoverStyle,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: WithHover<ButtonHTMLAttributes<HTMLButtonElement>>): JSX.Element {
  const [hover, setHover] = useState(false);
  const disabled = rest.disabled;
  return (
    <button
      style={hover && !disabled ? { ...style, ...hoverStyle } : style}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    />
  );
}

export function HA({
  hoverStyle,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: WithHover<AnchorHTMLAttributes<HTMLAnchorElement>>): JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <a
      style={hover ? { ...style, ...hoverStyle } : style}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    />
  );
}

export const FocusInput = forwardRef(function FocusInput(
  { focusStyle, style, onFocus, onBlur, ...rest }: InputHTMLAttributes<HTMLInputElement> & { focusStyle?: CSSProperties },
  ref: Ref<HTMLInputElement>,
): JSX.Element {
  const [focus, setFocus] = useState(false);
  return (
    <input
      ref={ref}
      style={focus ? { ...style, ...focusStyle } : style}
      onFocus={(e) => {
        setFocus(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        onBlur?.(e);
      }}
      {...rest}
    />
  );
});

/** Label pills — up to 3 (ported from `labelPills`). */
export function LabelPills({ ids }: { ids: string[] }): JSX.Element {
  return (
    <>
      {ids.slice(0, 3).map((id, i) => {
        const l = labelDefs[id];
        if (!l) return null;
        return (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              height: '19px',
              padding: '0 8px 0 7px',
              borderRadius: '5px',
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.color }} />
            {l.name}
          </span>
        );
      })}
    </>
  );
}

/** Как LabelPills, но для произвольных меток с собственным цветом (реальные данные). */
export function Pills({ items }: { items: { name: string; color: string }[] }): JSX.Element {
  return (
    <>
      {items.slice(0, 3).map((l, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            height: '19px',
            padding: '0 8px 0 7px',
            borderRadius: '5px',
            border: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.color }} />
          {l.name}
        </span>
      ))}
    </>
  );
}

export interface AvatarItem {
  initials: string;
  color: string;
  avatarUrl?: string | null;
  name?: string;
}

/** Стек аватаров исполнителей из реальных данных. */
export function AvatarStack({ items }: { items: AvatarItem[] }): JSX.Element {
  const shown = items.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {shown
        .slice()
        .reverse()
        .map((u, i) => (
          <div
            key={i}
            title={u.name || u.initials}
            style={{ marginLeft: '-7px', border: '2px solid var(--bg-app)', borderRadius: '50%', flexShrink: 0 }}
          >
            {u.avatarUrl ? (
              <img src={u.avatarUrl} alt={u.name || u.initials} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: u.color,
                  color: '#fff',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {u.initials}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

/** Overlapping avatar stack — up to 3 (ported from `avatars`). */
export function Avatars({ ids }: { ids: string[] }): JSX.Element {
  const shown = ids.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {shown
        .slice()
        .reverse()
        .map((id, i) => {
          const u = members[id];
          if (!u) return null;
          return (
            <div
              key={i}
              title={u.initials}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: u.color,
                color: '#fff',
                fontSize: '9.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-app)',
                marginLeft: '-7px',
              }}
            >
              {u.initials}
            </div>
          );
        })}
    </div>
  );
}
