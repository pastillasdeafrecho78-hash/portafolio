export type SubtitleLang = "es" | "en" | "ca" | "fr" | "it";

export type SubtitleWord = {
  text: string;
  start: number;
  end: number;
};

export type SubtitleCue = {
  start: number;
  end: number;
  words: SubtitleWord[];
};

export const SUBTITLE_LANGUAGES: { id: SubtitleLang; label: string; name: string }[] = [
  { id: "es", label: "ES", name: "Español" },
  { id: "en", label: "EN", name: "English" },
  { id: "ca", label: "CA", name: "Català" },
  { id: "fr", label: "FR", name: "Français" },
  { id: "it", label: "IT", name: "Italiano" },
];

/** Cortes alineados al audio ElevenLabs (segundos). */
const SEGMENTS = [
  { start: 0, end: 7.802 },
  { start: 7.802, end: 16.718 },
  { start: 16.718, end: 21.502 },
  { start: 21.502, end: 27.864 },
  { start: 27.864, end: 33.715 },
  { start: 33.715, end: 40.263 },
] as const;

const SCRIPTS: Record<SubtitleLang, string[]> = {
  es: [
    "Hola, soy Salvador Barba García. Ayudo a convertir contenido audiovisual en versiones localizadas, naturales y listas para publicar.",
    "Trabajo con flujos asistidos por IA para transcripción, subtitulado, traducción, sincronización y localización de voz.",
    "Puedo adaptar contenido audiovisual al catalán con subtítulos, voz y sincronización.",
    "Puedo adaptar vídeos al francés con voz natural, subtítulos precisos y sincronización clara.",
    "Puedo localizar contenido audiovisual al italiano, manteniendo ritmo, intención y naturalidad.",
    "Puedo preparar una muestra gratuita de hasta 30 segundos para demostrar el flujo completo de localización audiovisual.",
  ],
  en: [
    "Hello, I'm Salvador Barba García. I help turn audiovisual content into localized, natural versions ready to publish.",
    "I work with AI-assisted workflows for transcription, subtitling, translation, synchronization and voice localization.",
    "I can adapt audiovisual content into Catalan with subtitles, voice and synchronization.",
    "I can adapt videos into French with natural voice, precise subtitles and clear synchronization.",
    "I can localize audiovisual content into Italian, keeping rhythm, intention and naturalness.",
    "I can prepare a free sample of up to 30 seconds to demonstrate the full audiovisual localization workflow.",
  ],
  ca: [
    "Hola, sóc Salvador Barba García. Ajudo a convertir contingut audiovisual en versions localitzades, naturals i llestes per publicar.",
    "Treballo amb fluxos assistits per IA per transcripció, subtitulació, traducció, sincronització i localització de veu.",
    "Puc adaptar contingut audiovisual al català amb subtítols, veu i sincronització.",
    "Puc adaptar vídeos en francès amb veu natural, subtítols precisos i sincronització clara.",
    "Puc localitzar contingut audiovisual en italià, mantenint ritme, intenció i naturalitat.",
    "Puc preparar una mostra gratuïta de fins a 30 segons per demostrar el flux complet de localització audiovisual.",
  ],
  fr: [
    "Bonjour, je suis Salvador Barba García. J'aide à transformer du contenu audiovisuel en versions localisées, naturelles et prêtes à publier.",
    "Je travaille avec des flux assistés par IA pour la transcription, le sous-titrage, la traduction, la synchronisation et la localisation vocale.",
    "Je peux adapter du contenu audiovisuel en catalan avec sous-titres, voix et synchronisation.",
    "Je peux adapter des vidéos en français avec une voix naturelle, des sous-titres précis et une synchronisation claire.",
    "Je peux localiser du contenu audiovisuel en italien, en conservant le rythme, l'intention et le naturel.",
    "Je peux préparer un échantillon gratuit de jusqu'à 30 secondes pour démontrer le flux complet de localisation audiovisuelle.",
  ],
  it: [
    "Ciao, sono Salvador Barba García. Aiuto a trasformare contenuti audiovisivi in versioni localizzate, naturali e pronte per la pubblicazione.",
    "Lavoro con flussi assistiti dall'IA per trascrizione, sottotitoli, traduzione, sincronizzazione e localizzazione vocale.",
    "Posso adattare contenuti audiovisivi in catalano con sottotitoli, voce e sincronizzazione.",
    "Posso adattare video in francese con voce naturale, sottotitoli precisi e sincronizzazione chiara.",
    "Posso localizzare contenuti audiovisivi in italiano, mantenendo ritmo, intenzione e naturalezza.",
    "Posso preparare un campione gratuito fino a 30 secondi per dimostrare il flusso completo di localizzazione audiovisiva.",
  ],
};

function buildCue(start: number, end: number, text: string): SubtitleCue {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const span = end - start;
  const wordSpan = span / Math.max(tokens.length, 1);

  return {
    start,
    end,
    words: tokens.map((token, index) => ({
      text: token,
      start: start + index * wordSpan,
      end: start + (index + 1) * wordSpan,
    })),
  };
}

function buildTrack(lang: SubtitleLang): SubtitleCue[] {
  return SEGMENTS.map((segment, index) =>
    buildCue(segment.start, segment.end, SCRIPTS[lang][index] ?? ""),
  );
}

export const BONDING_SUBTITLES: Record<SubtitleLang, SubtitleCue[]> = {
  es: buildTrack("es"),
  en: buildTrack("en"),
  ca: buildTrack("ca"),
  fr: buildTrack("fr"),
  it: buildTrack("it"),
};

export function getActiveCue(cues: SubtitleCue[], time: number): SubtitleCue | null {
  return cues.find((cue) => time >= cue.start && time < cue.end) ?? null;
}

export function getCharState(charStart: number, charEnd: number, time: number): "pending" | "active" | "done" {
  if (time >= charEnd) return "done";
  if (time >= charStart) return "active";
  return "pending";
}

export function splitWordChars(word: SubtitleWord) {
  const chars = word.text.split("");
  const span = word.end - word.start;
  const charSpan = span / Math.max(chars.length, 1);

  return chars.map((char, index) => ({
    char,
    start: word.start + index * charSpan,
    end: word.start + (index + 1) * charSpan,
  }));
}
