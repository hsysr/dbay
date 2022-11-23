require('dotenv').config()
export const keycloak = {
    client_id: "dbay",
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
    post_logout_redirect_uris: [""],
    response_types: ["code"],
  }