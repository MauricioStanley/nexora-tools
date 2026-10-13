import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/tools/Icon';
import { CheckboxField, OptionsStack, RangeField } from '@/components/tools/options';
import { ToolPanel, ToolShell } from '@/components/tools/ToolShell';
import type { ToolIslandProps } from '@/components/tools/types';
import { fmt } from '@/i18n/format';
import type { PasswordGeneratorUi } from './i18n/en';
import { entropyBits, generatePassword, PASSWORD_LENGTH, strengthOf, type CharacterSet, type PasswordOptions } from './generate';
import styles from './Tool.module.css';

const SET_KEYS: CharacterSet[] = ['upper', 'lower', 'digits', 'symbols'];
const LEVEL = { weak: 1, fair: 2, strong: 3, veryStrong: 4 } as const;

type CopyState = 'idle' | 'copied' | 'failed';

export default function PasswordGeneratorTool(props: ToolIslandProps<PasswordGeneratorUi>) {
  const { ui, toolId } = props;
  const [options, setOptions] = useState<PasswordOptions>({ length: 16, lower: true, upper: true, digits: true, symbols: true, avoidAmbiguous: false });
  // Generated after hydration only: the server-rendered page never contains a password.
  const [password, setPassword] = useState('');
  const [copy, setCopy] = useState<CopyState>('idle');

  const regenerate = useCallback(() => {
    setPassword(generatePassword(options));
    setCopy('idle');
  }, [options]);

  useEffect(regenerate, [regenerate]);

  useEffect(() => {
    if (copy !== 'copied') return;
    const timer = window.setTimeout(() => setCopy('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [copy]);

  const set = <K extends keyof PasswordOptions>(key: K) => (value: PasswordOptions[K]) => setOptions((o) => ({ ...o, [key]: value }));
  const selectedSets = SET_KEYS.filter((key) => options[key]).length;
  const bits = entropyBits(options);
  const strength = strengthOf(bits);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
  };

  return (
    <ToolShell announcement={copy === 'copied' ? ui.copied : undefined}>
      <div className={styles.layout}>
        <ToolPanel>
          <div className={styles.result}>
            <output className={styles.password} aria-label={ui.passwordLabel}>
              {password || ' '}
            </output>
            <div className={styles.actions}>
              <button type="button" className="btn btn--primary btn--lg" onClick={onCopy} disabled={!password}>
                <Icon name={copy === 'copied' ? 'check' : 'copy'} />
                {copy === 'copied' ? ui.copied : ui.copy}
              </button>
              <button type="button" className="btn btn--secondary btn--lg" onClick={regenerate} disabled={selectedSets === 0}>
                <Icon name="refresh" />
                {ui.regenerate}
              </button>
            </div>
            {copy === 'failed' && <p className="field__error">{ui.copyFailed}</p>}
            <div className={styles.strength} data-level={LEVEL[strength]}>
              <div className={styles.meter} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>
                <strong>{ui.strength[strength]}</strong> · {fmt(ui.entropy, { bits })}
              </p>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel title={ui.options} titleId={`${toolId}-options`}>
          <OptionsStack>
            <RangeField
              label={ui.length}
              value={options.length}
              min={PASSWORD_LENGTH.min}
              max={PASSWORD_LENGTH.max}
              onChange={set('length')}
              format={(v) => fmt(ui.characters, { count: v })}
            />
            {SET_KEYS.map((key) => (
              <CheckboxField
                key={key}
                label={ui.sets[key]}
                checked={options[key]}
                // Keep at least one set selected.
                disabled={options[key] && selectedSets === 1}
                onChange={set(key)}
              />
            ))}
            <CheckboxField label={ui.avoidAmbiguous} hint={ui.avoidAmbiguousHint} checked={options.avoidAmbiguous} onChange={set('avoidAmbiguous')} />
          </OptionsStack>
        </ToolPanel>
      </div>
      <p className={styles.note}>
        <Icon name="shield" />
        {ui.privacyNote}
      </p>
    </ToolShell>
  );
}
