// Learn Hub content: lessons, paths, quizzes, flashcards.
import { GLOSSARY } from "./finance-data";

export type LessonStatus = "complete" | "in-progress" | "not-started";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "callout"; kind: "tip" | "warning" | "example" | "note"; text: string }
  | { type: "formula"; lines: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export interface LessonSection {
  id: string;
  heading: string;
  blocks: ContentBlock[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number; // index into options (content order)
  explanation: string;
}

export interface LessonContent {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  category: string;
  accent: string; // hex accent color
  duration: string;
  level: "Beginner" | "Intermediate";
  type: "article" | "video";
  videoUrl?: string;
  presets: string[];
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export interface LearningPath {
  id: string;
  emoji: string;
  accent: string;
  title: string;
  description: string;
  lessonIds: string[];
  estMin: number;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "psx-starter",
    emoji: "📊",
    accent: "#00d4aa",
    title: "PSX Investor Starter",
    description: "From zero to your first trade",
    lessonIds: ["candlestick", "psx", "stop-loss", "patterns"],
    estMin: 26,
  },
  {
    id: "technical",
    emoji: "📈",
    accent: "#8b5cf6",
    title: "Technical Analysis",
    description: "Charts, patterns, and indicators",
    lessonIds: ["rsi", "patterns", "heatmap"],
    estMin: 19,
  },
  {
    id: "islamic",
    emoji: "📿",
    accent: "#22c55e",
    title: "Islamic Finance",
    description: "Halal investing principles",
    lessonIds: ["halal", "dividend"],
    estMin: 15,
  },
  {
    id: "personal",
    emoji: "💰",
    accent: "#f59e0b",
    title: "Personal Finance",
    description: "Budget, save, and grow",
    lessonIds: ["budget", "dividend", "pe-ratio"],
    estMin: 18,
  },
];

// Title -> id mapping shared with the existing LESSONS list.
export const LESSON_ID_BY_TITLE: Record<string, string> = {
  "What is a Candlestick?": "candlestick",
  "Understanding RSI": "rsi",
  "Sector Heatmap Guide": "heatmap",
  "What is a Stop-Loss?": "stop-loss",
  "Dividend Yield": "dividend",
  "5 Candle Patterns": "patterns",
  "50/30/20 Budget Rule": "budget",
  "How PSX Works": "psx",
  "Halal Investing & Islamic Finance": "halal",
  "Understanding P/E Ratio": "pe-ratio",
};

function genericQuiz(topic: string): QuizQuestion[] {
  return [
    {
      q: `Which statement best describes ${topic}?`,
      options: [
        "It is a guaranteed way to make a profit",
        "It is a concept that helps you make more informed decisions",
        "It only applies to international markets, not PSX",
        "It is irrelevant for long-term investors",
      ],
      correct: 1,
      explanation: `${topic} is a tool/concept that helps you make more informed investing decisions — it is not a profit guarantee.`,
    },
    {
      q: `Why should a PSX investor understand ${topic}?`,
      options: [
        "To impress friends",
        "Because the broker requires it",
        "To better manage risk and spot opportunities",
        "There is no real reason",
      ],
      correct: 2,
      explanation:
        "Understanding the fundamentals helps you manage risk and recognise opportunities in the market.",
    },
    {
      q: `What is the smartest approach when applying ${topic}?`,
      options: [
        "Combine it with other signals and your own research",
        "Use it alone and ignore everything else",
        "Only trust tips from social media",
        "Avoid using it at all",
      ],
      correct: 0,
      explanation:
        "No single tool works in isolation — combine it with other signals and your own research for the best results.",
    },
  ];
}

const placeholderSections = (topic: string, accent: string): LessonSection[] => [
  {
    id: "introduction",
    heading: "Introduction",
    blocks: [
      {
        type: "p",
        text: `This lesson introduces ${topic} and why it matters for investors on the Pakistan Stock Exchange. Full written content is on the way — for now, watch the video (if available), review the key idea below, and test yourself with the quiz.`,
      },
      {
        type: "callout",
        kind: "tip",
        text: `Take your time with ${topic}. Re-reading once usually doubles how much you remember.`,
      },
    ],
  },
  {
    id: "the-core-idea",
    heading: "The Core Idea",
    blocks: [
      {
        type: "p",
        text: `At its heart, ${topic} is about understanding a single concept clearly and applying it consistently. PSX rewards patient, informed investors far more than impulsive ones.`,
      },
      {
        type: "formula",
        lines: [
          `Key Idea = Knowledge × Discipline`,
          `More knowledge + steady discipline = better outcomes`,
        ],
      },
    ],
  },
  {
    id: "why-it-matters",
    heading: "Why It Matters on PSX",
    blocks: [
      {
        type: "p",
        text: `Retail sentiment moves Pakistani markets quickly. Investors who understand ${topic} react calmly while others panic — and that edge compounds over time.`,
      },
      {
        type: "callout",
        kind: "warning",
        text: "Never act on a single data point. Confirm with additional signals before committing real money.",
      },
    ],
  },
];

export const LESSON_CONTENT: Record<string, LessonContent> = {
  candlestick: {
    id: "candlestick",
    emoji: "📊",
    title: "What is a Candlestick?",
    subtitle: "The building block of every PSX price chart",
    category: "PSX Basics",
    accent: "#00d4aa",
    duration: "4 min",
    level: "Beginner",
    type: "article",
    presets: ["What's a Doji candle?", "Show me a bullish pattern", "How do I use this on PSX?"],
    sections: [
      {
        id: "introduction",
        heading: "Introduction",
        blocks: [
          {
            type: "p",
            text: "Before you can read any PSX chart, you need to understand the building block of all price charts: the candlestick. Every candle tells you the story of a stock during a specific time period — whether buyers or sellers were in control.",
          },
          {
            type: "callout",
            kind: "tip",
            text: "Each candle on a 1-day chart represents one full trading day on PSX (9:30 AM to 3:30 PM). On a 1-hour chart, each candle = 1 hour of trading.",
          },
        ],
      },
      {
        id: "anatomy-of-a-candlestick",
        heading: "Anatomy of a Candlestick",
        blocks: [
          { type: "p", text: "Every candlestick has four data points, known as OHLC:" },
          {
            type: "formula",
            lines: [
              "O — Open:   Price at market open",
              "H — High:   Highest price reached",
              "L — Low:    Lowest price reached",
              "C — Close:  Price at market close",
            ],
          },
          {
            type: "p",
            text: "The thick part of the candle is called the BODY. It stretches from the Open to the Close price. The thin lines above and below the body are called WICKS (or shadows) — they show how far price traveled beyond the open/close range.",
          },
        ],
      },
      {
        id: "bullish-vs-bearish-candles",
        heading: "Bullish vs Bearish Candles",
        blocks: [
          {
            type: "p",
            text: "The color of a candle tells you instantly who won the battle between buyers and sellers that period:",
          },
          {
            type: "table",
            head: ["Type", "Color", "Meaning", "Close vs Open"],
            rows: [
              ["Bullish", "Teal/Green", "Buyers in control", "Close > Open"],
              ["Bearish", "Red", "Sellers in control", "Close < Open"],
              ["Doji", "Gray", "Indecision, no clear winner", "Close ≈ Open"],
            ],
          },
          {
            type: "callout",
            kind: "example",
            text: "HBL on June 5, 2026: Open: PKR 139.20 | High: PKR 143.80 | Low: PKR 138.50 | Close: 142.50. Result: GREEN candle. Body = 139.20 to 142.50. Upper wick = 142.50 to 143.80. Lower wick = 139.20 to 138.50. HBL had a bullish day.",
          },
        ],
      },
      {
        id: "what-the-wicks-tell-you",
        heading: "What the Wicks Tell You",
        blocks: [
          {
            type: "p",
            text: "Wicks are often more informative than the body. A LONG UPPER WICK means price tried to go higher but was pushed back down by sellers — a warning sign for bulls. A LONG LOWER WICK means price tried to drop but buyers stepped in and rescued it — a bullish signal. SHORT WICKS on both sides mean price moved decisively in one direction — strong conviction.",
          },
          {
            type: "callout",
            kind: "warning",
            text: "Never look at a single candlestick in isolation. One candle is just one data point. Patterns formed by 2-3 candles together are far more meaningful. Check the '5 Candle Patterns' lesson next.",
          },
        ],
      },
      {
        id: "why-this-matters-on-psx",
        heading: "Why This Matters on PSX",
        blocks: [
          {
            type: "p",
            text: "PSX stocks often show very clear candlestick signals because retail investor sentiment is strong. During the 2023 market recovery, the KSE-100 formed a textbook 'Morning Star' pattern (3 candles) that preceded a 4,000-point rally. Candlestick readers saw it coming.",
          },
          {
            type: "callout",
            kind: "note",
            text: "Candlesticks describe what already happened — they hint at probabilities, not certainties. Always pair them with risk management like a stop-loss.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "What does the BODY of a candlestick represent?",
        options: [
          "The highest and lowest price of the day",
          "The opening and closing price of the period",
          "The total volume traded",
          "The difference between two moving averages",
        ],
        correct: 1,
        explanation:
          "The body (thick part) shows where price OPENED and CLOSED. The wicks/shadows show the HIGH and LOW extremes.",
      },
      {
        q: "A GREEN (teal) candlestick on NafaIQ means...",
        options: [
          "The stock is halal certified",
          "Trading volume was above average",
          "The closing price was LOWER than the opening price",
          "The closing price was HIGHER than the opening price",
        ],
        correct: 3,
        explanation:
          "Green/teal = price closed higher than it opened = bullish (buying pressure). Red = closed lower = bearish.",
      },
      {
        q: "On PSX, if HBL opened at 140 and closed at 145, the candlestick body would be...",
        options: [
          "Red, spanning 140 to 145",
          "Green, spanning 140 to 145",
          "Red, spanning 145 to 140",
          "The color depends on volume, not price direction",
        ],
        correct: 1,
        explanation:
          "Price went UP (140→145), so the candle is GREEN. Body runs from open (140) at bottom to close (145) at top.",
      },
    ],
  },

  rsi: {
    id: "rsi",
    emoji: "📈",
    title: "Understanding RSI",
    subtitle: "Reading momentum with the Relative Strength Index",
    category: "Technical Analysis",
    accent: "#8b5cf6",
    duration: "6 min",
    level: "Intermediate",
    type: "video",
    presets: [
      "What's RSI divergence?",
      "Best RSI settings for PSX?",
      "Explain overbought vs oversold",
    ],
    sections: [
      {
        id: "introduction",
        heading: "Introduction",
        blocks: [
          {
            type: "p",
            text: "The Relative Strength Index (RSI) is a momentum oscillator that moves between 0 and 100. It helps you gauge whether a stock has been bought or sold too aggressively in the recent past.",
          },
          {
            type: "callout",
            kind: "tip",
            text: "The default RSI period is 14. On PSX daily charts, RSI(14) works well for most blue-chip stocks like HBL and ENGRO.",
          },
        ],
      },
      {
        id: "the-rsi-formula",
        heading: "The RSI Formula",
        blocks: [
          { type: "p", text: "RSI compares the size of recent gains to recent losses:" },
          {
            type: "formula",
            lines: ["RSI = 100 - [100 / (1 + RS)]", "Where RS = Avg Gain / Avg Loss"],
          },
        ],
      },
      {
        id: "overbought-and-oversold",
        heading: "Overbought and Oversold",
        blocks: [
          {
            type: "p",
            text: "An RSI above 70 is considered overbought (buying may be stretched), while below 30 is oversold (selling may be exhausted). These are warnings, not automatic buy/sell signals.",
          },
          {
            type: "callout",
            kind: "warning",
            text: "In strong trends RSI can stay overbought or oversold for a long time. Never short a stock just because RSI is above 70.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "RSI stands for...",
        options: [
          "Relative Stability Index",
          "Return on Stock Investment",
          "Relative Strength Index",
          "Risk Sensitivity Indicator",
        ],
        correct: 2,
        explanation:
          "RSI = Relative Strength Index. Developed by J. Welles Wilder in 1978. Measures momentum, not absolute strength.",
      },
      {
        q: "An RSI reading of 78 on HBL most likely suggests...",
        options: [
          "HBL is in a strong downtrend",
          "HBL is oversold and may bounce",
          "HBL is overbought and may face selling pressure",
          "HBL has very low trading volume",
        ],
        correct: 2,
        explanation:
          "RSI above 70 = overbought zone. Does not mean sell immediately, but warns that buying momentum is stretched.",
      },
      {
        q: "RSI of 25 on ENGRO in a downtrend typically signals...",
        options: [
          "Sell immediately — trend will continue forever",
          "Oversold conditions — potential reversal or bounce",
          "Overbought — price is too high",
          "No signal — RSI below 30 is irrelevant",
        ],
        correct: 1,
        explanation:
          "Below 30 = oversold. In a strong downtrend, RSI can stay low — but it warns of potential exhaustion of sellers.",
      },
    ],
  },

  "stop-loss": {
    id: "stop-loss",
    emoji: "🛡️",
    title: "What is a Stop-Loss?",
    subtitle: "Protecting your capital with a planned exit",
    category: "Risk Management",
    accent: "#f59e0b",
    duration: "5 min",
    level: "Beginner",
    type: "article",
    presets: [
      "What's a trailing stop-loss?",
      "How to avoid stop hunts?",
      "PSX circuit breaker vs stop-loss?",
    ],
    sections: [
      {
        id: "introduction",
        heading: "Introduction",
        blocks: [
          {
            type: "p",
            text: "A stop-loss is a pre-set order that automatically sells your position once price falls to a level you choose in advance. It is the single most important tool for protecting your capital.",
          },
          {
            type: "callout",
            kind: "tip",
            text: "Decide your stop-loss BEFORE you buy, while you are calm and objective — not after price is already falling.",
          },
        ],
      },
      {
        id: "how-it-works",
        heading: "How It Works",
        blocks: [
          {
            type: "p",
            text: "If you buy LUCK at PKR 845 and set a stop-loss at PKR 820, your broker will trigger a sell order if price touches 820 — capping your loss at roughly PKR 25 per share.",
          },
          {
            type: "formula",
            lines: ["Max Loss = (Entry - Stop) × Shares", "Example: (845 - 820) × 100 = PKR 2,500"],
          },
        ],
      },
      {
        id: "where-to-place-it",
        heading: "Where to Place It",
        blocks: [
          {
            type: "p",
            text: "Place your stop-loss just below a meaningful support level or recent swing low — the level where your reason for buying would no longer be valid. Arbitrary percentages are weaker than technical levels.",
          },
          {
            type: "callout",
            kind: "warning",
            text: "In fast markets your stop may execute slightly below your level (slippage). Build a small buffer into your risk plan.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "What is the PRIMARY purpose of a stop-loss order?",
        options: [
          "To maximize profit on winning trades",
          "To automatically buy more shares when price drops",
          "To limit your maximum loss on a position",
          "To predict when a stock will reverse direction",
        ],
        correct: 2,
        explanation:
          "Stop-loss = pre-set exit. You decide in advance how much loss you can accept. Removes emotion from the decision.",
      },
      {
        q: "You buy LUCK at PKR 845. You set a stop-loss at PKR 820. If LUCK drops to 820, what happens?",
        options: [
          "Nothing — you must manually sell",
          "Your broker alerts you but waits for confirmation",
          "Your position is automatically sold at ~PKR 820",
          "You automatically buy more LUCK at the lower price",
        ],
        correct: 2,
        explanation:
          "A stop-loss triggers a SELL order when price hits your set level. Execution may be slightly below 820 in fast markets (slippage).",
      },
      {
        q: "Where should a stop-loss ideally be placed?",
        options: [
          "Exactly 5% below entry price, always",
          "Just below a key support level or recent swing low",
          "At your average cost price to break even",
          "Stop-losses are only for beginners — experts don't use them",
        ],
        correct: 1,
        explanation:
          "Technical placement beats arbitrary percentages. Below support = the level where your trade thesis is invalidated.",
      },
    ],
  },

  dividend: {
    id: "dividend",
    emoji: "💰",
    title: "Dividend Yield",
    subtitle: "Measuring the income a stock pays you",
    category: "Fundamentals",
    accent: "#22c55e",
    duration: "7 min",
    level: "Intermediate",
    type: "article",
    presets: [
      "What is a payout ratio?",
      "Best dividend stocks on PSX?",
      "Are dividends taxed in Pakistan?",
    ],
    sections: [
      {
        id: "introduction",
        heading: "Introduction",
        blocks: [
          {
            type: "p",
            text: "Dividend yield tells you how much cash income a stock pays relative to its price. It is the favourite metric of income-focused PSX investors who want regular returns, not just capital gains.",
          },
          {
            type: "callout",
            kind: "tip",
            text: "High-dividend PSX names like FFC and HUBCO are popular with retirees and conservative investors seeking steady payouts.",
          },
        ],
      },
      {
        id: "the-formula",
        heading: "The Formula",
        blocks: [
          {
            type: "p",
            text: "Dividend yield is the annual dividend per share divided by the current price, expressed as a percentage:",
          },
          {
            type: "formula",
            lines: [
              "Dividend Yield = (Annual Dividend / Share Price) × 100",
              "Example: (16 / 168) × 100 = 9.52%",
            ],
          },
        ],
      },
      {
        id: "price-and-yield",
        heading: "Price and Yield Move Opposite",
        blocks: [
          {
            type: "p",
            text: "Because price is the denominator, a rising share price (with the same dividend) lowers the yield, and a falling price raises it. A very high yield can sometimes be a warning that the market expects a dividend cut.",
          },
          {
            type: "callout",
            kind: "warning",
            text: "An unusually high yield is not always good news — check whether the company can actually sustain the payout.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "Dividend Yield formula is...",
        options: [
          "Share Price ÷ Annual Dividend",
          "Annual Dividend × Share Price",
          "Annual Dividend ÷ Share Price × 100",
          "Net Profit ÷ Total Shares",
        ],
        correct: 2,
        explanation:
          "Yield = (Annual DPS / Current Price) × 100. If FFC pays PKR 16/share and trades at 168, yield = 9.5%.",
      },
      {
        q: "FFC pays PKR 16 dividend. Current price is PKR 168. What is the dividend yield?",
        options: ["16%", "9.52%", "168%", "10.5%"],
        correct: 1,
        explanation:
          "(16 ÷ 168) × 100 = 9.52%. FFC is known as a high-dividend stock on PSX — attractive for income investors.",
      },
      {
        q: "If a stock's PRICE rises but dividend stays the same...",
        options: [
          "Dividend yield increases",
          "Dividend yield stays the same",
          "Dividend yield decreases",
          "The company must increase its dividend",
        ],
        correct: 2,
        explanation:
          "Yield = dividend ÷ price. Higher price = lower yield (same numerator, bigger denominator). Inverse relationship.",
      },
    ],
  },

  heatmap: {
    id: "heatmap",
    emoji: "🗺️",
    title: "Sector Heatmap Guide",
    subtitle: "Spotting market rotation at a glance",
    category: "Technical Analysis",
    accent: "#3b82f6",
    duration: "3 min",
    level: "Beginner",
    type: "article",
    presets: [
      "What is sector rotation?",
      "Why are banks green today?",
      "How often does the heatmap update?",
    ],
    sections: placeholderSections("the sector heatmap", "#3b82f6"),
    quiz: genericQuiz("the sector heatmap"),
  },

  patterns: {
    id: "patterns",
    emoji: "🔍",
    title: "5 Candle Patterns",
    subtitle: "High-probability setups every trader should know",
    category: "Technical Analysis",
    accent: "#8b5cf6",
    duration: "8 min",
    level: "Intermediate",
    type: "video",
    presets: [
      "What is a Morning Star?",
      "How reliable are patterns?",
      "Bullish vs bearish engulfing?",
    ],
    sections: placeholderSections("the five key candle patterns", "#8b5cf6"),
    quiz: genericQuiz("candle patterns"),
  },

  budget: {
    id: "budget",
    emoji: "📒",
    title: "50/30/20 Budget Rule",
    subtitle: "A simple framework for managing your salary",
    category: "Personal Finance",
    accent: "#f59e0b",
    duration: "4 min",
    level: "Beginner",
    type: "article",
    presets: [
      "How do I start budgeting?",
      "What counts as a 'want'?",
      "Adapting 50/30/20 for Pakistan?",
    ],
    sections: placeholderSections("the 50/30/20 budget rule", "#f59e0b"),
    quiz: genericQuiz("the 50/30/20 budget rule"),
  },

  psx: {
    id: "psx",
    emoji: "🏛️",
    title: "How PSX Works",
    subtitle: "The mechanics of the Pakistan Stock Exchange",
    category: "PSX Basics",
    accent: "#00d4aa",
    duration: "9 min",
    level: "Beginner",
    type: "video",
    presets: ["What is the KSE-100?", "How do I open a CDC account?", "What are trading hours?"],
    sections: placeholderSections("how the Pakistan Stock Exchange works", "#00d4aa"),
    quiz: genericQuiz("how PSX works"),
  },

  halal: {
    id: "halal",
    emoji: "📿",
    title: "Halal Investing & Islamic Finance",
    subtitle: "Sharia-compliant principles for the modern investor",
    category: "Islamic Finance",
    accent: "#22c55e",
    duration: "8 min",
    level: "Beginner",
    type: "article",
    presets: [
      "What makes a stock halal?",
      "What is the KMI-30 index?",
      "Is interest income allowed?",
    ],
    sections: placeholderSections("halal investing and Islamic finance", "#22c55e"),
    quiz: genericQuiz("halal investing"),
  },

  "pe-ratio": {
    id: "pe-ratio",
    emoji: "🧮",
    title: "Understanding P/E Ratio",
    subtitle: "Judging whether a stock is cheap or expensive",
    category: "Fundamentals",
    accent: "#3b82f6",
    duration: "5 min",
    level: "Intermediate",
    type: "article",
    presets: ["What is a 'good' P/E?", "Forward vs trailing P/E?", "P/E for PSX banks?"],
    sections: placeholderSections("the price-to-earnings ratio", "#3b82f6"),
    quiz: genericQuiz("the P/E ratio"),
  },
};

export interface Flashcard {
  front: string;
  ur: string;
  def: string;
}

export const FLASHCARDS: Flashcard[] = GLOSSARY.map((t) => ({ front: t.en, ur: t.ur, def: t.def }));

export function lessonOrder(): string[] {
  return Object.keys(LESSON_ID_BY_TITLE).map((title) => LESSON_ID_BY_TITLE[title]);
}

export function xpForScore(correct: number, total: number): number {
  if (correct >= total) return 50;
  if (correct >= Math.ceil(total * 0.66)) return 30;
  if (correct >= 1) return 10;
  return 0;
}
