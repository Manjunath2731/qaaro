import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Define validation rules
export const loginValidationRules = () => {
  return [
    check('identifier')
      .notEmpty()
      .withMessage('Identifier (email or mobile) is required')
      .custom(value => {
        const emailRegexPattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const mobileRegexPattern: RegExp = /^[0-9]{10,15}$/; // Adjust mobile regex pattern as needed

        if (!emailRegexPattern.test(value) && !mobileRegexPattern.test(value)) {
          throw new Error('Identifier must be a valid email or mobile number');
        }
        return true;
      }),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ];
};

// Middleware to handle validation result
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
