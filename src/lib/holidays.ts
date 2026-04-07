export interface Holiday {
  name: string;
  emoji: string;
  type: "global" | "indian" | "us";
}

// Key format: "MM-DD" for fixed holidays
const FIXED_HOLIDAYS: Record<string, Holiday> = {
  // Global
  "01-01": { name: "New Year's Day", emoji: "🎆", type: "global" },
  "02-14": { name: "Valentine's Day", emoji: "❤️", type: "global" },
  "03-08": { name: "Women's Day", emoji: "🌸", type: "global" },
  "04-22": { name: "Earth Day", emoji: "🌍", type: "global" },
  "05-01": { name: "Labour Day", emoji: "✊", type: "global" },
  "06-05": { name: "Environment Day", emoji: "🌱", type: "global" },
  "10-31": { name: "Halloween", emoji: "🎃", type: "global" },
  "12-25": { name: "Christmas", emoji: "🎄", type: "global" },
  "12-31": { name: "New Year's Eve", emoji: "🥂", type: "global" },

  // US
  "07-04": { name: "Independence Day", emoji: "🇺🇸", type: "us" },
  "11-11": { name: "Veterans Day", emoji: "🎖️", type: "us" },

  // Indian
  "01-26": { name: "Republic Day", emoji: "🇮🇳", type: "indian" },
  "03-25": { name: "Holi", emoji: "🎨", type: "indian" },
  "04-14": { name: "Baisakhi", emoji: "🌾", type: "indian" },
  "08-15": { name: "Independence Day", emoji: "🇮🇳", type: "indian" },
  "10-02": { name: "Gandhi Jayanti", emoji: "🕊️", type: "indian" },
  "10-12": { name: "Dussehra", emoji: "🏹", type: "indian" },
  "10-24": { name: "Karwa Chauth", emoji: "🌙", type: "indian" },
  "11-01": { name: "Diwali", emoji: "🪔", type: "indian" },
  "11-15": { name: "Guru Nanak Jayanti", emoji: "🙏", type: "indian" },
  "01-14": { name: "Makar Sankranti", emoji: "🪁", type: "indian" },
  "08-26": { name: "Janmashtami", emoji: "🦚", type: "indian" },
  "09-07": { name: "Ganesh Chaturthi", emoji: "🐘", type: "indian" },
  "03-30": { name: "Eid ul-Fitr", emoji: "☪️", type: "indian" },
  "04-10": { name: "Ram Navami", emoji: "🏛️", type: "indian" },
};

// Get holiday for a specific date
export function getHoliday(date: Date): Holiday | undefined {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return FIXED_HOLIDAYS[`${month}-${day}`];
}

// Get all holidays for a month
export function getHolidaysForMonth(month: number): { day: number; holiday: Holiday }[] {
  const monthStr = String(month + 1).padStart(2, "0");
  const result: { day: number; holiday: Holiday }[] = [];
  for (const [key, holiday] of Object.entries(FIXED_HOLIDAYS)) {
    if (key.startsWith(monthStr)) {
      const day = parseInt(key.split("-")[1], 10);
      result.push({ day, holiday });
    }
  }
  return result;
}
