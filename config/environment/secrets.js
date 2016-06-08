var secrets = {
  database: {},
  jwt: {},
  mandrill:{},
  logentries: {}
};

secrets.database.host = process.env.DB_HOST;
secrets.database.port = process.env.DB_PORT;
secrets.database.name = process.env.DB_NAME;
secrets.database.username = process.env.DB_USER;
secrets.database.password = process.env.DB_PASSWORD;
secrets.database.ssl = process.env.DB_SSL === 'true';

secrets.jwt.secret = process.env.JWT_SECRET;
secrets.jwt.clientId = process.env.JWT_AUDIENCE; //in Auth0 this is your ClientID
secrets.jwt.domain = process.env.JWT_DOMAIN;
secrets.jwt.auth0ApiToken = process.env.AUTH0_API_V2_TOKEN;

secrets.mandrill.apiKey = process.env.MANDRILL_API_KEY;

secrets.logentries.token = process.env.LOGENTRIES_TOKEN;
secrets.logentries.level = process.env.LOGENTRIES_LEVEL;

export default secrets;
