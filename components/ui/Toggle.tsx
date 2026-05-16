'use client';

interface ToggleProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function Toggle({ options, value, onChange }: ToggleProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1 gap-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            value === option
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
