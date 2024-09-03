import { Router } from 'express';
import { createUser } from '../controllers/UserController';

export function userRoutes() {
  const router = Router();

  router.get('/', (req, res) => {
    return res.json({ message: 'Hello User' });
  });

  router.post('/create', createUser);

  return router;
}