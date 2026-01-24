"use client";

import type { ColorPalette, PaletteColors } from "./palette-data";

interface PalettePreviewProps {
  palette: ColorPalette;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="h-10 w-10 rounded-lg border border-black/10"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}

function PreviewCard({
  colors,
  mode,
}: {
  colors: PaletteColors;
  mode: "light" | "dark";
}) {
  const cssVars = {
    "--preview-background": colors.background,
    "--preview-foreground": colors.foreground,
    "--preview-card": colors.card,
    "--preview-card-foreground": colors.cardForeground,
    "--preview-primary": colors.primary,
    "--preview-primary-foreground": colors.primaryForeground,
    "--preview-secondary": colors.secondary,
    "--preview-secondary-foreground": colors.secondaryForeground,
    "--preview-muted": colors.muted,
    "--preview-muted-foreground": colors.mutedForeground,
    "--preview-accent": colors.accent,
    "--preview-accent-foreground": colors.accentForeground,
    "--preview-border": colors.border,
    "--preview-input": colors.input,
    "--preview-ring": colors.ring,
    "--preview-destructive": colors.destructive,
  } as React.CSSProperties;

  return (
    <div
      className="flex-1 rounded-xl p-5"
      style={{
        ...cssVars,
        backgroundColor: "var(--preview-background)",
        color: "var(--preview-foreground)",
      }}
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wide opacity-60">
        {mode} mode
      </p>

      {/* Color Swatches */}
      <div className="mb-5 flex flex-wrap gap-3">
        <ColorSwatch color={colors.primary} label="Primary" />
        <ColorSwatch color={colors.secondary} label="Secondary" />
        <ColorSwatch color={colors.muted} label="Muted" />
        <ColorSwatch color={colors.accent} label="Accent" />
        <ColorSwatch color={colors.border} label="Border" />
      </div>

      {/* Sample Card */}
      <div
        className="mb-4 rounded-lg border p-4"
        style={{
          backgroundColor: "var(--preview-card)",
          borderColor: "var(--preview-border)",
          color: "var(--preview-card-foreground)",
        }}
      >
        <p className="mb-1 text-sm font-semibold">Sample Card</p>
        <p
          className="text-xs"
          style={{ color: "var(--preview-muted-foreground)" }}
        >
          This is muted text inside a card component.
        </p>
      </div>

      {/* Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--preview-primary)",
            color: "var(--preview-primary-foreground)",
          }}
        >
          Primary
        </button>
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--preview-secondary)",
            color: "var(--preview-secondary-foreground)",
          }}
        >
          Secondary
        </button>
        <button
          className="rounded-lg border px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "transparent",
            borderColor: "var(--preview-border)",
            color: "var(--preview-foreground)",
          }}
        >
          Outline
        </button>
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--preview-destructive)",
            color: "white",
          }}
        >
          Destructive
        </button>
      </div>

      {/* Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Sample input field..."
          className="w-full rounded-lg border px-3 py-2 text-sm"
          style={{
            backgroundColor: "var(--preview-background)",
            borderColor: "var(--preview-input)",
            color: "var(--preview-foreground)",
          }}
          readOnly
        />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: "var(--preview-primary)",
            color: "var(--preview-primary-foreground)",
          }}
        >
          Badge
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: "var(--preview-secondary)",
            color: "var(--preview-secondary-foreground)",
          }}
        >
          Secondary
        </span>
        <span
          className="rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: "var(--preview-border)",
            color: "var(--preview-foreground)",
          }}
        >
          Outline
        </span>
      </div>
    </div>
  );
}

export function PalettePreview({ palette }: PalettePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 p-5 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ backgroundColor: palette.light.primary }}
          />
          <div>
            <h3 className="text-lg font-semibold">{palette.name}</h3>
            <p className="text-sm text-neutral-500">{palette.inspiration}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {palette.description}
        </p>
      </div>

      {/* Preview Cards */}
      <div className="flex flex-col gap-0 lg:flex-row">
        <PreviewCard colors={palette.light} mode="light" />
        <PreviewCard colors={palette.dark} mode="dark" />
      </div>
    </div>
  );
}
