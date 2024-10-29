// importa as dependências necessárias
import React from 'react'; // importa o React
import { useState, useEffect } from 'react' // importa o useState
import { useNavigate } from "react-router-dom"; // importa o useNavigate
import api from '../../util/api'; // importa a instância do axios

import NavBar from '../../components/NavBar/'; // importa o componente NavBar

import './styles.css'; // importa o arquivo de estilos

// define o componente Profile
const Profile: React.FC = () => {
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
  return <div className="container">
    <NavBar/>
</div>
}

export default Profile;
