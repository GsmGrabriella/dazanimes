// importação de dependências
import { Router } from 'express'; // dependência para cadastrar as rotas
import { createUser } from '../controllers/UserController'; // importação da função createUser do controlador de usuários

// criação das rotas de usuários
export function userRoutes() {
  const router = Router(); // instância do Router

  // rota raiz ( Olá Usuário )
  router.get('/', (req, res) => {
    return res.json({ message: 'Hello User' });
  });

  router.post('/create', createUser); // rota para criar um usuário

  return router; // retorna as rotas
}