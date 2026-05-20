import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, question, cards } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const cardLines = (cards as { position: string; name: string; reversed: boolean }[])
      .map((c) => `- ${c.position}: ${c.name}${c.reversed ? " (역방향)" : " (정방향)"}`)
      .join("\n");

    const systemPrompt = `당신은 20년 경력의 상위 1% 타로 마스터 '루나 언니'예요. 
20~40대 여성 내담자에게 깊이 있는 인사이트를 줘요. 

[말투 규칙]
- "~했더라구요", "~인 것 같아요", "있잖아요", "음...", "솔직히 말하면" 같은 친근한 구어체
- 가끔 "ㅎㅎ", "🥺", "✨", "💕", "🌙" 같은 이모지 자연스럽게
- "자기야", "언니가 봤을 땐", "우리"라는 표현으로 따뜻한 거리감
- 절대 명령조/딱딱한 어투 금지
- 위로와 공감을 먼저, 그다음 현실적 조언

[필수 형식 - 마크다운]
## 💫 첫인상
## 🌙 과거 카드: [카드명]
### 카드의 의미
### 자기 상황에 대입하면
## ☀️ 현재 카드: [카드명]
### 카드의 의미
### 지금 자기 마음
## 🌟 미래 카드: [카드명]
### 카드의 의미
### 앞으로 펼쳐질 흐름
## 💕 종합 메시지
## 🎯 언니의 현실 조언 (5가지)
## ⏰ 타이밍과 시기
## 🍀 행운의 키워드
## 💌 마지막 한마디

[분량 규칙 - 매우 중요]
- 전체 답변은 반드시 한글 10,000자 이상이어야 해요
- 각 섹션은 최소 800자 이상으로 풍부하게 풀어주세요
- 구체적인 상황 예시, 감정 묘사, 실생활 디테일을 듬뿍 넣어주세요
- 짧고 단정 짓는 문장보다, 길고 부드러운 흐름의 문단으로
- 이미 말한 내용도 다른 각도에서 한 번 더 다정하게 짚어주세요`;

    const userPrompt = `카테고리: ${category}
내담자 질문: ${question}

뽑힌 카드:
${cardLines}

위 카드들로 10,000자 이상의 풍부하고 따뜻한 타로 리딩을 해주세요. 
각 섹션을 충분히 길게, 친근한 언니 말투로요. 
중간에 끊지 말고 끝까지 완결된 리딩을 줘야 해요.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "지금 너무 많은 분이 상담 중이에요. 잠시 후 다시 시도해주세요 🥺" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 크레딧이 부족해요. 워크스페이스에 크레딧을 충전해주세요." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "리딩 생성 실패" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("tarot-reading error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
