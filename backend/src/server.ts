// importação de dependências

import express from 'express' // dependência para criar o servidor
import routes from './routes' // importação das rotas
import cors from 'cors' // dependência para permitir que o front-end acesse o back-end

// criação do servidor
const app = express()


// configuração do servidor
app.use(cors()); // permite que o front-end acesse o back-end
app.use(express.json()); // permite que o servidor entenda requisições no formato JSON
app.use(routes); // utiliza as rotas criadas

app.listen(3333); // servidor ouvindo na porta 3333