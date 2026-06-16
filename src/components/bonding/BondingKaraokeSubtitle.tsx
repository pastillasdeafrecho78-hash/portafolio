"use client";

import {
  BONDING_SUBTITLES,
  SUBTITLE_LANGUAGES,
  getActiveCue,
  getCharState,
  splitWordChars,
  type SubtitleLang,
} from "@/lib/bonding-subtitles";

type BondingKaraokeSubtitleProps = {
  lang: SubtitleLang;
  currentTime: number;
};

export function BondingKaraokeSubtitle({ lang, currentTime }: BondingKaraokeSubtitleProps) {
  const cue = getActiveCue(BONDING_SUBTITLES[lang], currentTime);
  const activeLang = SUBTITLE_LANGUAGES.find((item) => item.id === lang);

  return (
    <div className="bonding-sub-panel" aria-live="polite">
      <p className="bonding-sub-lang-tag">
        Subtítulos · {activeLang?.name ?? lang.toUpperCase()}
      </p>
      {cue ? (
        <p className="bonding-sub-line">
          {cue.words.map((word, wordIndex) => (
            <span key={`${word.start}-${wordIndex}`} className="bonding-sub-word">
              {splitWordChars(word).map((item, charIndex) => (
                <span
                  key={`${item.start}-${charIndex}`}
                  className={`bonding-sub-char bonding-sub-char--${getCharState(item.start, item.end, currentTime)}`}
                >
                  {item.char}
                </span>
              ))}{" "}
            </span>
          ))}
        </p>
      ) : (
        <p className="bonding-sub-placeholder">…</p>
      )}
    </div>
  );
}

type BondingLangSwitchProps = {
  lang: SubtitleLang;
  onChange: (lang: SubtitleLang) => void;
};

export function BondingLangSwitch({ lang, onChange }: BondingLangSwitchProps) {
  return (
    <div className="bonding-lang-switch" role="group" aria-label="Idioma de subtítulos">
      {SUBTITLE_LANGUAGES.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bonding-lang-btn${lang === item.id ? " bonding-lang-btn--active" : ""}`}
          aria-pressed={lang === item.id}
          onClick={() => onChange(item.id)}
        >
          <span className="bonding-lang-btn-code">{item.label}</span>
          <span className="bonding-lang-btn-name">{item.name}</span>
        </button>
      ))}
    </div>
  );
}
