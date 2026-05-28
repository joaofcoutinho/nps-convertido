"use client";

import { motion } from "framer-motion";
import { classifyScore } from "@/lib/nps";

interface ScoreSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
  id?: string;
}

const SCORES = [0, 1, 2, 3, 4, 5];

function bgForState(score: number, selected: boolean): string {
  if (!selected) return "transparent";
  const c = classifyScore(score);
  if (c === "promoter") return "#2F6B3A";
  if (c === "passive") return "#A88416";
  return "#7A1F0E";
}

export function ScoreSelector({ value, onChange, id }: ScoreSelectorProps) {
  return (
    <div className="w-full" id={id} role="radiogroup" aria-label="Selecione uma nota de 0 a 5">
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {SCORES.map((s) => (
          <ScoreButton key={s} score={s} selected={value === s} onSelect={onChange} />
        ))}
      </div>

      <div className="flex justify-between mt-3 sm:mt-4 text-[10px] sm:text-xs font-sans text-brand-muted">
        <span>Pouco provável</span>
        <span>Muito provável</span>
      </div>
    </div>
  );
}

interface ScoreButtonProps {
  score: number;
  selected: boolean;
  onSelect: (n: number) => void;
}

function ScoreButton({ score, selected, onSelect }: ScoreButtonProps) {
  const bg = bgForState(score, selected);

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(score)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        scale: selected ? 1.06 : 1,
        backgroundColor: selected ? "#A264D8" : "rgba(255,255,255,0.02)",
        borderColor: selected ? "#A264D8" : "#241239",
        color: selected ? "#FFFFFF" : "#F4EEFB",
      }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="score-button relative h-11 sm:aspect-square sm:h-auto rounded-md border font-sans text-sm sm:text-lg font-medium flex items-center justify-center cursor-pointer"
      style={{
        boxShadow: selected ? `0 8px 24px -8px ${bg}` : "none",
      }}
    >
      {score}
      {selected && (
        <motion.span
          layoutId="score-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: bg }}
        />
      )}
    </motion.button>
  );
}
