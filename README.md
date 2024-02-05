<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
>in the project root ( assuming youh ave docker in your environment )

```bash
docker compose up 
```

## Running the app
>make sure that you have docker installed in order to spin op all the services. 
Each service should have it's .env.sample file that you need to convert into .env files.  Add the ports that you want each service to have. 
Note: 
auth, roles, permissions each have tcp ports for internal communication, since roles, and permissions supply proper authorizatino, and auth supplies authentication.
--

## ENV FILES
Every service has it's own .env.example file that contains the env keys that are needed in the current version. Run the following command on all the ENVs to turn them into .env files
```bash
mv .env.example .env
```

```bash
docker compose up
```
--
By watchinng the logs in attached mode, you can see if there are any exceptions along the way.

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
