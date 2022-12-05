# DBay

# Setup dev environment
1. From another directory, run `git clone https://github.com/keycloak/keycloak-containers`, then `cd` into `keycloak-containers/server`. Run `docker build -t keycloak18 .`
2. Create a `.env` file at the root of this git repo. Fill in `KEYCLOAK_USER=<keycloak-username>`, newline, `KEYCLOAK_PASSWORD=<keycloak-password>` to setup admin credentials of keycloak service.
3. Open another terminal at the root of this repo and run `docker compose --env-file .env up`. You may need root privilege to do this.
4. Wait until keycloak container is up and running. Visit [127.0.0.1:8081](127.0.0.1:8081) to login with your previously set credentials.
5. Inside keycloak, create a realm called `Dbay`. Set `Name` to `dbay` in `Dbay->realm settings->general`. Make sure you turn on `enabled`. Then in `Dbay->realm settings->Login`, turn on `User registration`.
6. Inside keycloak and within the `Dbay` realm, create a new client called `dbay`. Set the `Client ID` to `dbay`, turn on `Enabled`, set `Access Type` to `confidential`, and add `http://127.0.0.1/api/login-callback` to `Valid Redirect URIs`.
7. Now you can access the frontend at `127.0.0.1:8080`
