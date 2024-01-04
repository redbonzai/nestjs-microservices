<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## ENV FILES
Every service has it's own .env.example file that contains the env keys that are needed in the current version. Run the following command on all the ENVs to turn them into .env files
```bash
mv .env.example .env
```

## Setting Up MongoDB For Local Development (MAC OS & Linux)
>See this DOC FILE for more info FIRST: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
Enter the following commands in the terminal: 
```bash
brew tap mongodb/brew
brew update
brew install mongodb-community
```
#### NOTE: 
the mongod.conf file may have different locations depending on your OS. 
#### MAC OS INTEL PROCESSOR:
conf file location: /usr/local/etc/mongod.conf
log directory location: /usr/local/var/log/mongodb
data directory location: /usr/local/var/mongodb

#### MAC OS SILICON PROCESSOR:
conf file location: /opt/homebrew/etc/mongod.conf
log directory location: /opt/homebrew/var/log/mongodb
data directory location: /opt/homebrew/var/mongodb

#### WHEN YOU HAVE INSTALLED MONGODB: 
Create the following bash method in your .bash_profile file: 
```bash
function mongo() {
  if [ $# -eq 0 ]; then
      echo "Opening MongoDB Service Client ..."
      brew services start mongodb-community

      echo  "Verifying that MongoDB has started successfully ... "
      ps aux | grep -v grep | grep mongod
  fi
  if [ "$1" = "--restart" ]; then
    echo "Restarting the mongodb service ..."
    brew services restart mongodb-services
  fi  
  if [ "$1" = "--stop" ]; then
    echo "Stopping MongoDB Service ..."
    brew services stop mongodb-community
  fi  
}
```
> open your conf file with nano, vim, or code,
```bash
systemLog:
  destination: file
  path: /usr/local/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /usr/local/var/mongodb
net:
  bindIp: 127.0.0.1, ::1
  ipv6: true
```

#### TELL MONGOD WHERE TO STORE DATA:
Note the location of the log file and associate it with the mongod executable.
```bash
mongod --dbpath /usr/local/var/mongodb
```

#### connect mongo shell ( MONGOSH ) to your local MongoDB instance:
```bash
mongosh "mongodb://127.0.0.1:12027/database_name"
```
#### KEEP MongoDB and MONGOSH updated:
```bash
brew update
brew upgrade mongodb-community
brew upgrade mongosh
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
