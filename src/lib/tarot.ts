export type TarotCard = {
  name: string;
  nameEn: string;
  emoji: string;
};

export const TAROT_DECK: TarotCard[] = [
  { name: "바보", nameEn: "The Fool", emoji: "🃏" },
  { name: "마법사", nameEn: "The Magician", emoji: "🪄" },
  { name: "여사제", nameEn: "The High Priestess", emoji: "🌙" },
  { name: "여황제", nameEn: "The Empress", emoji: "👑" },
  { name: "황제", nameEn: "The Emperor", emoji: "⚔️" },
  { name: "교황", nameEn: "The Hierophant", emoji: "🕊️" },
  { name: "연인", nameEn: "The Lovers", emoji: "💕" },
  { name: "전차", nameEn: "The Chariot", emoji: "🏇" },
  { name: "힘", nameEn: "Strength", emoji: "🦁" },
  { name: "은둔자", nameEn: "The Hermit", emoji: "🏮" },
  { name: "운명의 수레바퀴", nameEn: "Wheel of Fortune", emoji: "🎡" },
  { name: "정의", nameEn: "Justice", emoji: "⚖️" },
  { name: "매달린 사람", nameEn: "The Hanged Man", emoji: "🙃" },
  { name: "죽음", nameEn: "Death", emoji: "💀" },
  { name: "절제", nameEn: "Temperance", emoji: "🍷" },
  { name: "악마", nameEn: "The Devil", emoji: "😈" },
  { name: "탑", nameEn: "The Tower", emoji: "🗼" },
  { name: "별", nameEn: "The Star", emoji: "⭐" },
  { name: "달", nameEn: "The Moon", emoji: "🌕" },
  { name: "태양", nameEn: "The Sun", emoji: "☀️" },
  { name: "심판", nameEn: "Judgement", emoji: "📯" },
  { name: "세계", nameEn: "The World", emoji: "🌍" },
];

export type DrawnCard = {
  position: "과거" | "현재" | "미래";
  card: TarotCard;
  reversed: boolean;
};

export function drawThreeCards(): DrawnCard[] {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5).slice(0, 3);
  const positions: DrawnCard["position"][] = ["과거", "현재", "미래"];
  return shuffled.map((card, i) => ({
    position: positions[i],
    card,
    reversed: Math.random() < 0.3,
  }));
}

export const CATEGORIES = [
  { id: "love", label: "연애운", emoji: "💕", desc: "썸·연애·재회·결혼", gradient: "from-pink-400 to-rose-500" },
  { id: "money", label: "금전운", emoji: "💰", desc: "재물·투자·수입", gradient: "from-amber-400 to-yellow-500" },
  { id: "work", label: "직장운", emoji: "💼", desc: "이직·승진·사업", gradient: "from-blue-400 to-indigo-500" },
  { id: "relation", label: "인간관계", emoji: "🫂", desc: "친구·가족·동료", gradient: "from-green-400 to-teal-500" },
  { id: "general", label: "종합운", emoji: "🌟", desc: "오늘의 전체 흐름", gradient: "from-purple-400 to-fuchsia-500" },
] as const;
