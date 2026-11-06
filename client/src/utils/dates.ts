export const formatDateYMD = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // local calendar date: deadlines are stored in UTC, so the UTC date can be
  // a day off from the date the user picked
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Deadlines are the last instant of the chosen local day, sent as RFC3339.
export const endOfDayISO = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  ).toISOString();

// Whole local calendar days from today until the deadline (negative = overdue).
export const daysUntil = (deadline: string | Date) => {
  const due = new Date(deadline);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
};

export const formatDateStrings = (dates: Date[]): [string, string][] => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  return dates.map((date, index) => {
    const day = date.getDate();
    const weekday = index === 0 ? "Tomorrow" : weekdays[date.getDay()];

    return [day.toString(), weekday]; 
  });
}

