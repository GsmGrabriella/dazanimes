interface UserDTO {
  id: string
  username: string
  email: string
  password_hash: string
  passwordHash: string
  profilePicture: string
  created_at: string
  updated_at: string
  admin: boolean
  follows_count: number
  followeds_count: number
}

// interface para tipar os dados de entrada da função createUser
interface CreateUserDTO {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  passwordHash: string
  profilePicture: string | null
}

interface UpdateUserDTO {
  username: string | null
  email: string | null
  password: string | null
  passwordConfirmation: string | null
  profilePicture: string | null
}

export { UserDTO, CreateUserDTO, UpdateUserDTO }