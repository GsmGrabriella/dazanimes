// importação de dependências
import bcrypt from 'bcrypt';

// função para gerar o hash ( encriptar ) da senha
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // número de vezes que a senha será aleatorizada
  return bcrypt.hash(password, saltRounds); // retorna a senha encriptada
}

// função para comparar a senha com a senha encriptada
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash); // retorna se a senha é igual a senha encriptada ( verdadeiro ou falso)
}

// exporta as funções
export { hashPassword, comparePassword }