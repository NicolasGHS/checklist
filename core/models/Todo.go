package models

import "time"

type Todo struct {
	ID          uint      `bson:"_id"`
	Name        string    `bson:"name"`
	Description string    `bson:"description"`
	Completed   bool      `bson:"completed"`
	CreatedAt   time.Time `bson:"created"`
	UpdatedAt   time.Time `bson:"created"`
}
