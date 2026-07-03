import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

export interface TFOption {
  value: string;
  label: string;
}

/**
 * Кастомный селект: триггер-кнопка + полностью стилизованное выпадающее меню.
 * Нативный <select> заменён потому, что список <option> рисуется ОС и не
 * поддаётся оформлению под тёмную тему TaskFlow.
 */
interface MenuPos {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
}

export function TFSelect({
  value,
  onChange,
  options,
  style,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: TFOption[];
  style?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Меню рендерится через портал с position:fixed, поэтому пересчитываем
    // его координаты по кнопке при открытии, скролле и ресайзе.
    const place = (): void => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const estH = Math.min(268, options.length * 34 + 12);
      const spaceBelow = window.innerHeight - r.bottom;
      const flipUp = spaceBelow < estH + 12 && r.top > spaceBelow;
      setPos({
        left: r.left,
        width: r.width,
        top: flipUp ? undefined : r.bottom + 5,
        bottom: flipUp ? window.innerHeight - r.top + 5 : undefined,
      });
    };
    place();

    const onDoc = (e: MouseEvent): void => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, options.length]);

  const selected = options.find((o) => o.value === value);
  const { flex, width, minWidth } = (style || {}) as CSSProperties;
  const portalTarget = (wrapRef.current?.closest('.tf-root') as HTMLElement | null) ?? (typeof document !== 'undefined' ? document.body : null);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', flex, width, minWidth }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxSizing: 'border-box',
          appearance: 'none',
          ...style,
          width: '100%',
          borderColor: open ? 'var(--accent)' : undefined,
          boxShadow: open ? '0 0 0 3px var(--accent-subtle)' : undefined,
          transition: 'border-color .14s, box-shadow .14s',
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: selected ? 'inherit' : 'var(--text-muted)',
          }}
        >
          {selected ? selected.label : placeholder ?? ''}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .16s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && pos && portalTarget &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              left: pos.left,
              top: pos.top,
              bottom: pos.bottom,
              width: pos.width,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '9px',
              boxShadow: 'var(--shadow)',
              padding: '5px',
              zIndex: 1000,
              maxHeight: '268px',
              overflowY: 'auto',
              animation: 'tf-pop .13s ease-out',
            }}
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <HButton
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '7px 9px',
                    border: 'none',
                    borderRadius: '6px',
                    background: active ? 'var(--accent-subtle)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 500,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                  hoverStyle={{ background: active ? 'var(--accent-subtle)' : 'var(--bg-surface)' }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.label}</span>
                  {active && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </HButton>
              );
            })}
          </div>,
          portalTarget,
        )}
    </div>
  );
}

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
