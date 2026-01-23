import { palettes } from "./palette-data";
import { PalettePreview } from "./palette-preview";

export default function PalettePage() {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Choose Your Color Palette
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
            Compare 5 premium color palettes inspired by industry-leading
            products. Each palette shows both light and dark mode previews with
            sample UI components.
          </p>
        </div>

        {/* Palette Grid */}
        <div className="flex flex-col gap-8">
          {palettes.map((palette) => (
            <PalettePreview key={palette.name} palette={palette} />
          ))}
        </div>

        {/* Footer Instructions */}
        <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Ready to apply?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Tell me which palette you prefer (e.g., &quot;Indigo&quot; or
            &quot;Slate&quot;) and I&apos;ll apply it to your global styles.
          </p>
        </div>
      </div>
    </div>
  );
}
