package models

import "time"

type Todo struct {
	ID          uint       `bson:"_id"`
	Name        string     `bson:"name"`
	Description string     `bson:"description"`
	Completed   bool       `bson:"completed"`
	ListID      uint       `bson:"list_id"`
	Today       bool       `bson:"today"`
	Deadline    *time.Time `bson:"deadline"` // pointer to make deadline optional
	CreatedAt   time.Time  `bson:"created"`
	UpdatedAt   time.Time  `bson:"created"`
}
