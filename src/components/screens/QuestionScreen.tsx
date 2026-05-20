import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";

type Props = {
  category: string;
  onBack: () => void;
  onSubmit: (question: string) => void;
};

const QuestionScreen = ({ category, onBack, onSubmit }: Props) => {
  const [question, setQuestion] = useState("");
  const placeholders: Record<string, string> = {
    연애운: "예) 요즘 썸타는 사람이랑 잘 될까요?",
    금전운: "예) 이번달 재테크 어떻게 하면 좋을까요?",
    직장운: "예) 이직 고민 중인데 지금이 좋은 타이밍일까요?",
    인간관계: "예) 친구랑 요즘 좀 어색한데 어떻게 하면 좋을까요?",
    종합운: "예) 요즘 제 전반적인 흐름이 궁금해요",
    자유질문: "예) 어떤 고민이든 편하게 적어주세요",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-3 pt-12 pb-3 flex items-center">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-secondary transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-[17px] ml-1">{category} 상담</h1>
      </header>

      <div className="flex-1 px-5 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-soft mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">루나 언니가 들어드릴게요</span>
          </div>
          <h2 className="text-[22px] font-bold leading-snug tracking-tight">
            어떤 게 가장 궁금하세요?<br />
            편하게 털어놓으세요 💕
          </h2>
          <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
            구체적으로 적을수록 더 정확하게 봐드릴 수 있어요.<br />
            고민 상황·관계·기간 등을 함께 적어주세요.
          </p>
        </motion.div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholders[category] || "질문을 적어주세요"}
          rows={6}
          className="w-full bg-secondary rounded-2xl p-4 text-[15px] leading-relaxed resize-none outline-none focus:ring-2 focus:ring-primary/30 transition placeholder:text-muted-foreground/70"
        />
        <p className="text-[11px] text-muted-foreground mt-2 px-1">
          {question.length} / 500자
        </p>
      </div>

      <div className="px-5 pb-8 pt-3 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent">
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={question.trim().length < 5}
          onClick={() => onSubmit(question.trim())}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-[16px] flex items-center justify-center gap-2 shadow-elevated disabled:bg-secondary disabled:text-muted-foreground disabled:shadow-none transition"
        >
          <Send className="w-4.5 h-4.5" />
          카드 뽑으러 가기
        </motion.button>
        <p className="text-[11px] text-center text-muted-foreground mt-2">
          무료 이용을 위해 짧은 광고가 재생돼요
        </p>
      </div>
    </div>
  );
};

export default QuestionScreen;
