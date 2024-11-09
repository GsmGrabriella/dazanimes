// importação de dependências
import { Router } from 'express'; // dependência para cadastrar as rotas
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { createPost, GetPosts, kawaiiPost, unkawaiiPost, deletePost } from '../controllers/PostController'; // importação das funções do controlador de posts
import { upload } from '../util/Multer';

// criação das rotas de post
export function PostRoutes() {
  const router = Router(); // instância do Router

  router.get('/', GetPosts); // rota para buscar todos os posts
  router.post('/kawaii/:id', AuthMiddleware, kawaiiPost);
  router.delete('/unkawaii/:id', AuthMiddleware, unkawaiiPost);
  router.post('/', AuthMiddleware, upload.single('image'), createPost);
  router.delete('/:id', AuthMiddleware, deletePost);

  return router; // retorna as rotas
}