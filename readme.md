[Tunnel into ngrok](https://api.slack.com/tutorials/tunneling-with-ngrok)

`ngrok http 4390`

Dockerize

`docker build -t <your username>/slack-flightcheck .`

`docker run -p 4390:4390 -d <your username>/slack-flightcheck`

[Lint](https://eslint.org/docs/user-guide/getting-started)

Linting

`npx eslint *.js`

Load Keys from configuration file

`source config.sh`

Auto-load changes with nodemon

`npx nodem`

Slack Slash Commands

`https://api.slack.com/apps/AHB2H4ABX/slash-commands?saved=1`