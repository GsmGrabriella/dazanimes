import prisma from '../util/Prisma'
import { hashPassword } from '../util/Password'
import { Request, Response } from 'express'

interface CreateUserDTO {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  passwordHash: string
  profilePicture: string | null
}

async function createUser(req: Request, res: Response): Promise<Response> {
  const { username, email, password, passwordConfirmation, profilePicture }: CreateUserDTO = req.body

  if (password !== passwordConfirmation) {
    return res.status(400).json({ error: 'Password and password confirmation do not match' })
  }

  const passwordHash = await hashPassword(password)

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

  const data = await prisma.user.create({
    data: {
      username,
      email,
      password_hash: passwordHash,
      profile_picture: profilePicture
    }
  })

  return res.json(data)


}

export { createUser }