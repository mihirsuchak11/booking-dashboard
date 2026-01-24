import { palette2Variants } from "./palette-2-data";
import { PalettePreview } from "../palette/palette-preview";

export default function Palette2Page() {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Dark Theme Color Palettes
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
            Explore 20 premium dark theme color palettes. Each palette shows
            both light and dark mode previews with buttons, cards, and sample UI
            components to help you choose the perfect theme.
          </p>
        </div>

        {/* Palette Grid */}
        <div className="flex flex-col gap-8">
          {palette2Variants.map((palette) => (
            <PalettePreview key={palette.name} palette={palette} />
          ))}
        </div>

        {/* Footer Instructions */}
        <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Ready to apply?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Tell me which palette you prefer (e.g., &quot;Ocean Blue&quot; or
            &quot;Emerald Green&quot;) and I&apos;ll apply it to your global
            styles.
          </p>
        </div>
      </div>
    </div>
  );
}
