require('dotenv').config()
export const keycloak = {
    client_id: "dbay",
    client_secret: 'NOHxfhlSPjj8G4bC6gUcxAdyzq5i1q7u',
    redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
    post_logout_redirect_uris: [""],
    response_types: ["code"],
  }