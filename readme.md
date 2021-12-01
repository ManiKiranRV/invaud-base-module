# DHL project

## Table of content

- [DHL project](#dhl-project)
  - [Table of content](#table-of-content)
  - [Initial setup](#initial-setup)
    - [Install package managers](#install-package-managers)
    - [Install docker desktop](#install-docker-desktop)
    - [Environmental variables](#environmental-variables)
    - [Download/build packages](#downloadbuild-packages)
    - [Build/compile typescript](#buildcompile-typescript)
    - [Run application](#run-application)
    - [Database Migration](#database-migration)
    - [mock-bless](#mock-bless)
  - [User initialisation with super admin](#user-initialisation-with-super-admin)
    - [IMPORTANT SECURITY NOTE](#important-security-note)
    - [Steps](#steps)
    - [Additional notes](#additional-notes)
    - [Test application](#test-application)
  - [Services](#services)
    - [invaud-backend](#invaud-backend)
    - [invaud-ui](#invaud-ui)
    - [Databases](#databases)
      - [MariaDB](#mariadb)
      - [Prisma](#prisma)

## Initial setup

### Install package managers

```sh
brew upgrade
brew install nvm
nvm install node
nvm install nest
npm install --global yarn
```

### Install docker desktop

<https://www.docker.com/products/docker-desktop>

### Environmental variables

Create a .env file (in src directory) with:

```
MARIADB_VERSION=10.5
MYSQL_ROOT_PASSWORD=Pas5word
MYSQL_DATABASE="invoice_view"
MYSQL_USER="mila"
MYSQL_PASSWORD="Pas5word"

INVAUD_SHIPPER_DATABASE_URL="mysql://root:Pas5word@invaud_database_shipper:3306/invoice_view"
INVAUD_FORWARDER_DATABASE_URL="mysql://root:Pas5word@invaud_database_forwarder:3306/invoice_view"

KAFKA_BROKERS="kafka1:9092"
KAFKA_TOPIC="invaud-topic"
KAFKA_FORWARDER_GROUP_ID="forwarder-group"
KAFKA_SHIPPER_GROUP_ID="shipper-group"

SUPERADMIN_EMAIL="super@admin.com"
# MAKE SURE TO USE SINGLE QUOTES (') AROUND THE SUPERADMIN_HASHED_PASSWORD. OTHERWISE THE '$' IS NOT ESCAPED
SUPERADMIN_HASHED_PASSWORD='$2a$10$4QnRWQE.0zPVrLk6Ub3uY.9Pabgifu2czeRSbaK8CK2zK.kqjPSmy' #Helloworld1!Helloworld1!
```

### Download/build packages

To install dependencies run the following command in the ``src`` directory:

```sh
yarn
```

### Build/compile typescript

To to build typescript run the following command in both the ``src/invaud-backend`` and ``src/core`` directory: 

```sh
tsc -b -f
```

### Run application
Run the following command in the ``src/invaud-backend`` directory:
   ```sh
   yarn prisma:generate
   ```
In the ``/src`` directory run:
```sh
docker compose -f docker-compose.development.yml down
docker compose -f docker-compose.development.yml up --build
```
to run the development application. This is currently the only setup with a separate instance for the shipper and forwarder.

### Database Migration

To run the database migration run the following commands from the ```src/invaud-backend``` directory.

```shell
yarn prisma:generate
```
While the application is running (after docker compose up), run the following command to migrate the database of both the shipper and forwarder instance:

```shell
yarn prisma:migrate-dev
```

### mock-bless
The mock bless has an endpoint
```
localhost:5050/postShipmentData
```
which can be used to get the shipment data onto the relevant Kafka topic. The endpoint expects a ```POST``` call with in the request body, the payload ```shipments-required (no comments).json``` which can be found in the ```documentation/payloads``` folder. The mock-bless will publish the request data via a Kafka event.


## User initialisation with super admin
The invaud-backend creates a super admin user in the database on initial deployment. The username (email) and password are set in the .env (SUPERADMIN_EMAIL and SUPERADMIN_HASHED_PASSWORD respectively). This user can be used to add the first admin user to system. Note: the password is hashed using bcrypt set with 10 rounds. You can therefore set your own default password to your needs. However, the system requires you to change the password on the first login.

### IMPORTANT SECURITY NOTE
Note that this approach introduces a security risk of having such a powerful account on production that cannot be deleted or locked. The account in theory does have unlimited login attempts. It's the responsibility of the system user to store the password of this account in a secure matter to prevent unauthorized access.

### Steps
1. Deploy the application.
2. Login with the email and (unhashed) password of the super admin set in the .env.
3. Change the password of the super admin using the password reset page shown on screen. The password needs to be changed from the one set in the .env before you can add an admin to the database.
4. Navigate to the User Management tab.
5. Add the first admin to the application.
6. Use the application as intended.

### Additional notes
- Make sure the SUPERADMIN_HASHED_PASSWORD variable is put between single quotes ('). Otherwise the '$' is not escaped and the password is incorrectly put in the database. Login will then fail.
- The super admin can ONLY create new admin users. It cannot view or edit any other data in the system.
- The account cannot be deleted
- The account cannot be locked after too many wrong login attempts.
- The account is created on the first system deploy (when it is not in database already)
- If the system reboots when there is already a super admin account in the database, the password of this account is not overwritten by the default password in the .env
- If the password of the super admin account is lost by the system user. The way to reset this account is to manually drop the super admin user from the database and then redeploy the application. A new super admin account is then created with the hashed default password in the .env and the above mentioned steps can then be followed again.

### Test application
Run the following command to run all the tests:

```sh
yarn test
```
To run tests in watch mode (test executes on file change):
```sh
yarn test:watch
```

---

## Services

### invaud-backend

This service contains the logic surrounding the Invoice & Audit Backend Application.

Swagger API documentation is available at <http://localhost:{port}/api/>.

The UI ports are 8080 and 8081 for the shipper and forwarder respectively.
 
### invaud-ui

This service contains the logic surrounding the Invoice & Audit FrontEnd Application.

### Databases

We have the following database setup:

- MariaDB (View database)

#### MariaDB

This project has MariaDB as database for development. MariaDB uses the MySQL syntax and is 
a forked version of the original MySQL. We use docker compose to spin up a MariaDB image.

#### Prisma

Prisma is an open source next-generation ORM. It consists of the following parts:

- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: Migration system
- Prisma Studio: GUI to view and edit data in your database

Prisma Client can be used in any Node.js (supported versions) or TypeScript backend application (including serverless applications and microservices). This can be a REST API, a GraphQL API, a gRPC API, or anything else that needs a database.

