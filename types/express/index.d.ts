/*
// NONE OF THESE WORKED
declare namespace Express {
  interface Request {
    ctx: any
  }
}

interface RequestContext {
  user?: any
}

declare namespace Express {
  interface Request {
    ctx: any
  }
}

declare global {
  namespace Express {
    interface Request {
      context: any
    }
  }
}

declare global {
  declare module 'express-serve-static-core' {
    interface Request {
      ctx: any
    }
    interface Response {}
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    ctx: any
  }
  interface Response {}
}
*/
