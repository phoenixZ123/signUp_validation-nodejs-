import { DevVariable } from "./environment.dev";
import { ProdVariable } from "./environment.prod";

export interface Environment {
  db_uri: string;
  gmail_auth?: {
    user: string;
    pass: string;
  };
  jwt_secret_key: string;
  sendgrid: {
    api_key: string;
    email_from: string;
  };
}

export function getEnvironmentVariables() {
  if (process.env.NODE_ENV === "production") {
    return ProdVariable;
  } else {
    return DevVariable;
  }
}
