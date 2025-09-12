export const formatDateYMD = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateStrings = (dates: Date[]): [string, string][] => {
  console.log("dates in formatDateStrings: ", dates);
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  return dates.map((date, index) => {
    const day = date.getDate();
    const weekday = index === 0 ? "Tomorrow" : weekdays[date.getDay()];

    return [day.toString(), weekday]; 
  });
}

