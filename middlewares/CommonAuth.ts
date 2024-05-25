// add some code in order to enable the user inside the request interface of express

import { NextFunction, Request, Response } from 'express';
import { AuthPayload } from '../dto';
import { validateJWT } from '../utils';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await validateJWT(req);

  if (validate) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
