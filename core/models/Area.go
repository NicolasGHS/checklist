package models

import "time"

type Area struct {
	ID        int32     `bson:"_id"`
	Name      string    `bson:"name"`
	ListID    uint      `bson:"list_id"`
	CreatedAt time.Time `bson:"created"`
	UpdatedAt time.Time `bson:"created"`
}
