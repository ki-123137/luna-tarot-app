import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Props = {
  onComplete: () => void;
};

const AdLoadingScreen = ({ onComplete }: Props) => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, onComplete]);

  const progress = ((5 - seconds) / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-card flex flex-col">
      {/* 광고 표시 바 */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white/60 px-2 py-0.5 rounded border border-white/20">
            AD
          </span>
          <span className="text-[12px] text-white/70 font-medium">광고</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-[12px] font-bold">{seconds}</span>
          </div>
          <span className="text-[12px] text-white/60">건너뛸 수 없음</span>
        </div>
      </div>

      {/* 광고 본문 (모의 광고) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-elevated"
        >
          <div className="bg-gradient-mystic h-44 flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center opacity-30"
            >
              <div className="w-72 h-72 rounded-full border-2 border-dashed border-white" />
            </motion.div>
            <div className="text-center relative">
              <div className="text-6xl mb-2">🔮</div>
              <p className="text-white font-bold text-lg tracking-tight">신비로운 운명</p>
              <p className="text-white/80 text-[11px]">Mystic Fortune</p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-[12px] text-primary font-bold mb-1">스폰서</p>
            <h3 className="font-bold text-[16px] mb-1.5 tracking-tight">
              나만의 운명 캘린더 받아보세요
            </h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              매일 아침 8시, 오늘의 운세와 행운템을 알려드려요
            </p>
            <div className="mt-3 h-9 bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-[12px] font-semibold text-foreground/60">
                자세히 보기 →
              </span>
            </div>
          </div>
        </motion.div>

        {/* 안내 문구 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-[11px] font-semibold text-white">
              잠시만 기다려주세요
            </span>
          </div>
          <p className="text-white/90 text-[14px] font-medium">
            광고 시청 후 바로 카드를 뽑을 수 있어요 ✨
          </p>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="px-5 pb-8">
        <div className="h-1 bg-white/15 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdLoadingScreen;
