import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express'

async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const [, token] = req.headers.authorization?.split(' ') || [' ', ' ']
  const { user } = req.headers
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  if (!user) {
    return res.status(401).json({ error: 'User not provided' })
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET)
    const userIdFromToken = typeof payload === 'string' ? JSON.parse(payload).user.id : payload.user.id

    if (!user && !userIdFromToken) {
      return res.status(401).json({ error: 'Invalid Token' })
    }

    return next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Invalid Token' })
  }
}

export default AuthMiddleware