// importação de dependências
import prisma from '../util/Prisma' // dependência para acessar o banco de dados
import { hashPassword } from '../util/Password' // importação da função hashPassword
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função createUser

// interface para tipar os dados de entrada da função createUser
interface CreateUserDTO {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  passwordHash: string
  profilePicture: string | null
}

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

export { createUser }