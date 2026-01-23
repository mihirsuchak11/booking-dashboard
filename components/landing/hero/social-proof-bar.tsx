const avatarImages = [
  "https://i.pravatar.cc/80?img=1",
  "https://i.pravatar.cc/80?img=2",
  "https://i.pravatar.cc/80?img=3",
  "https://i.pravatar.cc/80?img=4",
  "https://i.pravatar.cc/80?img=5",
];

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      className={`size-3.5 ${filled ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function SocialProofBar() {
  return (
    <div className="self-start flex flex-col gap-2">
      {/* Main Chip */}
      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2.5">
        {/* Avatar Stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {avatarImages.slice(0, 3).map((src, index) => (
              <img
                key={index}
                src={src}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-white/20 object-cover"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-white whitespace-nowrap">
            Trusted by 500+ businesses
          </span>
        </div>

        {/* Separator - Hidden on mobile */}
        <div className="hidden sm:block h-4 w-px bg-white/20" />

        {/* Rating - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled />
            ))}
          </div>
          <span className="text-sm font-medium text-white">4.9/5</span>
          <span className="text-sm text-white/60">from 200+ reviews</span>
        </div>
      </div>

      {/* Rating - Shown only on mobile, below the chip */}
      <div className="flex sm:hidden items-center gap-1.5 whitespace-nowrap">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled />
          ))}
        </div>
        <span className="text-sm font-medium text-white">4.9/5</span>
        <span className="text-sm text-white/60">from 200+ reviews</span>
      </div>
    </div>
  );
}
