// importa as dependências necessárias
import React from 'react'; // importa o React
import { useState, useEffect } from 'react' // importa o useState
import { useNavigate } from "react-router-dom"; // importa o useNavigate
import api from '../../util/api'; // importa a instância do axios
import logo from '../../assets/logo.png'; // importa a logo

import './styles.css'; // importa o arquivo de estilos

// define o componente NavBar
const NavBar: React.FC = () => {
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
  return <header className='header'>
    <div className='logo'><img src={logo} alt="logo"/></div>
    <div className='links'>
      <a href="/">Início</a>
      <a href="/">Notícias</a>
      <a href="/">Destaques</a>
      <a href={user ? "/profile" : "/login"}>Perfil</a>
    </div>
    <div className="user">
      {user ? (
        <>
          <span>{user.username}</span>
          <a href="/profile"><img src={user.profile_picture} alt="profile_picture"/></a>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  </header>
}

export default NavBar;
