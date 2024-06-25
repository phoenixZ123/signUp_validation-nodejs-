import { Environment } from "./environment";

export const ProdVariable: Environment = {
  db_uri:
    "mongodb+srv://willaustin:willaustin@testnodejs.cvcyxuo.mongodb.net/?retryWrites=true&w=majority&appName=TestNodejs",
  jwt_secret_key: "secret_key_production",
  sendgrid: {
    api_key: "",
    email_from: "",
  },
  gmail_auth: {
    user: "",
    pass: "",
  },
};
