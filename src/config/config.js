class Config {
  constructor() {
    this.APP_NAME = import.meta.env.VITE_APP_NAME;
    this.GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL;
  }
}

export const config = new Config();
