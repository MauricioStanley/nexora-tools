import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icon } from '@/components/tools/Icon';
import { Notice } from '@/components/tools/Notice';
import { CheckboxField, ColorField, OptionsStack, RangeField, Segmented, SelectField, TextField } from '@/components/tools/options';
import { ToolPanel, ToolShell } from '@/components/tools/ToolShell';
import type { ToolIslandProps } from '@/components/tools/types';
import { fmt } from '@/i18n/format';
import { track } from '@/lib/analytics';
import type { QrUi } from './i18n/en';
import { buildQrPayload, EMPTY_FIELDS, type QrFields, type QrType, type WifiSecurity } from './payload';
import { contrastRatio, encodeQr, isInverted, qrPath, qrPngBlob, qrSvgDocument, type Ecc } from './render';
import styles from './Tool.module.css';

const SIZES = ['512', '1024', '2048'] as const;
type Size = (typeof SIZES)[number];

interface Downloads {
  png: string;
  svg: string;
}

export default function QrCodeTool(props: ToolIslandProps<QrUi>) {
  const { ui, common, toolId } = props;
  const [type, setType] = useState<QrType>('url');
  const [fields, setFields] = useState<QrFields>(EMPTY_FIELDS);
  const [ecc, setEcc] = useState<Ecc>('M');
  const [size, setSize] = useState<Size>('1024');
  const [margin, setMargin] = useState(4);
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [downloads, setDownloads] = useState<Downloads | null>(null);

  const set = <K extends keyof QrFields>(key: K) => (value: QrFields[K]) => setFields((f) => ({ ...f, [key]: value }));

  const payload = useMemo(() => buildQrPayload(type, fields), [type, fields]);
  const encoded = useMemo(() => (payload.ok ? encodeQr(payload.value, ecc) : null), [payload, ecc]);
  const matrix = encoded?.ok ? encoded.matrix : null;
  const error = !payload.ok ? (payload.error === 'empty' ? '' : ui.errors[payload.error]) : encoded && !encoded.ok ? ui.errors.too_long : '';

  // Build downloadable files shortly after the design settles; revoke old URLs.
  useEffect(() => {
    if (!matrix) {
      setDownloads(null);
      return;
    }
    let cancelled = false;
    let created: Downloads | null = null;
    const timer = window.setTimeout(async () => {
      const options = { margin, foreground, background, size: Number(size) };
      try {
        const png = await qrPngBlob(matrix, options);
        const svg = new Blob([qrSvgDocument(matrix, options)], { type: 'image/svg+xml' });
        if (cancelled) return;
        created = { png: URL.createObjectURL(png), svg: URL.createObjectURL(svg) };
        setDownloads(created);
      } catch {
        if (!cancelled) setDownloads(null);
      }
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (created) {
        URL.revokeObjectURL(created.png);
        URL.revokeObjectURL(created.svg);
      }
    };
  }, [matrix, margin, foreground, background, size]);

  const total = matrix ? matrix.size + margin * 2 : 0;
  const lowContrast = contrastRatio(foreground, background) < 4;
  const inverted = isInverted(foreground, background);

  const onDownload = (format: 'png' | 'svg') => track('download_clicked', { tool: toolId, output_format: format, mode: type });

  const fieldsFor: Record<QrType, ReactNode> = {
    url: (
      <TextField label={ui.urlLabel} value={fields.url} onChange={set('url')} type="url" inputMode="url" placeholder={ui.urlPlaceholder} error={error || undefined} />
    ),
    text: <TextField label={ui.textLabel} value={fields.text} onChange={set('text')} multiline placeholder={ui.textPlaceholder} error={error || undefined} maxLength={2900} />,
    wifi: (
      <>
        <TextField label={ui.ssidLabel} value={fields.wifiSsid} onChange={set('wifiSsid')} error={error || undefined} />
        <Segmented<WifiSecurity>
          legend={ui.securityLabel}
          value={fields.wifiSecurity}
          onChange={set('wifiSecurity')}
          options={[
            { value: 'WPA', label: ui.securityWpa },
            { value: 'WEP', label: ui.securityWep },
            { value: 'nopass', label: ui.securityNone },
          ]}
        />
        {fields.wifiSecurity !== 'nopass' && (
          <TextField label={ui.passwordLabel} value={fields.wifiPassword} onChange={set('wifiPassword')} type="password" autoComplete="off" hint={ui.wifiNote} />
        )}
        <CheckboxField label={ui.hiddenLabel} checked={fields.wifiHidden} onChange={set('wifiHidden')} />
      </>
    ),
    email: (
      <>
        <TextField label={ui.emailLabel} value={fields.email} onChange={set('email')} type="email" inputMode="email" placeholder={ui.emailPlaceholder} error={error || undefined} />
        <TextField label={ui.subjectLabel} value={fields.emailSubject} onChange={set('emailSubject')} />
        <TextField label={ui.bodyLabel} value={fields.emailBody} onChange={set('emailBody')} multiline />
      </>
    ),
    phone: (
      <TextField label={ui.phoneLabel} value={fields.phone} onChange={set('phone')} type="tel" inputMode="tel" placeholder={ui.phonePlaceholder} error={error || undefined} />
    ),
  };

  return (
    <ToolShell announcement={error || undefined}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <ToolPanel>
            <OptionsStack>
              <Segmented<QrType>
                legend={ui.typeLabel}
                value={type}
                onChange={setType}
                wrap
                options={(Object.keys(ui.types) as QrType[]).map((value) => ({ value, label: ui.types[value] }))}
              />
              {fieldsFor[type]}
            </OptionsStack>
          </ToolPanel>
        </div>

        <div className={styles.designArea}>
          <ToolPanel title={ui.design} titleId={`${toolId}-design`}>
            <div className={styles.design}>
              <Segmented<Ecc>
                legend={ui.eccLabel}
                value={ecc}
                onChange={setEcc}
                hint={ui.eccHint}
                options={(['L', 'M', 'Q', 'H'] as Ecc[]).map((value) => ({ value, label: ui.ecc[value] }))}
              />
              <SelectField<Size>
                label={ui.sizeLabel}
                value={size}
                onChange={setSize}
                options={SIZES.map((value) => ({ value, label: `${value} × ${value} px` }))}
              />
              <RangeField
                label={ui.marginLabel}
                value={margin}
                min={0}
                max={8}
                onChange={setMargin}
                format={(v) => fmt(ui.modules, { count: v })}
                hint={ui.marginHint}
              />
              <div className={styles.colors}>
                <ColorField label={ui.foreground} value={foreground} onChange={setForeground} />
                <ColorField label={ui.background} value={background} onChange={setBackground} />
              </div>
            </div>
          </ToolPanel>
        </div>

        <div className={styles.previewCol}>
          <div className={styles.preview}>
            {matrix ? (
              <svg viewBox={`0 0 ${total} ${total}`} role="img" aria-label={ui.previewLabel} shapeRendering="crispEdges">
                <rect width={total} height={total} fill={background} />
                <path fill={foreground} d={qrPath(matrix.modules, margin)} />
              </svg>
            ) : (
              <p className={styles.empty}>
                <Icon name="qr" />
                {ui.previewEmpty}
              </p>
            )}
          </div>

          {matrix && inverted && (
            <Notice tone="warning">
              <p>{ui.warnInverted}</p>
            </Notice>
          )}
          {matrix && !inverted && lowContrast && (
            <Notice tone="warning">
              <p>{ui.warnContrast}</p>
            </Notice>
          )}

          <div className={styles.downloads}>
            {downloads ? (
              <>
                <a className="btn btn--primary btn--lg" href={downloads.png} download={`${ui.fileName}.png`} onClick={() => onDownload('png')}>
                  <Icon name="download" />
                  {ui.downloadPng}
                </a>
                <a className="btn btn--secondary btn--lg" href={downloads.svg} download={`${ui.fileName}.svg`} onClick={() => onDownload('svg')}>
                  <Icon name="download" />
                  {ui.downloadSvg}
                </a>
              </>
            ) : (
              <>
                <button type="button" className="btn btn--primary btn--lg" disabled>
                  <Icon name="download" />
                  {ui.downloadPng}
                </button>
                <button type="button" className="btn btn--secondary btn--lg" disabled>
                  <Icon name="download" />
                  {ui.downloadSvg}
                </button>
              </>
            )}
          </div>
          <p className={styles.tip}>{matrix ? ui.testTip : common.result.localNote}</p>
        </div>
      </div>
    </ToolShell>
  );
}
