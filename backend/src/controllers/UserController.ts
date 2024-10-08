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

  // criação do usuário sem foto de perfil
  if (!profilePicture) {
    const data = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash
      }
    })

    return res.json(data)
  }

  // criação do usuário com foto de perfil
  const data = await prisma.user.create({
    data: {
      username,
      email,
      password_hash: passwordHash,
      profile_picture: profilePicture
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

export { createUser, updateUser }