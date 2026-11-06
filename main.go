package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:client/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	opts := application.Options{
		Name:        "Checklist",
		Description: "A Things 3 inspired task manager",
		Icon:        icon,
		Services: []application.Service{
			application.NewService(NewApp()),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
		IOS: application.IOSOptions{
			DisableBounce:             true,
			DisableInputAccessoryView: true,
			DisableLinkPreview:        true,
		},
	}

	app := application.New(opts)

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "Checklist",
		Width:            1024,
		Height:           768,
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/",
	})

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
