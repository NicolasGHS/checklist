package models

import "time"

type List struct {
	ID        int32     `bson:"_id"`
	Name      string    `bson:"name"`
	Slug      string    `bson:"slug"`
	CreatedAt time.Time `bson:"created"`
	UpdatedAt time.Time `bson:"created"`
}
