import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createLamiValidationRules = () => {
  return [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('zipcode').isPostalCode('any').withMessage('Enter a valid zipcode'),
  ];
};

export const validateLamiUser = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
