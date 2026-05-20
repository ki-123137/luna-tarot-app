import { useState } from "react";
import HomeScreen from "@/components/screens/HomeScreen";
import QuestionScreen from "@/components/screens/QuestionScreen";
import AdLoadingScreen from "@/components/screens/AdLoadingScreen";
import CardPickerScreen from "@/components/screens/CardPickerScreen";
import ResultScreen from "@/components/screens/ResultScreen";
import type { DrawnCard } from "@/lib/tarot";

type Step = "home" | "question" | "ad" | "cards" | "result";

const Index = () => {
  const [step, setStep] = useState<Step>("home");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);

  const goHome = () => {
    setStep("home");
    setCategory("");
    setQuestion("");
    setCards([]);
  };

  return (
    <main className="max-w-md mx-auto bg-background min-h-screen relative overflow-hidden">
      {step === "home" && (
        <HomeScreen
          onSelectCategory={(_id, label) => {
            setCategory(label);
            setStep("question");
          }}
        />
      )}
      {step === "question" && (
        <QuestionScreen
          category={category}
          onBack={goHome}
          onSubmit={(q) => {
            setQuestion(q);
            setStep("ad");
          }}
        />
      )}
      {step === "ad" && <AdLoadingScreen onComplete={() => setStep("cards")} />}
      {step === "cards" && (
        <CardPickerScreen
          onComplete={(c) => {
            setCards(c);
            setStep("result");
          }}
        />
      )}
      {step === "result" && (
        <ResultScreen
          category={category}
          question={question}
          cards={cards}
          onHome={goHome}
        />
      )}
    </main>
  );
};

export default Index;
