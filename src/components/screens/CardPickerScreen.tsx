import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawThreeCards, type DrawnCard } from "@/lib/tarot";
import { Sparkles } from "lucide-react";

type Props = {
  onComplete: (cards: DrawnCard[]) => void;
};

const CardPickerScreen = ({ onComplete }: Props) => {
  const [picked, setPicked] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [revealing, setRevealing] = useState(false);

  // 카드 12장 더미 표시
  const deck = Array.from({ length: 12 });

  const handlePick = (idx: number) => {
    if (picked.includes(idx) || picked.length >= 3) return;
    const newPicked = [...picked, idx];
    setPicked(newPicked);

    if (newPicked.length === 3) {
      setTimeout(() => {
        const cards = drawThreeCards();
        setDrawn(cards);
        setRevealing(true);
        setTimeout(() => onComplete(cards), 3500);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <header className="px-5 pt-14 pb-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-card mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-bold text-foreground/70">
            {picked.length} / 3 선택
          </span>
        </div>
        <h1 className="text-[22px] font-bold tracking-tight leading-snug">
          {revealing ? (
            <>마음으로 카드를<br />읽고 있어요 🌙</>
          ) : picked.length === 3 ? (
            <>잠시만요...<br />카드를 펼치고 있어요 ✨</>
          ) : (
            <>마음이 가는 카드<br />3장을 골라주세요 💫</>
          )}
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2">
          {revealing ? "곧 결과가 나와요" : "직감을 믿고 천천히 골라보세요"}
        </p>
      </header>

      <div className="flex-1 px-4 pt-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!revealing ? (
            <motion.div
              key="deck"
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid grid-cols-4 gap-2.5 max-w-md w-full"
            >
              {deck.map((_, i) => {
                const isPicked = picked.includes(i);
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: isPicked ? -12 : 0,
                      scale: isPicked ? 1.05 : 1,
                    }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePick(i)}
                    disabled={picked.length >= 3 || isPicked}
                    className="aspect-[2/3] rounded-xl relative overflow-hidden disabled:cursor-not-allowed"
                    style={{
                      background: isPicked
                        ? "var(--gradient-gold)"
                        : "var(--gradient-card)",
                      boxShadow: isPicked
                        ? "0 12px 28px -6px hsl(45 95% 55% / 0.5)"
                        : "var(--shadow-card)",
                    }}
                  >
                    <div className="absolute inset-1.5 rounded-lg border border-white/30 flex items-center justify-center">
                      {isPicked ? (
                        <span className="text-3xl">✨</span>
                      ) : (
                        <div className="text-center">
                          <div className="text-2xl opacity-80">🌙</div>
                        </div>
                      )}
                    </div>
                    {isPicked && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white text-foreground text-[11px] font-bold flex items-center justify-center">
                        {picked.indexOf(i) + 1}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 px-4"
            >
              {drawn?.map((dc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: 180 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 max-w-[110px]"
                >
                  <p className="text-center text-[11px] font-bold text-primary mb-2">
                    {dc.position}
                  </p>
                  <div
                    className="aspect-[2/3] rounded-2xl bg-gradient-card shadow-mystic flex flex-col items-center justify-center p-2 relative"
                    style={{ transform: dc.reversed ? "rotate(180deg)" : "none" }}
                  >
                    <div className="absolute inset-2 rounded-xl border border-yellow-300/30" />
                    <div className="text-4xl mb-1">{dc.card.emoji}</div>
                    <p className="text-white text-[10px] font-bold text-center leading-tight">
                      {dc.card.name}
                    </p>
                  </div>
                  {dc.reversed && (
                    <p className="text-center text-[10px] text-muted-foreground mt-1.5">
                      역방향
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-20" />
    </div>
  );
};

export default CardPickerScreen;
