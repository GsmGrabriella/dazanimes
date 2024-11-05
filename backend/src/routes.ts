// importação de dependências
import { Router } from "express"; // dependência para cadastrar as rotas
import { UserRoutes } from "./routes/users"; // importação das rotas de usuários
import { AuthRoutes } from "./routes/auth"; // importação das rotas de autenticação
import { PostRoutes } from "./routes/posts"; // importação das rotas de autenticação

// criação das rotas
const routes = Router();

// rota raiz ( Olá Mundo )
routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
})

// utiliza as rotas
routes.use('/users', UserRoutes()); // utiliza as rotas de usuários
routes.use('/auth', AuthRoutes()); // utiliza as rotas de autenticação
routes.use('/posts', PostRoutes()); // utiliza as rotas de autenticação

export default routes; // exporta as rotas