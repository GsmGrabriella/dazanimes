import { Router } from "express";
import { userRoutes } from "./routes/users";
import { AuthRoutes } from "./routes/auth";

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
})

routes.use('/users', userRoutes());
routes.use('/auth', AuthRoutes());

export default routes;