import { useEffect, useState } from "react";
import { GetNextSevenDays } from "../../wailsjs/go/main/App";
import { formatDateStrings } from "@/utils/dates";
import { Day } from "@/components/Day";

const Upcoming = () => {
  const [days, setDays] = useState<Date[]>();
  const [weekdays, setWeekdays] = useState<[string, string][]>();

  const getNextDays = async () => {
    const result = await GetNextSevenDays();
    const dates = result.map((t: any) => new Date(t));
    const days = formatDateStrings(dates);
    setDays(dates);
    setWeekdays(days);
  };

  useEffect(() => {
    getNextDays();
  }, []);

  return (
    <div className="mt-10 flex flex-col h-full relative">
      <h1 className="text-3xl text-foreground font-bold mb-6">Upcoming</h1>
      {weekdays?.map((day, index) => (
        <Day dayNumber={day[0]} weekday={day[1]} key={index} />
      ))}
    </div>
  );
};

export default Upcoming;
