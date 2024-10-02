// importação de dependências
import { Router } from 'express'; // dependência para cadastrar as rotas
import { login } from '../controllers/AuthController'; // importação da função login do controlador de autenticação

export function AuthRoutes() {
  const router = Router(); // instância do Router

  // rota raiz ( Olá Autenticação )
  router.get('/', (req, res) => {
    return res.json({ message: 'Hello Auth' });
  });

  router.post('/login', login); // rota para autenticar um usuário

  return router; // retorna as rotas
}

