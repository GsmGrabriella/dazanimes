// importação de dependências
import { Router } from "express"; // dependência para cadastrar as rotas
import { userRoutes } from "./routes/users"; // importação das rotas de usuários
import { AuthRoutes } from "./routes/auth"; // importação das rotas de autenticação

// criação das rotas
const routes = Router();

// rota raiz ( Olá Mundo )
routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
})

// utiliza as rotas
routes.use('/users', userRoutes()); // utiliza as rotas de usuários
routes.use('/auth', AuthRoutes()); // utiliza as rotas de autenticação

export default routes; // exporta as rotas