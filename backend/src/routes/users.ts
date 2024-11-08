// importação de dependências
import { Router } from 'express'; // dependência para cadastrar as rotas
import { createUser, updateUser, getRandomUsers, getUsers, followUser, unfollowUser } from '../controllers/UserController'; // importação da função createUser do controlador de usuários
import AuthMiddleware from '../middlewares/AuthMiddleware';

// criação das rotas de usuários
export function UserRoutes() {
  const router = Router(); // instância do Router

  // rota para buscar um usuário
  router.get('/', getUsers);

  // rota para buscar usuários aleatórios
  router.get('/random', getRandomUsers);

  router.post('/create', createUser); // rota para criar um usuário

  router.put('/update/:id', AuthMiddleware, updateUser);

  router.post('/follow/:id', AuthMiddleware, followUser);
  router.delete('/unfollow/:id', AuthMiddleware, unfollowUser);

  return router; // retorna as rotas
}