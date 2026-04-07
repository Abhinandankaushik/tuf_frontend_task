export interface CalendarTheme {
  id: string;
  name: string;
  emoji: string;
  mood: string;
  // 12 monthly Unsplash images (curated topics)
  images: string[];
  // HSL accent colors per month (auto-extracted feel)
  accents: string[];
  // Light mode overrides
  light: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    muted: string;
    mutedForeground: string;
    border: string;
    accent: string;
  };
  // Dark mode overrides
  dark: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    muted: string;
    mutedForeground: string;
    border: string;
    accent: string;
  };
}

const UNSPLASH_BASE = "https://images.unsplash.com";

export const THEMES: CalendarTheme[] = [
  {
    id: "space",
    name: "Space",
    emoji: "🚀",
    mood: "cosmic",
    images: [
      `${UNSPLASH_BASE}/photo-1462331940025-496dfbfc7564?w=1200&h=400&fit=crop`, // nebula
      `${UNSPLASH_BASE}/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop`, // earth
      `${UNSPLASH_BASE}/photo-1446776811953-b23d57bd21aa?w=1200&h=400&fit=crop`, // galaxy
      `${UNSPLASH_BASE}/photo-1516339901601-2e1b62dc0c45?w=1200&h=400&fit=crop`, // stars
      `${UNSPLASH_BASE}/photo-1444703686981-a3abbc4d4fe3?w=1200&h=400&fit=crop`, // milky way
      `${UNSPLASH_BASE}/photo-1506318137071-a8e063b4bec0?w=1200&h=400&fit=crop`, // aurora
      `${UNSPLASH_BASE}/photo-1419242902214-272b3f66ee7a?w=1200&h=400&fit=crop`, // night sky
      `${UNSPLASH_BASE}/photo-1534796636912-3b95b3ab5986?w=1200&h=400&fit=crop`, // cosmos
      `${UNSPLASH_BASE}/photo-1543722530-d2c3201371e7?w=1200&h=400&fit=crop`, // moon
      `${UNSPLASH_BASE}/photo-1507400492013-162706c8c05e?w=1200&h=400&fit=crop`, // saturn
      `${UNSPLASH_BASE}/photo-1465101162946-4377e57745c3?w=1200&h=400&fit=crop`, // deep space
      `${UNSPLASH_BASE}/photo-1502134249126-9f3755a50d78?w=1200&h=400&fit=crop`, // supernova
    ],
    accents: ["270 80% 65%", "240 70% 60%", "280 75% 55%", "260 65% 60%", "300 70% 55%", "220 80% 60%", "250 75% 50%", "290 70% 60%", "200 60% 55%", "270 65% 55%", "280 80% 60%", "260 75% 65%"],
    light: {
      background: "250 30% 96%",
      foreground: "250 20% 12%",
      card: "250 25% 98%",
      primary: "270 80% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "250 20% 90%",
      muted: "250 15% 92%",
      mutedForeground: "250 10% 50%",
      border: "250 15% 85%",
      accent: "270 60% 60%",
    },
    dark: {
      background: "250 30% 8%",
      foreground: "250 10% 92%",
      card: "250 25% 12%",
      primary: "270 80% 65%",
      primaryForeground: "0 0% 100%",
      secondary: "250 20% 18%",
      muted: "250 15% 16%",
      mutedForeground: "250 10% 55%",
      border: "250 15% 22%",
      accent: "270 60% 65%",
    },
  },
  {
    id: "nature",
    name: "Nature",
    emoji: "🌿",
    mood: "serene",
    images: [
      `${UNSPLASH_BASE}/photo-1418065460487-3e41a6c84dc5?w=1200&h=400&fit=crop`, // winter forest
      `${UNSPLASH_BASE}/photo-1457269449834-928af64c684d?w=1200&h=400&fit=crop`, // snowy mountains
      `${UNSPLASH_BASE}/photo-1490750967868-88aa4f44baee?w=1200&h=400&fit=crop`, // spring blossoms
      `${UNSPLASH_BASE}/photo-1462275646964-a0e3c11f18a6?w=1200&h=400&fit=crop`, // tulips
      `${UNSPLASH_BASE}/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop`, // green forest
      `${UNSPLASH_BASE}/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop`, // beach
      `${UNSPLASH_BASE}/photo-1472214103451-9374bd1c798e?w=1200&h=400&fit=crop`, // sunset meadow
      `${UNSPLASH_BASE}/photo-1501854140801-50d01698950b?w=1200&h=400&fit=crop`, // mountain lake
      `${UNSPLASH_BASE}/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop`, // autumn leaves
      `${UNSPLASH_BASE}/photo-1473448912268-2022ce9509d8?w=1200&h=400&fit=crop`, // fall forest
      `${UNSPLASH_BASE}/photo-1478827536114-da961b7f86d2?w=1200&h=400&fit=crop`, // misty woods
      `${UNSPLASH_BASE}/photo-1482192505345-5655af888cc4?w=1200&h=400&fit=crop`, // winter snow
    ],
    accents: ["145 50% 42%", "160 45% 40%", "340 60% 65%", "120 55% 45%", "140 60% 38%", "195 70% 50%", "35 80% 55%", "170 50% 40%", "25 75% 50%", "15 70% 50%", "180 40% 45%", "200 50% 55%"],
    light: {
      background: "140 25% 96%",
      foreground: "140 15% 12%",
      card: "140 20% 98%",
      primary: "145 55% 42%",
      primaryForeground: "0 0% 100%",
      secondary: "140 18% 90%",
      muted: "140 12% 92%",
      mutedForeground: "140 8% 48%",
      border: "140 12% 85%",
      accent: "145 45% 50%",
    },
    dark: {
      background: "140 25% 7%",
      foreground: "140 10% 92%",
      card: "140 20% 11%",
      primary: "145 55% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "140 18% 16%",
      muted: "140 12% 14%",
      mutedForeground: "140 8% 55%",
      border: "140 12% 20%",
      accent: "145 45% 55%",
    },
  },
  {
    id: "architecture",
    name: "Architecture",
    emoji: "🏛️",
    mood: "structured",
    images: [
      `${UNSPLASH_BASE}/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1431576901776-e539bd916ba2?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1488972685288-c3fd157d7c7a?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1486325212027-8081e485255e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1479839672679-a46483c0e7c8?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1511818966892-d7d671e672a2?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1494526585095-c41746248156?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1518005020951-eccb494ad742?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1470723710355-95304d8aece4?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1480714378408-67cf0d13bc1b?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1515263487990-61b07816b324?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1485628390555-1a7bd503f9fe?w=1200&h=400&fit=crop`,
    ],
    accents: ["220 15% 50%", "210 12% 45%", "200 18% 48%", "215 14% 52%", "225 16% 46%", "205 20% 50%", "230 12% 44%", "210 15% 48%", "220 18% 42%", "200 14% 50%", "215 12% 46%", "225 15% 48%"],
    light: {
      background: "220 15% 96%",
      foreground: "220 20% 12%",
      card: "220 12% 98%",
      primary: "220 20% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "220 10% 90%",
      muted: "220 8% 92%",
      mutedForeground: "220 8% 48%",
      border: "220 10% 84%",
      accent: "220 15% 45%",
    },
    dark: {
      background: "220 20% 8%",
      foreground: "220 8% 92%",
      card: "220 18% 12%",
      primary: "220 25% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "220 12% 18%",
      muted: "220 10% 15%",
      mutedForeground: "220 8% 55%",
      border: "220 10% 22%",
      accent: "220 20% 55%",
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    emoji: "◻️",
    mood: "calm",
    images: [
      `${UNSPLASH_BASE}/photo-1494438639946-1ebd1d20bf85?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1449247709967-d4461a6a6103?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1493397212122-2b85dda8106b?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1517483000871-1dbf64a6e1c6?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1531315630201-bb15abeb1653?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1490730141103-6cac27aaab94?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1508739773434-c26b3d09e071?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1477346611705-65d1883cee1e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1505765050516-f72dcac9c60e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1491002052546-bf38f186af56?w=1200&h=400&fit=crop`,
    ],
    accents: ["0 0% 40%", "0 0% 35%", "0 0% 45%", "0 0% 38%", "0 0% 42%", "0 0% 36%", "0 0% 44%", "0 0% 40%", "0 0% 38%", "0 0% 42%", "0 0% 35%", "0 0% 40%"],
    light: {
      background: "0 0% 97%",
      foreground: "0 0% 10%",
      card: "0 0% 100%",
      primary: "0 0% 15%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 93%",
      muted: "0 0% 95%",
      mutedForeground: "0 0% 45%",
      border: "0 0% 88%",
      accent: "0 0% 25%",
    },
    dark: {
      background: "0 0% 6%",
      foreground: "0 0% 92%",
      card: "0 0% 10%",
      primary: "0 0% 85%",
      primaryForeground: "0 0% 8%",
      secondary: "0 0% 16%",
      muted: "0 0% 14%",
      mutedForeground: "0 0% 55%",
      border: "0 0% 20%",
      accent: "0 0% 75%",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    mood: "flowing",
    images: [
      `${UNSPLASH_BASE}/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1505118380757-91f5f5632de0?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1439405326854-014607f694d7?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1468413253725-0d5181091126?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1471922694854-ff1b63b20054?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1484291470158-b8f8d608850d?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1519046904884-53103b34b206?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1504681869696-d977211a5f4c?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1494783367193-149034c05e8f?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1437622368342-7a3d73a34c8f?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1510414842594-a61c69b5ae57?w=1200&h=400&fit=crop`,
    ],
    accents: ["195 80% 50%", "200 75% 48%", "190 70% 52%", "205 78% 46%", "185 72% 50%", "200 80% 54%", "195 75% 48%", "210 70% 50%", "188 76% 46%", "200 72% 52%", "195 78% 48%", "205 75% 50%"],
    light: {
      background: "195 30% 96%",
      foreground: "200 20% 12%",
      card: "195 25% 98%",
      primary: "200 80% 48%",
      primaryForeground: "0 0% 100%",
      secondary: "195 20% 90%",
      muted: "195 15% 92%",
      mutedForeground: "200 10% 48%",
      border: "195 15% 85%",
      accent: "200 65% 55%",
    },
    dark: {
      background: "200 30% 7%",
      foreground: "195 10% 92%",
      card: "200 25% 11%",
      primary: "200 80% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "200 20% 16%",
      muted: "200 15% 14%",
      mutedForeground: "200 10% 55%",
      border: "200 15% 20%",
      accent: "200 65% 60%",
    },
  },
  {
    id: "retro",
    name: "Retro",
    emoji: "📻",
    mood: "nostalgic",
    images: [
      `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1525909002-1b05e0c869d8?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1528459801416-a9e53bbf4e17?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1496715976403-7e36dc43f17b?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1496293455970-f8581aae0e3b?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1531297484001-80022131f5a1?w=1200&h=400&fit=crop`,
      `${UNSPLASH_BASE}/photo-1516450360452-9312f5e86fc7?w=1200&h=400&fit=crop`,
    ],
    accents: ["35 85% 55%", "15 75% 50%", "45 80% 52%", "350 65% 55%", "30 78% 50%", "55 72% 48%", "20 80% 52%", "40 75% 50%", "10 70% 55%", "25 82% 48%", "50 68% 52%", "35 78% 50%"],
    light: {
      background: "35 30% 95%",
      foreground: "25 20% 15%",
      card: "35 25% 97%",
      primary: "16 75% 48%",
      primaryForeground: "35 30% 98%",
      secondary: "35 20% 88%",
      muted: "35 15% 90%",
      mutedForeground: "25 10% 48%",
      border: "35 15% 82%",
      accent: "35 65% 52%",
    },
    dark: {
      background: "25 25% 8%",
      foreground: "35 15% 90%",
      card: "25 20% 12%",
      primary: "35 80% 55%",
      primaryForeground: "25 25% 8%",
      secondary: "25 18% 18%",
      muted: "25 12% 15%",
      mutedForeground: "35 10% 55%",
      border: "25 12% 22%",
      accent: "35 65% 58%",
    },
  },
];

export function getThemeById(id: string): CalendarTheme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function getMonthImage(theme: CalendarTheme, month: number): string {
  return theme.images[month] || theme.images[0];
}

export function getMonthAccent(theme: CalendarTheme, month: number): string {
  return theme.accents[month] || theme.accents[0];
}
