package db

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type Settings struct {
	SyncFolder string `json:"syncFolder"`
}

func settingsPath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	dir := filepath.Join(configDir, "Checklist")
	os.MkdirAll(dir, os.ModePerm)
	return filepath.Join(dir, "settings.json"), nil
}

func LoadSettings() Settings {
	path, err := settingsPath()
	if err != nil {
		return Settings{}
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return Settings{}
	}
	var s Settings
	json.Unmarshal(data, &s)
	return s
}

func SaveSettings(s Settings) error {
	path, err := settingsPath()
	if err != nil {
		return err
	}
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}
