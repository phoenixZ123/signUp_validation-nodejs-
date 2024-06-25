import { Environment } from "./environment";

export const DevVariable: Environment = {
  db_uri:
    "mongodb+srv://willaustin:willaustin@testnodejs.cvcyxuo.mongodb.net/?retryWrites=true&w=majority&appName=TestNodejs",
  sendgrid: {
    api_key: "",
    email_from: "",
  },
  jwt_secret_key: "secret_key",
  gmail_auth: {
    user: "phuephue1125@gmailc.com",
    pass: "112523",
  },
};
