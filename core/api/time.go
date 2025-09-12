package api

import "time"

func GetNextSevenDays() []time.Time {
	now := time.Now()
	var days []time.Time
	loc := now.Location()

	for i := 1; i <= 7; i++ {
		d := now.AddDate(0, 0, i)
		d = time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, loc)
		days = append(days, d)
	}

	return days
}
