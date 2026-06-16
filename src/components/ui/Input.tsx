import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-border-hover focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-text-secondary">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "min-h-[120px] resize-y rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-border-hover focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: readonly string[];
}

export function Select({ label, id, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-text-secondary">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3 text-text-primary transition-colors duration-200 focus:border-border-hover focus:outline-none",
          className,
        )}
        {...props}
      >
        <option value="">Selecciona un servicio</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
