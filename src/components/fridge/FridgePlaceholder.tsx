const CREAM = "#F5E6C8";

export function FridgePlaceholder() {
  return (
    <div className="fridge-game-shell flex items-center justify-center px-6">
      <p
        className="text-center text-lg md:text-xl"
        style={{
          fontFamily: "var(--font-crimson-pro), serif",
          color: CREAM,
        }}
      >
        Catch the Falling Ingredients — Coming Soon
      </p>
    </div>
  );
}
