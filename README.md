# Salary Hero Backend API project

## Prerequisite:

    - node version 18.x
    - npm

## LOCAL ENV SETUP

- Create environment file in your local machine: `cp .env.example .env`
- Ensure no missing env variables setting in `.env` file

### Using Docker to setup shc db

- Change `DATABASE_USERNAME` and `DATABASE_PASSWORD` in `.env` file
- Run `docker compose up shc-postgres -d` to start and create container
- Using pgAdmin to connect to postgres server
  - Host name/address: localhost
  - Port 5433
  - Username as DATABASE_USERNAME
  - Password as DATABASE_PASSWORD
- Run `docker compose down` to stop and remove container

### Using Docker to setup shc backend api

- Run `docker compose build --no-cache && docker compose up shc-api -d` to start and create container
- Run `docker compose down` to stop and remove container
- Access to the `shc-api` docker container:  `docker exec -it shc-api /bin/sh`

### Migrating & seeding data schemas (tables)

- Access to the `shc-api` docker container:  `docker exec -it shc-api /bin/sh`
- Access to migration dir: `cd dist`
- Run migration script: `../node_modules/typeorm/cli.js migration:run  -d database/config-migration.js`
- Run seeding script: `../node_modules/typeorm/cli.js migration:run  -d database/config-seed.js`

## Quick Development Installation

```bash
$ yarn install
```

## Build

```bash
$ yarn build
```

## Migrate database

```bash
$ yarn migration:run
```

## Seed data

```bash
$ yarn seed:run
```

Note: you have to run build before seed data

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Verify your setup

```bash
$ curl --location --request GET 'http://localhost:3000/api/v1/ping'
```

if response `pong` means it is ok

## run lint

```bash
$ yarn lint
```

## run prettier

```bash
$ yarn format
```

## run integration test

```bash
$ yarn e2e-test
```

`</p>`
