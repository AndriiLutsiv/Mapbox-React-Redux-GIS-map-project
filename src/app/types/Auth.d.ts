declare module Auth {

  interface Context {
    token: string | null;
    setToken: (token: string | null) => void;
  }
 
  interface Token {
    access_token: string;
    token_type: string;
  }
}
