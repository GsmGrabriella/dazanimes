// importação de dependências
import prisma from '../util/Prisma' // dependência para acessar o banco de dados
import { hashPassword } from '../util/Password' // importação da função hashPassword
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função createUser
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '../interfaces/UserDTO'

// função para criar um usuário
async function createUser(req: Request, res: Response): Promise<Response> {
  const { username, email, password, passwordConfirmation, profilePicture }: CreateUserDTO = req.body // desestruturação dos dados de entrada

  // validação de senha e confirmação de senha
  if (password !== passwordConfirmation) {
    return res.status(400).json({ error: 'Password and password confirmation do not match' })
  }

  // encriptação da senha
  const passwordHash = await hashPassword(password)

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // criação do usuário com foto de perfil
  const data = await prisma.user.create({
    data: {
      username,
      email,
      password_hash: passwordHash,
      ...(profilePicture && { profile_picture: profilePicture })
    }
  })

  return res.json(data) // retorno dos dados do usuário


}

async function updateUser(req: Request, res: Response): Promise<Response> {
  if (!req.headers.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { user } = req.headers
  const { id } = req.params
  const { username, email, password, passwordConfirmation, profilePicture }: UpdateUserDTO = req.body

  if (typeof user !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const authorizedUser: UserDTO = JSON.parse(user)

  if (authorizedUser.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (password && password !== passwordConfirmation) {
    return res.status(400).json({ error: 'Password and password confirmation do not match' })
  }
  let passwordHash = null
  if (password) {
    passwordHash = await hashPassword(password)
  }


  const data = await prisma.user.update({
    where: {
      id
    },
    data: {
      username: username || authorizedUser.username,
      email: email || authorizedUser.email,
      password_hash: passwordHash || authorizedUser.password_hash,
      profile_picture: profilePicture || authorizedUser.profilePicture
    }
  })

  return res.json(data);
}

async function getRandomUsers(req: Request, res: Response): Promise<Response> {
  const signedUser = typeof (req.headers.user) === 'string' ? JSON.parse(req.headers.user) : null
  const usersCount = await prisma.user.count();
  const skip = Math.floor(Math.random() * usersCount);
  const users = await prisma.user.findMany({
    take: 5,
    skip,
    select: {
      id: true,
      username: true,
      profile_picture: true,
      followeds: {
        where: {
          user_id: signedUser?.id || ''
        },
        select: {
          id: true
        },
        take: 1
      }

    }
  });

  return res.json(users)
}

async function getUsers(req: Request, res: Response): Promise<Response> {
  const signedUser = typeof (req.headers.user) === 'string' ? JSON.parse(req.headers.user) : null
  const { id, username } = req.query
  if (id && typeof id === 'string') {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        username: true,
        profile_picture: true,
        followeds: {
          where: {
            user_id: signedUser?.id || ''
          },
          select: {
            id: true
          },
          take: 1
        }
      }
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    return res.json(user)
  }

  if (username && typeof username === 'string') {
    const users = await prisma.user.findMany({
      where: {
        username
      },
      select: {
        id: true,
        username: true,
        profile_picture: true,
        followed_count: true,
        follows_count: true,
        followeds: {
          where: {
            user_id: signedUser?.id || ''
          },
          select: {
            id: true
          },
          take: 1
        }
      }
    })

    if (users.length <= 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    return res.json(users)
  }

  return res.status(400).json({ error: 'User not found' })

}

async function followUser(req: Request, res: Response): Promise<Response> {
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

  if (id === parsedUser.id) {
    return res.status(400).json({ error: 'You cannot follow yourself' })
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      followed_count: true,
      followeds: {
        where: {
          user_id: parsedUser.id
        }
      }
    }
  })

  if (!userExists) {
    return res.status(400).json({ error: 'User not found' })
  }

  if (userExists.followeds.length > 0) {
    return res.status(400).json({ error: 'You are already following this user' })
  }

  const follow = await prisma.follow.create({
    data: {
      user_id: parsedUser.id,
      followed_id: id
    }
  })

  const updatedUser = await prisma.user.findUnique({
    where: {
      id: parsedUser.id
    }
  })

  if (!updatedUser) {
    return res.status(400).json({ error: 'User not found' })
  }

  await prisma.user.update({
    where: {
      id: parsedUser.id
    },
    data: {
      follows_count: updatedUser.follows_count + 1
    }
  })

  await prisma.user.update({
    where: {
      id: userExists.id
    },
    data: {
      followed_count: userExists.followed_count + 1
    }
  })


  return res.json(follow)

}

async function unfollowUser(req: Request, res: Response): Promise<Response> {
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

  if (id === parsedUser.id) {
    return res.status(400).json({ error: 'You cannot unfollow yourself' })
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      followed_count: true,
      followeds: {
        where: {
          user_id: parsedUser.id
        }
      }
    }
  })

  if (!userExists) {
    return res.status(400).json({ error: 'User not found' })
  }

  if (userExists.followeds.length <= 0) {
    return res.status(400).json({ error: 'You are already not following this user' })
  }


  await prisma.follow.deleteMany({
    where: {
      user_id: parsedUser.id,
      followed_id: id
    }
  })

  const updatedUser = await prisma.user.findUnique({
    where: {
      id: parsedUser.id
    }
  })

  if (!updatedUser) {
    return res.status(400).json({ error: 'User not found' })
  }

  await prisma.user.update({
    where: {
      id: parsedUser.id
    },
    data: {
      follows_count: updatedUser.follows_count - 1
    }
  })

  await prisma.user.update({
    where: {
      id: userExists.id
    },
    data: {
      followed_count: userExists.followed_count - 1
    }
  })


  return res.status(204).json()

}

export { createUser, updateUser, getRandomUsers, getUsers, followUser, unfollowUser }