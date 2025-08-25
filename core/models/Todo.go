package models

import "time"

type Todo struct {
	ID          int32     `bson:"_id"`
	Name        string    `bson:"name"`
	Description string    `bson:"description"`
	CreatedAt   time.Time `bson:"created"`
	UpdatedAt   time.Time `bson:"created"`
}
