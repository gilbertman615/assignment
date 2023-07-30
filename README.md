## Running the app

```bash
# With docker (recommended, ensure port 3000 and 5432 are free before spinning up)
$ docker compose up --force-recreate --build

# Without docker (need to spin up the database in your local, and copy the table migration script from db/init.sql in that project)
$ npm run start
```
<br><br>
## Design and assumption
- User api are secured by jwt authentication
- db table is being done in a init.sql when the db is spin up in the docker, but in production the migration script should be done by migration library such as knex or flyway with a schema version history which support schema update
- secret key (which should not) stored in the code base for easier configuration
- User email will be a login name, which is unique and able to change in the PUT api
- User'name is assumed the name of user, that's why didnt deem it as a login credential
- Return dto does not show the password for security reason
<br><br>

<br><br>
## How to test
1. Visit http://localhost:3000/api
2. In swagger, there is a login controller (http://localhost:3000/api#/Auth/AuthController_login), please put the following credentials to login before calling any User Api (or your may want to calling some user api first to test there are access control on those api)
    - username: admin@testing.com
    - password: testing
3. After calling the login controller api, it will return a json response with property `access_token`, please copy the value which is the jwt token
4. In the right top corner of swagger page, there is a button called `Authorized`, please click on that and paste the copied jwt token and submit
5. User Api is ready to use now!
6. You may want to create the user and then logout by clicking the `Authorized` button.
7. Make some call to the user api, which should return Unauthorized
8. login again with the new user credential you just created, and the user api should be able to call.
<br><br>

<br><br>
## Unit Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
