"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './Placas.module.css';

const figures = {
  huella: 'M22 56C22 46 31 40 38 31C44 24 56 24 62 31C69 40 78 46 78 56C78 75 22 75 22 56ZM16 33C11 24 16 16 22 18C29 20 32 28 28 34C25 40 19 38 16 33ZM32 19C29 10 35 4 41 6C48 8 48 17 44 23C40 28 34 26 32 19ZM68 19C71 10 65 4 59 6C52 8 52 17 56 23C60 28 66 26 68 19ZM84 33C89 24 84 16 78 18C71 20 68 28 72 34C75 40 81 38 84 33Z',
  hueso: 'M17 39C2 36 3 13 15 10C25 7 32 14 34 16H66C68 14 75 7 85 10C97 13 98 36 83 39C98 42 97 65 85 68C75 71 68 64 66 62H34C32 64 25 71 15 68C3 65 2 42 17 39Z',
  circulo: 'M50 5a35 35 0 1 0 0 70a35 35 0 1 0 0-70Z',
  corazon: 'M50 73C39 65 13 46 13 28C13 9 37 5 50 22C63 5 87 9 87 28C87 46 61 65 50 73Z',
};
const pawBase = 'M12 40C6 32 8 20 15 15C19 12 24 12 29 13C30 5 37 0 44 3C48 4 49 7 50 9C51 7 52 4 56 3C63 0 70 5 71 13C76 12 81 12 85 15C92 20 94 32 88 40C85 44 81 44 78 44C84 50 87 58 82 65C74 78 26 78 18 65C13 58 16 50 22 44C19 44 15 44 12 40Z';
const textArea = {
  huella: [42, 53], hueso: [53, 44], circulo: [56, 47], corazon: [49, 44],
};
const holes = { huella: [50, 31], hueso: [17, 23], circulo: [50, 15], corazon: [30, 23] };
const colors = {
  naranja: { name: 'Naranja', hex: '#c44f20' },
  dorado: { name: 'Dorado', hex: '#e5b953' },
  rojo: { name: 'Rojo', hex: '#d34742' },
  azul: { name: 'Azul', hex: '#4381dd' },
  negro: { name: 'Negro', hex: '#211f24' },
  blanco: { name: 'Blanco', hex: '#f2eee5' },
};

const defaultColors = { base: 'naranja', detail: 'dorado' };
const colorParts = [
  { id: 'base', label: 'Base' },
  { id: 'detail', label: 'Relieve' },
];

function ColorOptions({ part, selected, onPick }) {
  return (
    <fieldset className={styles.colorRow}>
      <legend>{part.label} <span>· {colors[selected].name}</span></legend>
      <div className={styles.colorOptions}>
        {Object.entries(colors).map(([id, color]) => (
          <label key={id} title={color.name}>
            <input
              type="radio"
              name={`color-${part.id}`}
              value={id}
              checked={selected === id}
              aria-label={color.name}
              onChange={() => onPick(part.id, id)}
            />
            <span className={styles.swatch} style={{ backgroundColor: color.hex }} aria-hidden="true" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Piece({ model, palette, name = '', preview = false, onFit }) {
  const measure = useRef(null);
  const [fit, setFit] = useState(null);
  const [width, baseline] = textArea[model];
  const [holeX, holeY] = holes[model];
  const lettering = name || 'Luna';
  const outline = model === 'huella' ? pawBase : figures[model];

  useEffect(() => {
    if (!preview) return;
    let active = true;
    function measureName() {
      if (!active || !measure.current) return;
      const length = measure.current.getComputedTextLength();
      const size = Math.min(13, 13 * width / (length || 1));
      setFit({ model, lettering, size });
      onFit(size >= 7);
    }
    measureName();
    document.fonts?.ready.then(measureName);
    return () => { active = false; };
  }, [lettering, width, model, preview, onFit]);

  const size = fit?.lettering === lettering && fit.model === model ? fit.size : 13;
  return (
    <svg viewBox="0 0 100 82" className={styles.piece} aria-hidden="true">
      <path d={outline} fill={palette.edge} transform="translate(0 3)" />
      <path d={outline} fill={palette.base} stroke={palette.highlight} strokeWidth=".8" />
      {model === 'huella' && <path d={figures.huella} fill={palette.detail} fillOpacity=".18" />}
      <circle cx={holeX} cy={holeY} r="2.8" fill="#2d1914" stroke={palette.highlight} strokeWidth=".8" />
      {preview && <>
        <text ref={measure} visibility="hidden" fontSize="13" y={baseline}>{lettering}</text>
        <text x="50" y={baseline} textAnchor="middle" style={{ fill: palette.detail }} fontSize={Math.max(size, 7)}>
          {size < 7 ? '…' : lettering}
        </text>
      </>}
    </svg>
  );
}

export default function PlacasCatalog({ catalog }) {
  const [mode, setMode] = useState('model');
  const [modelId, setModelId] = useState(catalog.models[0].id);
  const [name, setName] = useState('');
  const [fits, setFits] = useState(true);
  const [variant, setVariant] = useState('normal');
  const [colorsByModel, setColorsByModel] = useState({});
  const [pieces, setPieces] = useState([]);
  const [summary, setSummary] = useState(false);
  const summaryHeading = useRef(null);

  const custom = mode === 'custom';
  const withNfc = variant === 'nfc';
  const model = catalog.models.find(({ id }) => id === modelId);
  function paletteFor(id) {
    const selection = colorsByModel[id] ?? defaultColors;
    const { hex: base, name: baseName } = colors[selection.base];
    const { hex: detail, name: detailName } = colors[selection.detail];
    return {
      base,
      detail,
      edge: `color-mix(in srgb, ${base}, black 25%)`,
      highlight: `color-mix(in srgb, ${base}, white 25%)`,
      description: `Base ${baseName.toLowerCase()} · relieve ${detailName.toLowerCase()}`,
    };
  }

  const selectedColors = colorsByModel[modelId] ?? defaultColors;
  const palette = paletteFor(modelId);
  const dimensions = `${model.size[0]} mm de ancho × ${model.size[1]} mm de alto`;

  function setColor(part, value) {
    setColorsByModel((current) => ({
      ...current,
      [modelId]: { ...defaultColors, ...current[modelId], [part]: value },
    }));
    setSummary(false);
  }

  useEffect(() => {
    if (summary) summaryHeading.current?.focus();
  }, [summary]);

  function addPiece(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const notes = String(data.get('notes') ?? '').trim();
    const pieceName = name.trim();
    if (!pieceName) {
      form.elements.name.setCustomValidity('Escribe un nombre para esta pieza.');
      form.elements.name.reportValidity();
      return;
    }
    const lines = [
      ['Producto', data.get('product') + ' impreso en 3D'],
      ['Figura', model.name + (model.confirmed ? '' : ' (fabricación por confirmar)')],
      ['Nombre personalizado', pieceName],
      ['Tamaño aproximado', dimensions],
      ['Colores', palette.description],
      ['Versión', withNfc ? 'Con NFC' : 'Sin NFC'],
      ...(!fits ? [['Legibilidad', 'Solicito revisar el nombre y su tamaño antes de fabricar.']] : []),
      ...(notes ? [['Observaciones', notes]] : []),
    ];
    const piece = { id: crypto.randomUUID(), lines, name: pieceName, model: model.name, palette: palette.description, withNfc };
    setPieces((current) => [...current, piece]);
    setSummary(false);
    setName('');
    form.elements.notes.value = '';
    form.elements.name.focus({ preventScroll: true });
  }

  function removePiece(id) {
    setPieces((current) => current.filter((piece) => piece.id !== id));
    setSummary(false);
  }

  const message = [
    'Hola, me gustaría hacer este pedido.',
    ...pieces.map((piece, index) => [
      `Pieza ${index + 1}`,
      ...piece.lines.map(([label, value]) => `${label}: ${value}`),
    ].join('\n')),
    `Cantidad: ${pieces.length}`,
  ].join('\n\n');
  const whatsappLink = catalog.whatsapp && pieces.length
    ? `https://wa.me/${catalog.whatsapp}?text=${encodeURIComponent(message)}`
    : null;

  const customMessage = 'Hola, quiero cotizar un diseño personalizado para una placa o llavero. Les comparto mi referencia por aquí.';
  const customLink = catalog.whatsapp ? `https://wa.me/${catalog.whatsapp}?text=${encodeURIComponent(customMessage)}` : null;

  return (
    <main id="main" className={`container-page ${styles.main}`}>
      <header className={styles.intro}>
        <h1>Placas para collar con NFC</h1>
        <p>Elige la forma y ponle el nombre de tu mascota. Si alguien la encuentra, puede acercar su celular a la placa y abrir su ficha para contactarte.</p>
        <div className={styles.portalLinks}>
          <a href="https://thinkdeep-mascotas.vercel.app/m/demo" className="button button-primary">Ver la ficha de Luna</a>
          <a href="https://thinkdeep-mascotas.vercel.app/mascotas" className={styles.textLink}>Administrar mi placa</a>
        </div>
      </header>
      <fieldset className={styles.catalog}>
        <legend>Elige una figura</legend>
        <p className={styles.measureNote}>Medidas aproximadas de la pieza (ancho × alto).</p>
        <div className={styles.models}>
          {catalog.models.map((item) => (
            <label key={item.id} className={styles.model}>
              <input
                type="radio"
                name="model"
                value={item.id}
                checked={!custom && item.id === modelId}
                onChange={() => {
                  setModelId(item.id);
                  setMode('model');
                  setSummary(false);
                }}
              />
              <Piece model={item.id} palette={paletteFor(item.id)} />
              <strong>{item.name}</strong>
              <small className={styles.dimensions}>{item.size.join(' × ')} mm</small>
              {!item.confirmed && <small>Fabricación por confirmar</small>}
            </label>
          ))}
          <button type="button" className={styles.model} aria-pressed={custom} onClick={() => {
            setMode('custom');
            setSummary(false);
            window.requestAnimationFrame(() => document.getElementById('diseno-personalizado')?.focus());
          }}>
            <Image
              className={`${styles.piece} ${styles.customImage}`}
              src="/placas/diseno-personalizado-max.png"
              alt=""
              width={150}
              height={123}
            />
            <strong>Diseño personalizado</strong>
            <small>Envíanos tu idea por WhatsApp</small>
          </button>
        </div>
      </fieldset>

      {!custom && (
        <section className={styles.colorPicker} aria-labelledby="placas-colores">
          <h2 id="placas-colores">Colores para {model.name.toLowerCase()}</h2>
          <div className={styles.colorRows}>
            {colorParts.map((part) => (
              <ColorOptions key={part.id} part={part} selected={selectedColors[part.id]} onPick={setColor} />
            ))}
          </div>
          <p>Te confirmamos los colores disponibles por WhatsApp.</p>
        </section>
      )}

      {custom ? (
        <section className={`${styles.panel} ${styles.customPanel}`}>
          <h2 id="diseno-personalizado" tabIndex={-1}>Cotización personalizada</h2>
          <p>Mándanos tu foto o idea por WhatsApp. Ahí confirmaremos las medidas y la cotización.</p>
          {customLink ?
            <a className="button button-primary" href={customLink} target="_blank" rel="noopener noreferrer">Enviar mi referencia por WhatsApp</a> :
            <p>El WhatsApp comercial está pendiente de configuración.</p>}
        </section>
      ) : (
        <form id="personalizar" className={styles.form} onSubmit={addPiece}
          onChange={(event) => { event.target.setCustomValidity?.(''); setSummary(false); }}>
          <div className={styles.layout}>
            <section className={styles.panel}>
              <h2>Personaliza tu pieza</h2>
              <label>Tipo de pieza
                <select name="product"><option>Placa para collar</option><option>Llavero</option></select>
              </label>
              <label>Nombre para la pieza
                <input name="name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Luna" aria-describedby="name-help" />
              </label>
              <p id="name-help" role="status">{fits ? 'La personalización del nombre está incluida.' :
                'El nombre supera el espacio legible de esta vista previa. Puedes solicitar una revisión por WhatsApp.'}</p>
              <div className={styles.preview}>
                <Piece model={modelId} palette={palette} name={name.trim()} preview onFit={setFits} />
                <div><strong>Vista previa ilustrativa</strong><p>{dimensions} aprox.</p><p>{palette.description}</p></div>
              </div>
              <label>Versión
                <select value={variant} onChange={(event) => setVariant(event.target.value)}>
                  <option value="normal">Sin NFC</option><option value="nfc">Con NFC</option>
                </select>
              </label>
              <label>Observaciones (opcional)<textarea name="notes" maxLength={400} rows={2} /></label>
            </section>
            <aside className={styles.panel} aria-labelledby="summary-heading">
              <button type="submit" className="button button-primary">Añadir pieza al pedido</button>
              <div className={styles.orderSummary}>
                <h2 id="summary-heading" ref={summaryHeading} tabIndex={-1}>
                  {summary ? 'Resumen de tu solicitud' : 'Tu pedido'}
                </h2>
                <p role="status">{pieces.length === 0 ? 'Aún no agregas piezas.' : pieces.length === 1 ? '1 pieza' : `${pieces.length} piezas`}</p>
                {pieces.length > 0 && (
                  <>
                    <ol>
                      {pieces.map((piece, index) => (
                        <li key={piece.id} className={styles.orderPiece}>
                          <strong>{piece.name} · {piece.model}</strong>
                          {summary ? <dl>{piece.lines.map(([label, value]) => (
                            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                          ))}</dl> : <p>{piece.withNfc ? 'Con NFC' : 'Sin NFC'} · {piece.palette}</p>}
                          <button type="button" className={styles.textLink} aria-label={`Quitar pieza ${index + 1}, ${piece.name}`}
                            onClick={() => removePiece(piece.id)}>Quitar pieza</button>
                        </li>
                      ))}
                    </ol>
                    {name.trim() && <p>Aún tienes una pieza por añadir al pedido.</p>}
                    {summary ? (
                      <>
                        <p>Te confirmamos el diseño, los colores y la entrega por WhatsApp.</p>
                        {whatsappLink ?
                          <a className="button button-primary" href={whatsappLink} target="_blank" rel="noopener noreferrer">Continuar por WhatsApp</a> :
                          <p>El WhatsApp comercial está pendiente de configuración.</p>}
                      </>
                    ) : <button type="button" className="button button-primary" onClick={() => setSummary(true)}>Revisar solicitud</button>}
                  </>
                )}
              </div>
            </aside>
          </div>
        </form>
      )}
    </main>
  );
}
