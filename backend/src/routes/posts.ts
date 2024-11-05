// importação de dependências
import { Router } from 'express'; // dependência para cadastrar as rotas
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { GetPosts } from '../controllers/PostController'; // importação das funções do controlador de posts

// criação das rotas de post
export function PostRoutes() {
  const router = Router(); // instância do Router

  router.get('/:page?', GetPosts); // rota para buscar todos os posts

  return router; // retorna as rotas
}