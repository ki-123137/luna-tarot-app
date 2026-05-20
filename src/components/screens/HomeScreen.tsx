import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/tarot";
import { Sparkles, Moon, Star } from "lucide-react";

type Props = {
  onSelectCategory: (id: string, label: string) => void;
};

const HomeScreen = ({ onSelectCategory }: Props) => {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      {/* 헤더 */}
      <header className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-mystic flex items-center justify-center shadow-mystic">
              <Moon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">루나타로</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-card">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground/70">무료</span>
          </div>
        </div>
      </header>

      {/* 히어로 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-5 rounded-3xl bg-gradient-card p-6 shadow-mystic relative overflow-hidden mb-6"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-2 top-4 animate-float">
          <Star className="w-6 h-6 text-yellow-300/80 fill-yellow-300/40" />
        </div>
        <div className="absolute right-12 top-16 animate-float" style={{ animationDelay: "0.7s" }}>
          <Star className="w-3 h-3 text-yellow-300/60 fill-yellow-300/30" />
        </div>
        <div className="relative">
          <p className="text-white/70 text-xs font-medium mb-1">{dateStr} · 오늘의 한마디</p>
          <h1 className="text-white text-[22px] font-bold leading-snug mb-3 tracking-tight">
            오늘 자기에게<br />어떤 이야기가 펼쳐질까요? ✨
          </h1>
          <p className="text-white/80 text-[13px] leading-relaxed">
            카테고리를 골라 질문해보세요.<br />
            루나 언니가 카드 3장으로 자세히 봐드릴게요 🌙
          </p>
        </div>
      </motion.div>

      {/* 카테고리 */}
      <section className="px-5 mb-6">
        <h2 className="text-[15px] font-bold text-foreground/90 mb-3 px-1">무엇이 궁금하세요?</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectCategory(cat.id, cat.label)}
              className="bg-white rounded-2xl p-4 shadow-card text-left active:shadow-elevated transition-shadow"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="font-bold text-[15px] text-foreground mb-0.5">{cat.label}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{cat.desc}</div>
            </motion.button>
          ))}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * CATEGORIES.length + 0.1, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategory("free", "자유질문")}
            className="bg-gradient-mystic rounded-2xl p-4 shadow-mystic text-left text-white"
          >
            <div className="text-3xl mb-2">💬</div>
            <div className="font-bold text-[15px] mb-0.5">자유 질문</div>
            <div className="text-[11px] text-white/80 leading-tight">뭐든 물어보세요</div>
          </motion.button>
        </div>
      </section>

      {/* 안내 카드 */}
      <section className="px-5">
        <div className="bg-white rounded-2xl p-4 shadow-card flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-foreground mb-0.5">
              완전 무료로 이용하세요
            </p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              상담 전 짧은 광고를 시청하면 1만자 분량의 깊은 리딩을 받을 수 있어요 💕
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
