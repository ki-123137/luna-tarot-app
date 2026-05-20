import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Home, Sparkles, Loader2 } from "lucide-react";
import type { DrawnCard } from "@/lib/tarot";
import { toast } from "@/hooks/use-toast";

type Props = {
  category: string;
  question: string;
  cards: DrawnCard[];
  onHome: () => void;
};

const ResultScreen = ({ category, question, cards, onHome }: Props) => {
  const [reading, setReading] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const stream = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tarot-reading`;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            category,
            question,
            cards: cards.map((c) => ({
              position: c.position,
              name: c.card.name,
              reversed: c.reversed,
            })),
          }),
        });

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) {
            setError("지금 너무 많은 분이 상담 중이에요. 잠시 후 다시 시도해주세요 🥺");
          } else if (resp.status === 402) {
            setError("AI 크레딧이 부족해요. 잠시 후 다시 시도해주세요.");
          } else {
            setError("리딩 중 문제가 생겼어요. 다시 시도해주세요.");
          }
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamDone = false;
        let acc = "";

        while (!streamDone) {
          const { done: rDone, value } = await reader.read();
          if (rDone) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") {
              streamDone = true;
              break;
            }
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                acc += content;
                setReading(acc);
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
        setDone(true);
      } catch (e) {
        console.error(e);
        setError("연결에 문제가 생겼어요. 다시 시도해주세요.");
      }
    };
    stream();
  }, [category, question, cards]);

  // 자동 스크롤
  useEffect(() => {
    if (!done && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [reading, done]);

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen">
      <header className="px-3 pt-12 pb-3 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-10">
        <button
          onClick={onHome}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-mystic flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-[14px] leading-tight">루나 언니</p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {done ? "리딩 완료 ✨" : "리딩 중..."}
            </p>
          </div>
        </div>
        <button
          onClick={onHome}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-secondary"
        >
          <Home className="w-5 h-5" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {/* 사용자 질문 버블 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mb-3"
        >
          <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3">
            <p className="text-[10px] font-semibold opacity-80 mb-0.5">
              {category}
            </p>
            <p className="text-[14px] leading-relaxed">{question}</p>
          </div>
        </motion.div>

        {/* 카드 미리보기 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-start mb-3"
        >
          <div className="max-w-[85%] bg-secondary rounded-2xl rounded-tl-md p-3">
            <p className="text-[12px] text-muted-foreground mb-2 px-1">
              뽑힌 카드 3장이에요
            </p>
            <div className="flex gap-2">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-card rounded-xl p-2 text-center"
                >
                  <p className="text-white/70 text-[9px] font-bold mb-1">
                    {c.position}
                  </p>
                  <div
                    className="text-2xl mb-1"
                    style={{ transform: c.reversed ? "rotate(180deg)" : "none" }}
                  >
                    {c.card.emoji}
                  </div>
                  <p className="text-white text-[10px] font-semibold leading-tight">
                    {c.card.name}
                  </p>
                  {c.reversed && (
                    <p className="text-yellow-300/80 text-[8px] mt-0.5">역</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI 답변 버블 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-start mb-4"
        >
          <div className="max-w-[92%] bg-white border border-border rounded-2xl rounded-tl-md p-4 shadow-card">
            {error ? (
              <p className="text-[14px] text-destructive">{error}</p>
            ) : reading ? (
              <div className="tarot-prose">
                <ReactMarkdown>{reading}</ReactMarkdown>
                {!done && (
                  <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse rounded-sm align-middle" />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">
                  카드를 깊이 들여다보고 있어요...
                </p>
              </div>
            )}
            {done && !error && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground text-center">
                  💕 도움이 됐다면 다른 질문도 편하게 해주세요
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-2 pb-8"
          >
            <button
              onClick={onHome}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-[15px] shadow-elevated active:opacity-90"
            >
              다른 질문하러 가기 ✨
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
