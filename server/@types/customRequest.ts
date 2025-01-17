import { Request } from 'express';

export interface CustomRequest extends Request {
  proxyHeaders?: {
    authorization?: string;
  };
}
