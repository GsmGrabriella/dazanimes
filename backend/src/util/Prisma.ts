// importação de dependências
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // instância do PrismaClient ( ORM de banco de dados )
// ORM é uma camada facilitadora que mapeia objetos de uma aplicação para registros de um banco de dados

export default prisma // exporta a instância do PrismaClient