// importação de dependências
import prisma from '../util/Prisma' // dependência para acessar o banco de dados
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função createUser
// import {  } from '../interfaces/PostDTO'

// função para criar um usuário
async function GetPosts(req: Request, res: Response): Promise<Response> {
  const page = req.query.page && typeof req.query.page === 'string' ? parseInt(req.query.page) : 0

  const posts = await prisma.post.findMany({
    skip: page * 5,
    take: 5,
    include: {
      user: {
        select: {
          username: true,
          profile_picture: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  // contar a quantidade de paginas restantes
  const count = await prisma.post.count()
  const pages = Math.ceil(count / 5)

  // retornar os posts

  return res.json({ posts, pages: (pages - page - 1) });
}



export { GetPosts }