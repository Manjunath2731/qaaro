import express from 'express';
import { mobilelogin } from '../controllers/mobile/mobile.controller';

const mobile = express.Router();

mobile.post('/login', mobilelogin);

export default mobile;