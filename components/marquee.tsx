import type { ReactNode } from "react";

type Item = {
  icon?: ReactNode;
  text: string;
};

type Props = {
  items: Item[];
  speed?: "normal" | "slow";
  className?: string;
  itemClassName?: string;
};

/**
 * Auto-scrolling marquee. Items are duplicated to create a seamless loop.
 * Pauses on hover via the `marquee-pause` parent class.
 */
export function Marquee({
  items,
  speed = "normal",
  className = "",
  itemClassName = "",
}: Props) {
  const animClass = speed === "slow" ? "animate-marquee-slow" : "animate-marquee";
  // Duplicate so the translateX(-50%) creates a seamless loop
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-pause overflow-hidden ${className}`}>
      <div className={`flex w-max items-center ${animClass}`}>
        {doubled.map((item, i) => (
          <div
            key={i}
            className={`flex flex-none items-center gap-2 px-6 ${itemClassName}`}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
