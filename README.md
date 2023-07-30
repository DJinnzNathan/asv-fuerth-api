# Club API

This is the microservice (mainly for ASV Fürth) that provides recent information from different sources to present it on the new homepage.

## Setup

### Environment

| Variable name                | Variable type | Description                           |
| ---------------------------- | ------------- | ------------------------------------- |
| CLUB_NAME                    | String        | The club name for checking            |
| BFV_TEAM_URL                 | String        | URL of the team overview on BFV       |
| KICKER_FIRST_TEAM_SHORTNAME  | String        | URL-slug for the team on kicker.de    |
| KICKER_FIRST_TEAM_TOKEN      | String        | Token for the widget API on kicker.de |
| KICKER_SECOND_TEAM_SHORTNAME | String        | URL-slug for the team on kicker.de    |
| KICKER_SECOND_TEAM_TOKEN     | String        | Token for the widget API on kicker.de |
| OPENWEATHER_LON              | String        | OpenWeatherApi Longitude              |
| OPENWEATHER_LAT              | String        | OpenWeatherApi Latitude               |
| OPENWEATHER_API              | String        | OpenWeatherApi AppID                  |
