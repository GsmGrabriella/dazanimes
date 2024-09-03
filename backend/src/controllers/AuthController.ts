import prisma from '../util/Prisma'
import { comparePassword } from '../util/Password'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'

interface LoginDTO {
  email: string
  password: string
}

async function login(req: Request, res: Response): Promise<Response> {
  const { email, password }: LoginDTO = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const passwordMatch = await comparePassword(password, user.password_hash)

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = sign({ user: JSON.stringify(user) }, process.env.JWT_SECRET, { expiresIn: '15d' })

  return res.json({ token })

}



export { login }
