// importa as dependências necessárias
import React from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState

// define o componente Home
const Home: React.FC = () => {
  // cria um estado para armazenar o usuário
  const [user, setUser] = useState<any>(null);

  // define o efeito colateral para buscar o usuário no localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  // retorna o JSX do componente 
  return <div>
    <h1>Home</h1>
    {!user ? <p>você não esta logado</p> : <p>Olá, {user.username}</p>}
  </div>
}

export default Home;