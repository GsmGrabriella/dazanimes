// importação de dependências
import prisma from '../util/Prisma' // dependência para acessar o banco de dados
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função createUser
// import {  } from '../interfaces/PostDTO'
import { UserDTO } from '../interfaces/UserDTO'

// função para criar um usuário
async function GetPosts(req: Request, res: Response): Promise<Response> {
  const signedUser = typeof (req.headers.user) === 'string' ? JSON.parse(req.headers.user) : null
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
      },
      kawaiis: {
        where: {
          user_id: signedUser ? signedUser.id : ""
        },
        select: {
          user_id: true
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

async function kawaiiPost(req: Request, res: Response): Promise<Response> {
  const { user } = req.headers
  const { id } = req.params

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (typeof user !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!id) {
    return res.status(401).json({ error: 'ID not found' })
  }

  const parsedUser: UserDTO = JSON.parse(user)

  const postExists = await prisma.post.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      kawaiis_count: true,
      kawaiis: {
        where: {
          user_id: parsedUser.id
        },
        select: {
          user_id: true
        }
      }

    }
  })

  if (!postExists) {
    return res.status(400).json({ error: 'Post not found' })
  }


  if (postExists.kawaiis.length > 0) {
    return res.status(400).json({ error: 'You are already kawaii this post' })
  }

  const kawaii = await prisma.kawaii.create({
    data: {
      user_id: parsedUser.id,
      post_id: id
    }
  })

  await prisma.post.update({
    where: {
      id: postExists.id
    },
    data: {
      kawaiis_count: postExists.kawaiis_count + 1
    }
  })


  return res.json(kawaii)

}

async function unkawaiiPost(req: Request, res: Response): Promise<Response> {
  const { user } = req.headers
  const { id } = req.params

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (typeof user !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!id) {
    return res.status(401).json({ error: 'ID not found' })
  }

  const parsedUser: UserDTO = JSON.parse(user)

  const postExists = await prisma.post.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      kawaiis_count: true,
      kawaiis: {
        where: {
          user_id: parsedUser.id
        },
        select: {
          user_id: true
        }
      }

    }
  })

  if (!postExists) {
    return res.status(400).json({ error: 'Post not found' })
  }

  if (postExists.kawaiis.length <= 0) {
    return res.status(400).json({ error: 'You are already unkawaii this post' })
  }

  await prisma.kawaii.deleteMany({
    where: {
      user_id: parsedUser.id,
      post_id: id
    }
  })

  await prisma.post.update({
    where: {
      id: postExists.id
    },
    data: {
      kawaiis_count: postExists.kawaiis_count - 1
    }
  })


  return res.status(204).json()

}



export { GetPosts, kawaiiPost, unkawaiiPost }