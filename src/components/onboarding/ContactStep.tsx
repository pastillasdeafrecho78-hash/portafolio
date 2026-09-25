"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useAppleGlass } from "@/hooks/useAppleGlass";
import {
  COUNTRIES,
  countryByIso,
  formatInternational,
  parsePhoneInput,
  type Country,
} from "@/lib/countries";

export type Gender = "male" | "female";

type Props = {
  name: string;
  phone: string;
  countryIso: string;
  gender: Gender | null;
  waOptIn: boolean;
  onNameChange: (value: string) => void;
  onPhoneChange: (national: string, countryIso: string) => void;
  onGenderChange: (value: Gender) => void;
  onWaOptInChange: (value: boolean) => void;
  onContinue: () => void;
};

function IconMale({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10" cy="14" r="5.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M14.2 9.8 20 4M20 4h-5.2M20 4v5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFemale({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 14.25V21M9.2 18.2h5.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GenderButton({
  value,
  selected,
  onSelect,
  children,
}: {
  value: Gender;
  selected: boolean;
  onSelect: (v: Gender) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`glass-gender glass-gender--${value === "male" ? "m" : "f"}${selected ? " is-selected" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(value)}
    >
      {children}
    </button>
  );
}

/** Lee lo que el navegador autocompletó en el DOM (a veces no dispara onChange). */
function useAutofillSync(
  formRef: React.RefObject<HTMLFormElement | null>,
  name: string,
  phone: string,
  countryIso: string,
  gender: Gender | null,
  onNameChange: (v: string) => void,
  onPhoneChange: (national: string, iso: string) => void,
  onGenderChange: (v: Gender) => void,
) {
  const syncFromDom = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    const nameEl = form.elements.namedItem("name") as HTMLInputElement | null;
    const telEl = form.elements.namedItem("tel-national") as HTMLInputElement | null;
    const sexEl = form.elements.namedItem("sex") as HTMLSelectElement | null;
    const ccEl = form.elements.namedItem("tel-country-code") as HTMLInputElement | null;

    const nextName = nameEl?.value.trim() ?? "";
    if (nextName.length >= 2 && nextName !== name.trim()) {
      onNameChange(nextName);
    }

    const rawTel = telEl?.value ?? "";
    if (rawTel.trim()) {
      let iso = countryIso;
      if (ccEl?.value) {
        const dial = ccEl.value.replace(/\D/g, "");
        const match = COUNTRIES.find((c) => c.dial === dial);
        if (match) iso = match.iso;
      }
      const parsed = parsePhoneInput(rawTel, iso);
      const nationalDigits = parsed.national.replace(/\D/g, "");
      if (nationalDigits !== phone.replace(/\D/g, "") || parsed.iso !== countryIso) {
        onPhoneChange(parsed.national, parsed.iso);
      }
    }

    const sex = sexEl?.value;
    if (sex === "male" || sex === "female") {
      if (gender !== sex) onGenderChange(sex);
    }
  }, [
    formRef,
    name,
    phone,
    countryIso,
    gender,
    onNameChange,
    onPhoneChange,
    onGenderChange,
  ]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    let interval: number | undefined;

    const burst = () => {
      window.clearInterval(interval);
      let n = 0;
      syncFromDom();
      interval = window.setInterval(() => {
        syncFromDom();
        n += 1;
        if (n >= 24) window.clearInterval(interval);
      }, 100);
    };

    burst();
    form.addEventListener("focusin", burst, true);
    form.addEventListener("change", syncFromDom, true);
    form.addEventListener("input", syncFromDom, true);

    return () => {
      form.removeEventListener("focusin", burst, true);
      form.removeEventListener("change", syncFromDom, true);
      form.removeEventListener("input", syncFromDom, true);
      window.clearInterval(interval);
    };
  }, [formRef, syncFromDom]);
}

export function ContactStep({
  name,
  phone,
  countryIso,
  gender,
  waOptIn,
  onNameChange,
  onPhoneChange,
  onGenderChange,
  onWaOptInChange,
  onContinue,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const countryBtnRef = useAppleGlass<HTMLButtonElement>({ preset: "cta", shape: "pill" });
  const continueRef = useAppleGlass<HTMLButtonElement>({ preset: "cta", shape: "pill" });

  const country = countryByIso(countryIso);

  useAutofillSync(
    formRef,
    name,
    phone,
    countryIso,
    gender,
    onNameChange,
    onPhoneChange,
    onGenderChange,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const canContinue =
    name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 7 && gender != null;

  const selectCountry = (c: Country) => {
    onPhoneChange(phone, c.iso);
    setOpen(false);
    setQuery("");
  };

  const onPhoneInput = (raw: string) => {
    const parsed = parsePhoneInput(raw, countryIso);
    onPhoneChange(parsed.national, parsed.iso);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    onContinue();
  };

  return (
    <form
      ref={formRef}
      className="onboard-contact"
      autoComplete="on"
      onSubmit={onSubmit}
    >
      {/* País para autofill (Chrome agrupa tel-national + tel-country-code) */}
      <input
        type="text"
        name="tel-country-code"
        autoComplete="tel-country-code"
        defaultValue={`+${country.dial}`}
        key={country.iso}
        tabIndex={-1}
        aria-hidden
        className="onboard-contact__autofill-hook"
      />

      <label className="onboard-contact__field">
        <span className="onboard-contact__label">Nombre</span>
        <input
          className="onboard-contact__input"
          type="text"
          name="name"
          id="onboard-contact-name"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </label>

      <div className="onboard-contact__field">
        <span className="onboard-contact__label">Teléfono (WhatsApp)</span>
        <div className="onboard-phone" ref={wrapRef}>
          <button
            ref={countryBtnRef}
            type="button"
            className="onboard-phone__country"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="onboard-phone__flag" aria-hidden>
              {country.flag}
            </span>
            <span className="onboard-phone__dial">+{country.dial}</span>
            <span className="onboard-phone__chev" aria-hidden>
              ▾
            </span>
          </button>

          <input
            className="onboard-contact__input onboard-phone__input"
            type="tel"
            name="tel-national"
            id="onboard-contact-tel"
            autoComplete="tel-national"
            inputMode="tel"
            enterKeyHint="done"
            placeholder="418 177 4543"
            value={phone}
            onChange={(e) => onPhoneInput(e.target.value)}
            onInput={(e) => onPhoneInput((e.target as HTMLInputElement).value)}
          />

          {open ? (
            <div className="onboard-phone__menu" id={listId} role="listbox">
              <input
                className="onboard-phone__search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar país"
                autoComplete="off"
                autoFocus
              />
              <ul className="onboard-phone__list">
                {filtered.map((c) => (
                  <li key={c.iso}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.iso === country.iso}
                      className={`onboard-phone__option${c.iso === country.iso ? " is-active" : ""}`}
                      onClick={() => selectCountry(c)}
                    >
                      <span className="onboard-phone__flag" aria-hidden>
                        {c.flag}
                      </span>
                      <span className="onboard-phone__name">{c.name}</span>
                      <span className="onboard-phone__dial-muted">+{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <p className="onboard-contact__hint" aria-live="polite">
          {formatInternational(countryIso, phone)}
        </p>
      </div>

      <div className="onboard-contact__field">
        <span className="onboard-contact__label">Género</span>
        {/* Select nativo para que el navegador pueda autocompletar sex/gender */}
        <select
          name="sex"
          autoComplete="sex"
          value={gender ?? ""}
          tabIndex={-1}
          aria-hidden
          className="onboard-contact__autofill-hook"
          onChange={(e) => {
            const v = e.target.value;
            if (v === "male" || v === "female") onGenderChange(v);
          }}
        >
          <option value="" />
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <div className="onboard-gender" role="group" aria-label="Género">
          <GenderButton value="male" selected={gender === "male"} onSelect={onGenderChange}>
            <IconMale className="glass-gender__icon" />
            <span>Hombre</span>
          </GenderButton>
          <GenderButton
            value="female"
            selected={gender === "female"}
            onSelect={onGenderChange}
          >
            <IconFemale className="glass-gender__icon" />
            <span>Mujer</span>
          </GenderButton>
        </div>
      </div>

      <label className="onboard-contact__optin">
        <input
          type="checkbox"
          checked={waOptIn}
          onChange={(e) => onWaOptInChange(e.target.checked)}
        />
        <span>
          Puedo escribirte por WhatsApp con el seguimiento de tu solicitud.
        </span>
      </label>

      <button
        ref={continueRef}
        type="submit"
        className="glass-cta onboard-contact__continue"
        disabled={!canContinue}
      >
        <span className="glass-cta-label">WhatsApp</span>
      </button>
    </form>
  );
}
