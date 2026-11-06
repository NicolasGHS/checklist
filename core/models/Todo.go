package models

import "time"

type Todo struct {
	ID          uint       `bson:"_id"`
	Name        string     `bson:"name"`
	Description string     `bson:"description"`
	Completed   bool       `bson:"completed"`
	ListID      uint       `bson:"list_id"`
	ParentID    *uint      `bson:"parent_id"`
	Today       bool       `bson:"today"`
	Deadline    *time.Time `bson:"deadline"` // pointer to make deadline optional
	Archive     bool       `bson:"archive"`  // Someday
	// Manual sort order within the task's list; 0 = not placed yet (sorts last).
	Position int `bson:"position"`
	// Manual sort order on the Today page, independent of the list order.
	TodayPosition int `bson:"today_position"`
	CompletedAt time.Time  `bson:"completed_at"`
	CreatedAt   time.Time  `bson:"created"`
	UpdatedAt   time.Time  `bson:"created"`
}
