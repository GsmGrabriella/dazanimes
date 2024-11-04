// importa as dependências necessárias
import React from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar

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
    <NavBar/>
  </div>
}

export default Home;