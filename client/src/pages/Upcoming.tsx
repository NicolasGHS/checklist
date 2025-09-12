import { useEffect, useState } from "react";
import { GetNextSevenDays } from "../../wailsjs/go/main/App";

const Upcoming = () => {
  const [days, setDays] = useState<Date[]>();

  const getNextDays = async () => {
    const result = await GetNextSevenDays();
    const dates = result.map((t: any) => new Date(t));
    setDays(dates);
  };

  useEffect(() => {
    getNextDays();
  }, []);

  return (
    <div>
      {days?.map((day) => (
        <p>{day.toLocaleDateString()}</p>
      ))}
    </div>
  );
};

export default Upcoming;
