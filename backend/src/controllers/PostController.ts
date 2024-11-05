// importação de dependências
import prisma from '../util/Prisma' // dependência para acessar o banco de dados
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função createUser
// import {  } from '../interfaces/PostDTO'

// função para criar um usuário
async function GetPosts(req: Request, res: Response): Promise<Response> {
  const page = req.params.page;
  return res.json({ message: 'Hello Post', page });

}



export { GetPosts }