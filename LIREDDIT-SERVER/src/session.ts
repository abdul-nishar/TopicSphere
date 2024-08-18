import session from "express-session";

// Define a custom interface extending express-session's SessionData
interface MySession extends session.Session {
  // Add other custom properties as needed
  userId?: Number;
}

// Extend the default Request interface to include the session object
declare module "express" {
  export interface Request {
    session: MySession;
  }
}
