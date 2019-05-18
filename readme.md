[Tunnel into ngrok](https://api.slack.com/tutorials/tunneling-with-ngrok)

`ngrok http 4390`

Dockerize

`docker build -t <your username>/slack-flightaware .`

`docker run -p 4390:4390 -d <your username>/slack-flightaware`

[Lint](https://eslint.org/docs/user-guide/getting-started)

Linting

`npx eslint *.js`

Load Keys from configuration file

`source config.sh`