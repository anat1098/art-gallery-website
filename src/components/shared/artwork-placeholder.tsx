const PALETTES = [
  "from-[#e9dcc5] via-[#d9c3a1] to-[#b98757]",
  "from-[#efe3d3] via-[#ddc9a8] to-[#9c6b3f]",
  "from-[#e4dccd] via-[#c9b48f] to-[#8a5f3a]",
  "from-[#f0e9de] via-[#e0cba8] to-[#a97b4c]",
];

type ArtworkPlaceholderProps = {
  seed: string;
  className?: string;
};

/** Warm gradient stand-in for artwork photography, until real images are uploaded. */
export function ArtworkPlaceholder({ seed, className }: ArtworkPlaceholderProps) {
  const index =
    Math.abs(
      seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    ) % PALETTES.length;

  return (
    <div
      aria-hidden
      className={`bg-gradient-to-br ${PALETTES[index]} ${className ?? ""}`}
    />
  );
}
