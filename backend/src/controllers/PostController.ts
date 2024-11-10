// importação de dependências
import prisma from '../util/Prisma' // dependência para acessar o banco de dados
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função createUser
import { UserDTO } from '../interfaces/UserDTO'
import { v4 as uuid } from 'uuid'
import { imageKit } from '../util/ImageKit'
import { CreatePostDTO } from '../interfaces/PostDTO'


// função para criar um usuário
async function GetPosts(req: Request, res: Response): Promise<Response> {
  const signedUser = typeof (req.headers.user) === 'string' ? JSON.parse(req.headers.user) : null
  const page = req.query.page && typeof req.query.page === 'string' ? parseInt(req.query.page) : 0
  const type = req.query.type && typeof req.query.type === 'string' ? req.query.type : "post"
  const fromUser = req.query.fromUser && typeof req.query.fromUser === 'string' ? req.query.fromUser : undefined
  const mostLiked = req.query.mostLiked && req.query.mostLiked === 'desc' ? req.query.mostLiked : undefined

  if (fromUser) {
    const posts = await prisma.post.findMany({
      skip: page * 5,
      take: 5,
      where: {
        user_id: fromUser
      },
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
      orderBy: mostLiked ? { kawaiis_count: 'desc' } : { created_at: 'desc' }
    })

    // contar a quantidade de paginas restantes
    const count = await prisma.post.count()
    const pages = Math.ceil(count / 5)

    // retornar os posts

    return res.json({ posts, pages: (pages - page - 1) });
  }

  const posts = await prisma.post.findMany({
    skip: page * 5,
    take: 5,
    where: {
      type
    },
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
    orderBy: mostLiked ? { kawaiis_count: 'desc' } : { created_at: 'desc' }
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

async function createPost(req: Request, res: Response): Promise<Response> {
  const { user } = req.headers
  const { text, type } = req.body
  const file = req.file

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (typeof user !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!text && !file) {
    return res.status(400).json({ error: 'Text or file is required' })
  }

  if (!type) {
    return res.status(400).json({ error: 'Type is required' })
  }

  const parsedUser: UserDTO = JSON.parse(user)

  let url
  if (file) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' })
    }

    let imageName = uuid()
    imageName += `-${parsedUser.username}.${file.mimetype.split('/')[1]}`

    const image = await imageKit.upload({
      file: file.buffer,
      fileName: imageName
    })

    url = image.url

  }

  const postData: CreatePostDTO = {
    user_id: parsedUser.id,
    text,
    image: url,
    type
  }

  const post = await prisma.post.create({
    data: postData
  })


  return res.json(post)
}

async function deletePost(req: Request, res: Response): Promise<Response> {
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

  if (parsedUser.admin !== true) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const postExists = await prisma.post.findUnique({
    where: {
      id
    }
  })

  if (!postExists) {
    return res.status(400).json({ error: 'Post not found' })
  }

  await prisma.post.delete({
    where: {
      id
    }
  })

  return res.status(204).json()
}


export { GetPosts, kawaiiPost, unkawaiiPost, createPost, deletePost }