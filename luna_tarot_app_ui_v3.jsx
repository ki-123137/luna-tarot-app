import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function LunaTarotAppV3() {
  const [screen, setScreen] = useState('welcome');
  const [mode, setMode] = useState(null);
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('three');
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedReversed, setSelectedReversed] = useState([]);
  const [isSpreadAnimating, setIsSpreadAnimating] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [spreadVisual, setSpreadVisual] = useState([]);
  const canvasRef = useRef(null);

  const allCards = [
    // 메이저 아르카나 (22장)
    { id: 0, name: '광대', suit: 'Major', num: 0, symbol: '⭐' },
    { id: 1, name: '마술사', suit: 'Major', num: 1, symbol: '✨' },
    { id: 2, name: '여사제', suit: 'Major', num: 2, symbol: '🌙' },
    { id: 3, name: '황후', suit: 'Major', num: 3, symbol: '👑' },
    { id: 4, name: '황제', suit: 'Major', num: 4, symbol: '🏛️' },
    { id: 5, name: '교황', suit: 'Major', num: 5, symbol: '📿' },
    { id: 6, name: '연인', suit: 'Major', num: 6, symbol: '💕' },
    { id: 7, name: '전차', suit: 'Major', num: 7, symbol: '🎯' },
    { id: 8, name: '힘', suit: 'Major', num: 8, symbol: '💪' },
    { id: 9, name: '은둔자', suit: 'Major', num: 9, symbol: '🕯️' },
    { id: 10, name: '운명의 수레', suit: 'Major', num: 10, symbol: '🔄' },
    { id: 11, name: '절제', suit: 'Major', num: 11, symbol: '⚖️' },
    { id: 12, name: '교수형사', suit: 'Major', num: 12, symbol: '🔗' },
    { id: 13, name: '죽음', suit: 'Major', num: 13, symbol: '🦋' },
    { id: 14, name: '악마', suit: 'Major', num: 14, symbol: '👿' },
    { id: 15, name: '탑', suit: 'Major', num: 15, symbol: '⚡' },
    { id: 16, name: '별', suit: 'Major', num: 16, symbol: '⭐' },
    { id: 17, name: '달', suit: 'Major', num: 17, symbol: '🌙' },
    { id: 18, name: '태양', suit: 'Major', num: 18, symbol: '☀️' },
    { id: 19, name: '심판', suit: 'Major', num: 19, symbol: '📣' },
    { id: 20, name: '세계', suit: 'Major', num: 20, symbol: '🌍' },
    // 완드 수트 (14장)
    { id: 21, name: '완드 에이스', suit: 'Wands', num: 1, symbol: '🔥' },
    { id: 22, name: '완드 2', suit: 'Wands', num: 2, symbol: '🔥' },
    { id: 23, name: '완드 3', suit: 'Wands', num: 3, symbol: '🔥' },
    { id: 24, name: '완드 4', suit: 'Wands', num: 4, symbol: '🔥' },
    { id: 25, name: '완드 5', suit: 'Wands', num: 5, symbol: '🔥' },
    { id: 26, name: '완드 6', suit: 'Wands', num: 6, symbol: '🔥' },
    { id: 27, name: '완드 7', suit: 'Wands', num: 7, symbol: '🔥' },
    { id: 28, name: '완드 8', suit: 'Wands', num: 8, symbol: '🔥' },
    { id: 29, name: '완드 9', suit: 'Wands', num: 9, symbol: '🔥' },
    { id: 30, name: '완드 10', suit: 'Wands', num: 10, symbol: '🔥' },
    { id: 31, name: '완드 페이지', suit: 'Wands', num: 11, symbol: '🔥' },
    { id: 32, name: '완드 나이트', suit: 'Wands', num: 12, symbol: '🔥' },
    { id: 33, name: '완드 퀸', suit: 'Wands', num: 13, symbol: '🔥' },
    { id: 34, name: '완드 킹', suit: 'Wands', num: 14, symbol: '🔥' },
    // 컵 수트 (14장)
    { id: 35, name: '컵 에이스', suit: 'Cups', num: 1, symbol: '💧' },
    { id: 36, name: '컵 2', suit: 'Cups', num: 2, symbol: '💧' },
    { id: 37, name: '컵 3', suit: 'Cups', num: 3, symbol: '💧' },
    { id: 38, name: '컵 4', suit: 'Cups', num: 4, symbol: '💧' },
    { id: 39, name: '컵 5', suit: 'Cups', num: 5, symbol: '💧' },
    { id: 40, name: '컵 6', suit: 'Cups', num: 6, symbol: '💧' },
    { id: 41, name: '컵 7', suit: 'Cups', num: 7, symbol: '💧' },
    { id: 42, name: '컵 8', suit: 'Cups', num: 8, symbol: '💧' },
    { id: 43, name: '컵 9', suit: 'Cups', num: 9, symbol: '💧' },
    { id: 44, name: '컵 10', suit: 'Cups', num: 10, symbol: '💧' },
    { id: 45, name: '컵 페이지', suit: 'Cups', num: 11, symbol: '💧' },
    { id: 46, name: '컵 나이트', suit: 'Cups', num: 12, symbol: '💧' },
    { id: 47, name: '컵 퀸', suit: 'Cups', num: 13, symbol: '💧' },
    { id: 48, name: '컵 킹', suit: 'Cups', num: 14, symbol: '💧' },
    // 소드 수트 (14장)
    { id: 49, name: '소드 에이스', suit: 'Swords', num: 1, symbol: '⚔️' },
    { id: 50, name: '소드 2', suit: 'Swords', num: 2, symbol: '⚔️' },
    { id: 51, name: '소드 3', suit: 'Swords', num: 3, symbol: '⚔️' },
    { id: 52, name: '소드 4', suit: 'Swords', num: 4, symbol: '⚔️' },
    { id: 53, name: '소드 5', suit: 'Swords', num: 5, symbol: '⚔️' },
    { id: 54, name: '소드 6', suit: 'Swords', num: 6, symbol: '⚔️' },
    { id: 55, name: '소드 7', suit: 'Swords', num: 7, symbol: '⚔️' },
    { id: 56, name: '소드 8', suit: 'Swords', num: 8, symbol: '⚔️' },
    { id: 57, name: '소드 9', suit: 'Swords', num: 9, symbol: '⚔️' },
    { id: 58, name: '소드 10', suit: 'Swords', num: 10, symbol: '⚔️' },
    { id: 59, name: '소드 페이지', suit: 'Swords', num: 11, symbol: '⚔️' },
    { id: 60, name: '소드 나이트', suit: 'Swords', num: 12, symbol: '⚔️' },
    { id: 61, name: '소드 퀸', suit: 'Swords', num: 13, symbol: '⚔️' },
    { id: 62, name: '소드 킹', suit: 'Swords', num: 14, symbol: '⚔️' },
    // 펜타클 수트 (14장)
    { id: 63, name: '펜타클 에이스', suit: 'Pentacles', num: 1, symbol: '💰' },
    { id: 64, name: '펜타클 2', suit: 'Pentacles', num: 2, symbol: '💰' },
    { id: 65, name: '펜타클 3', suit: 'Pentacles', num: 3, symbol: '💰' },
    { id: 66, name: '펜타클 4', suit: 'Pentacles', num: 4, symbol: '💰' },
    { id: 67, name: '펜타클 5', suit: 'Pentacles', num: 5, symbol: '💰' },
    { id: 68, name: '펜타클 6', suit: 'Pentacles', num: 6, symbol: '💰' },
    { id: 69, name: '펜타클 7', suit: 'Pentacles', num: 7, symbol: '💰' },
    { id: 70, name: '펜타클 8', suit: 'Pentacles', num: 8, symbol: '💰' },
    { id: 71, name: '펜타클 9', suit: 'Pentacles', num: 9, symbol: '💰' },
    { id: 72, name: '펜타클 10', suit: 'Pentacles', num: 10, symbol: '💰' },
    { id: 73, name: '펜타클 페이지', suit: 'Pentacles', num: 11, symbol: '💰' },
    { id: 74, name: '펜타클 나이트', suit: 'Pentacles', num: 12, symbol: '💰' },
    { id: 75, name: '펜타클 퀸', suit: 'Pentacles', num: 13, symbol: '💰' },
    { id: 76, name: '펜타클 킹', suit: 'Pentacles', num: 14, symbol: '💰' },
  ];

  const spreads = {
    one: { name: '원 카드', positions: ['카드'] },
    three: { name: '과거/현재/미래', positions: ['과거', '현재', '미래'] },
    five: { name: '5카드 크로스', positions: ['중심', '왼쪽', '위', '오른쪽', '아래'] },
    celtic: { name: '켈틱 크로스', positions: ['현재', '교차', '위(목표)', '아래(기반)', '왼쪽(과거)', '오른쪽(미래)', '본인', '외부영향', '희망/두려움', '결과'] }
  };

  // 카드 스프레드 애니메이션
  const animateCardSpread = useCallback((numCards) => {
    setIsSpreadAnimating(true);
    const spread = [];
    const positions = getSpreadPositions(numCards);
    
    positions.forEach((pos, idx) => {
      const card = {
        id: idx,
        x: pos.x,
        y: pos.y,
        rotation: pos.rotation,
        delay: idx * 100,
      };
      spread.push(card);
    });

    setSpreadVisual(spread);
    
    setTimeout(() => {
      setIsSpreadAnimating(false);
    }, spread.length * 100 + 800);
  }, []);

  const getSpreadPositions = (numCards) => {
    const centerX = 320;
    const centerY = 200;
    const positions = [];

    if (numCards === 1) {
      positions.push({ x: centerX, y: centerY, rotation: 0 });
    } else if (numCards === 3) {
      const spacing = 150;
      positions.push({ x: centerX - spacing, y: centerY, rotation: -15 });
      positions.push({ x: centerX, y: centerY, rotation: 0 });
      positions.push({ x: centerX + spacing, y: centerY, rotation: 15 });
    } else if (numCards === 5) {
      // 크로스 배치
      positions.push({ x: centerX, y: centerY, rotation: 0 }); // 중심
      positions.push({ x: centerX - 120, y: centerY, rotation: -20 }); // 왼쪽
      positions.push({ x: centerX, y: centerY - 120, rotation: -10 }); // 위
      positions.push({ x: centerX + 120, y: centerY, rotation: 20 }); // 오른쪽
      positions.push({ x: centerX, y: centerY + 120, rotation: 10 }); // 아래
    } else if (numCards === 10) {
      // 켈틱 크로스 배치
      const mainCol = 160;
      const rightCol = 400;
      positions.push({ x: mainCol, y: 120, rotation: 0 }); // 1: 현재
      positions.push({ x: mainCol, y: 120, rotation: 90 }); // 2: 교차
      positions.push({ x: mainCol, y: 40, rotation: 0 }); // 3: 위
      positions.push({ x: mainCol, y: 200, rotation: 0 }); // 4: 아래
      positions.push({ x: 80, y: 120, rotation: 0 }); // 5: 왼쪽
      positions.push({ x: 240, y: 120, rotation: 0 }); // 6: 오른쪽
      positions.push({ x: rightCol, y: 60, rotation: 0 }); // 7: 본인
      positions.push({ x: rightCol, y: 120, rotation: 0 }); // 8: 외부
      positions.push({ x: rightCol, y: 180, rotation: 0 }); // 9: 희망
      positions.push({ x: rightCol, y: 240, rotation: 0 }); // 10: 결과
    }

    return positions;
  };

  const handleSelectCard = (cardId) => {
    const numCards = parseInt(spreadType.split('-')[0]) || 
                     (spreadType === 'one' ? 1 : spreadType === 'three' ? 3 : 
                      spreadType === 'five' ? 5 : spreadType === 'celtic' ? 10 : 1);
    
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
      setSelectedReversed(selectedReversed.filter(id => id !== cardId));
    } else if (selectedCards.length < numCards) {
      setSelectedCards([...selectedCards, cardId]);
      setSelectedReversed([...selectedReversed, false]);
    }
  };

  const handleToggleReverse = (idx) => {
    const newReversed = [...selectedReversed];
    newReversed[idx] = !newReversed[idx];
    setSelectedReversed(newReversed);
  };

  const startReading = async () => {
    if (selectedCards.length === 0) return;

    setIsLoading(true);
    animateCardSpread(selectedCards.length);

    // 카드 정보 생성
    const cardList = selectedCards.map((id, idx) => {
      const card = allCards[id];
      return `${idx + 1}. ${card.name}${selectedReversed[idx] ? ' (역방향)' : ''}`;
    }).join('\n');

    const prompt = `당신은 상위 3% 타로 상담 전문가입니다.

내담자 질문: "${question}"
스프레드: ${spreads[spreadType].name}

카드:
${cardList}

스토리텔링 방식으로 해석해주세요. 부정적 표현을 피하고 성장의 기회로 프레임하세요.

다음 형식으로 답변:

[공감 도입 - 2문장]

📖 카드가 전하는 이야기

**[위치] · [카드명]**
[해석]

(각 카드마다 반복)

✨ 종합 메시지
[통합 해석 및 조언]

💫 오늘의 한 마디
[핵심 메시지 1문장]`;

    try {
      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedCards.length >= 6 ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001',
          max_tokens: selectedCards.length >= 6 ? 6000 : 3000,
          system: '당신은 따뜻하고 공감적인 타로 상담 전문가입니다.',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      setInterpretation(data.content?.[0]?.text || '해석을 불러올 수 없습니다.');
    } catch (error) {
      setInterpretation('⚠️ 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    setIsLoading(false);
    setScreen('reading');
  };

  // ─── SCREEN RENDERS ───
  const renderWelcome = () => (
    <div style={styles.screen}>
      <h1 style={styles.title}>✦ Luna Tarot ✦</h1>
      <p style={styles.subtitle}>타로로 만나는 당신의 진실</p>
      
      <div style={styles.buttonGroup}>
        <button 
          style={styles.button}
          onClick={() => { setMode('client'); setScreen('setup'); }}
        >
          🌙 내담자 카드 선택
        </button>
        <button 
          style={styles.button}
          onClick={() => { setMode('advisor'); setScreen('setup'); }}
        >
          ⭐ 상담사 모드
        </button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div style={styles.screen}>
      <h2 style={styles.heading}>질문을 입력해주세요</h2>
      
      <input 
        type="text"
        placeholder="예: 새로운 일자리에 대해 알고 싶어요"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={styles.input}
      />

      <h3 style={styles.subheading}>스프레드 선택</h3>
      <div style={styles.spreadGrid}>
        {Object.entries(spreads).map(([key, spread]) => (
          <button
            key={key}
            style={{
              ...styles.spreadButton,
              backgroundColor: spreadType === key ? '#d4a574' : '#f5f0e8',
              color: spreadType === key ? '#fff' : '#333',
            }}
            onClick={() => setSpreadType(key)}
          >
            {spread.name}
            <br/>
            <small>({spread.positions.length}장)</small>
          </button>
        ))}
      </div>

      <button 
        style={{...styles.button, opacity: question.trim() ? 1 : 0.5}}
        onClick={() => setScreen('draw')}
        disabled={!question.trim()}
      >
        카드 선택하기 →
      </button>
    </div>
  );

  const renderDraw = () => {
    const numCards = spreads[spreadType].positions.length;
    
    return (
      <div style={styles.screen}>
        <h2 style={styles.heading}>
          {mode === 'client' ? '카드를 선택해주세요' : '카드를 배치해주세요'}
        </h2>

        {/* 카드 스프레드 애니메이션 영역 */}
        {isSpreadAnimating && (
          <div style={styles.spreadCanvas}>
            <svg width="100%" height="400" viewBox="0 0 640 400" style={{ background: '#f5f0e8', borderRadius: '8px' }}>
              {spreadVisual.map((card, idx) => (
                <g key={idx} style={{
                  animation: `fadeInDeal 0.6s ease-out ${card.delay}ms forwards`,
                  opacity: 0,
                }}>
                  <rect 
                    x={card.x - 40} 
                    y={card.y - 60} 
                    width="80" 
                    height="120" 
                    rx="4"
                    fill="#fff"
                    stroke="#d4a574"
                    strokeWidth="2"
                    style={{ 
                      transform: `rotate(${card.rotation}deg)`,
                      transformOrigin: `${card.x}px ${card.y}px`
                    }}
                  />
                  <text 
                    x={card.x} 
                    y={card.y} 
                    textAnchor="middle" 
                    dy="0.3em"
                    fontSize="24"
                    fill="#d4a574"
                    style={{ fontWeight: 'bold' }}
                  >
                    ✦
                  </text>
                </g>
              ))}
              <style>{`
                @keyframes fadeInDeal {
                  0% { opacity: 0; transform: translateY(-80px) rotate(-30deg); }
                  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
                }
              `}</style>
            </svg>
          </div>
        )}

        {/* 카드 선택 그리드 */}
        <div style={styles.cardGrid}>
          {allCards.map(card => (
            <button
              key={card.id}
              style={{
                ...styles.cardButton,
                backgroundColor: selectedCards.includes(card.id) ? '#d4a574' : '#fff',
                color: selectedCards.includes(card.id) ? '#fff' : '#333',
                opacity: selectedCards.includes(card.id) || selectedCards.length < numCards ? 1 : 0.4,
                pointerEvents: !selectedCards.includes(card.id) && selectedCards.length >= numCards ? 'none' : 'auto',
              }}
              onClick={() => handleSelectCard(card.id)}
            >
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{card.symbol}</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{card.name}</div>
              {selectedCards.includes(card.id) && (
                <button
                  style={styles.reverseBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleReverse(selectedCards.indexOf(card.id));
                  }}
                >
                  {selectedReversed[selectedCards.indexOf(card.id)] ? '⬆️' : '⬇️'}
                </button>
              )}
            </button>
          ))}
        </div>

        {selectedCards.length > 0 && (
          <div style={styles.selectedInfo}>
            <p>선택됨: {selectedCards.length}/{numCards}</p>
            <button 
              style={styles.button}
              onClick={startReading}
              disabled={selectedCards.length !== numCards}
            >
              리딩 시작 →
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderReading = () => (
    <div style={styles.screen}>
      <h2 style={styles.heading}>✦ 당신의 리딩 ✦</h2>
      
      {isLoading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>신비로운 메시지를 준비 중...</p>
        </div>
      ) : (
        <div style={styles.interpretationBox}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#333' }}>
            {interpretation}
          </div>
        </div>
      )}

      <button 
        style={styles.button}
        onClick={() => {
          setScreen('welcome');
          setQuestion('');
          setSelectedCards([]);
          setSelectedReversed([]);
          setSpreadType('three');
          setInterpretation('');
        }}
      >
        새로운 리딩 시작
      </button>
    </div>
  );

  // ─── RENDER LOGIC ───
  return (
    <div style={styles.app}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: linear-gradient(135deg, #f5f0e8 0%, #ede5d8 100%); font-family: 'EB Garamond', Georgia, serif; }
      `}</style>

      {screen === 'welcome' && renderWelcome()}
      {screen === 'setup' && renderSetup()}
      {screen === 'draw' && renderDraw()}
      {screen === 'reading' && renderReading()}
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0e8 0%, #ede5d8 100%)',
    padding: '20px',
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  screen: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '48px',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#8b4513',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  subtitle: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#a0643a',
    fontStyle: 'italic',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '24px',
    color: '#8b4513',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '16px',
    marginTop: '24px',
    marginBottom: '12px',
    color: '#8b4513',
    fontWeight: '600',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '40px',
  },
  button: {
    padding: '14px 20px',
    fontSize: '16px',
    backgroundColor: '#d4a574',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #d4a574',
    borderRadius: '6px',
    marginBottom: '24px',
    fontFamily: 'inherit',
  },
  spreadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '24px',
  },
  spreadButton: {
    padding: '12px 8px',
    fontSize: '13px',
    border: '1px solid #d4a574',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#f5f0e8',
    color: '#333',
    fontFamily: 'inherit',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  spreadCanvas: {
    marginBottom: '24px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
    marginBottom: '20px',
  },
  cardButton: {
    padding: '8px 4px',
    fontSize: '12px',
    border: '2px solid #d4a574',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    color: '#333',
    fontFamily: 'inherit',
    position: 'relative',
    transition: 'all 0.2s',
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reverseBtn: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'none',
    border: 'none',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '2px',
  },
  selectedInfo: {
    textAlign: 'center',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fff5eb',
    borderRadius: '6px',
    color: '#8b4513',
  },
  loading: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f0e6d9',
    borderTop: '4px solid #d4a574',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  interpretationBox: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #d4a574',
    marginBottom: '24px',
    lineHeight: '1.8',
  },
};
