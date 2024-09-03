import { Router } from 'express';
import { login } from '../controllers/AuthController';

export function AuthRoutes() {
  const router = Router();

  router.get('/', (req, res) => {
    return res.json({ message: 'Hello Auth' });
  });

  router.post('/login', login);

  return router;
}