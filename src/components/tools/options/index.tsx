/**
 * Option controls for tool panels. All are built on native form elements, so keyboard
 * support (arrow keys in radio groups, etc.) and screen-reader semantics come for free.
 */
import { useEffect, useId, useState, type ReactNode } from 'react';
import styles from './Options.module.css';

export function OptionsStack({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>;
}

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
}

interface SegmentedProps<T extends string> {
  legend: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  hint?: string;
  /** Wrap onto multiple rows (for 4+ options). */
  wrap?: boolean;
}

export function Segmented<T extends string>({ legend, value, options, onChange, disabled, hint, wrap }: SegmentedProps<T>) {
  const name = useId();
  const hintId = useId();
  return (
    <fieldset className={styles.fieldset} disabled={disabled} aria-describedby={hint ? hintId : undefined}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.segmented} data-wrap={wrap ?? options.length > 3}>
        {options.map((option) => (
          <label key={option.value} className={styles.segment}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              {option.label}
              {option.sublabel && <small>{option.sublabel}</small>}
            </span>
          </label>
        ))}
      </div>
      {hint && (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      )}
    </fieldset>
  );
}

interface RangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
  hint?: string;
}

export function RangeField({ label, value, min, max, step = 1, onChange, format, minLabel, maxLabel, disabled, hint }: RangeProps) {
  const id = useId();
  const display = format ? format(value) : String(value);
  return (
    <div className={styles.fieldset}>
      <div className={styles.rangeHead}>
        <label htmlFor={id} className={styles.legend}>
          {label}
        </label>
        <output htmlFor={id} className={styles.rangeValue}>
          {display}
        </output>
      </div>
      <input
        id={id}
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={display}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
      {(minLabel || maxLabel) && (
        <div className={styles.rangeScale} aria-hidden="true">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  hint?: string;
}

export function SelectField<T extends string>({ label, value, options, onChange, disabled, hint }: SelectProps<T>) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <select id={id} className="input" value={value} disabled={disabled} onChange={(event) => onChange(event.currentTarget.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}

export function CheckboxField({ label, checked, onChange, hint, disabled }: CheckboxProps) {
  return (
    <label className={styles.check}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span className={styles.checkText}>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </label>
  );
}

interface NumberProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  suffix?: string;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
}

export function NumberField({ label, value, onChange, min, max, suffix, disabled, invalid, placeholder }: NumberProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className={styles.inputAffix}>
        <input
          id={id}
          className="input tabular"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(event) => {
            const raw = event.currentTarget.value;
            onChange(raw === '' ? '' : Number(raw));
          }}
        />
        {suffix && (
          <span className={styles.affix} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function FieldPair({ children, separator = '×' }: { children: [ReactNode, ReactNode]; separator?: string }) {
  return (
    <div className={styles.pair}>
      {children[0]}
      <span className={styles.pairSep} aria-hidden="true">
        {separator}
      </span>
      {children[1]}
    </div>
  );
}

interface TextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: 'text' | 'url' | 'email' | 'tel' | 'password';
  placeholder?: string;
  hint?: string;
  error?: string;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: 'text' | 'url' | 'email' | 'tel';
  required?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  multiline,
  type = 'text',
  placeholder,
  hint,
  error,
  maxLength,
  autoComplete = 'off',
  inputMode,
  required,
}: TextProps) {
  const id = useId();
  const hintId = useId();
  const describedBy = error || hint ? hintId : undefined;
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className="input"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          required={required}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      ) : (
        <input
          id={id}
          className="input"
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          required={required}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      )}
      {(error || hint) && (
        <p id={hintId} className={error ? 'field__error' : 'field__hint'}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

interface ColorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorProps) {
  const id = useId();
  const textId = useId();
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="field">
      <label htmlFor={textId} className="field__label">
        {label}
      </label>
      <div className={styles.color}>
        <input id={id} type="color" value={value} onChange={(event) => onChange(event.currentTarget.value)} aria-label={label} />
        <input
          id={textId}
          className="input"
          type="text"
          value={draft}
          maxLength={7}
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={!/^#[0-9a-f]{6}$/i.test(draft) || undefined}
          onChange={(event) => {
            const next = event.currentTarget.value.trim();
            setDraft(next);
            if (/^#[0-9a-f]{6}$/i.test(next)) onChange(next.toLowerCase());
          }}
          onBlur={() => setDraft(value)}
        />
      </div>
    </div>
  );
}
