// importação de dependências
import prisma from '../util/Prisma' // importação da instância do PrismaClient
import { comparePassword } from '../util/Password' // importação da função comparePassword
import { Request, Response } from 'express' // dependências para tipar os parâmetros da função login
import { sign } from 'jsonwebtoken' // dependência para gerar tokens de autenticação

// interface para tipar os dados de entrada da função login
interface LoginDTO {
  email: string
  password: string
}

// função para autenticar um usuário
async function login(req: Request, res: Response): Promise<Response> {
  const { email, password }: LoginDTO = req.body // desestruturação dos dados de entrada

  // busca o usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  // validação de usuário não encontrado
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  // compara a senha com a senha encriptada
  const passwordMatch = await comparePassword(password, user.password_hash)

  // validação de senha inválida
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  // gera um token de autenticação
  const token = sign({ user: JSON.stringify(user) }, process.env.JWT_SECRET, { expiresIn: '15d' })

  // retorna o token
  return res.json({ user, token })

}



export { login }
