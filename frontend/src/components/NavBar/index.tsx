// importa as dependências necessárias
import React from 'react'; // importa o React
import { useState, useEffect, useContext } from 'react' // importa o useState
import { useLocation } from "react-router-dom"; // importa o useNavigate
import { UserContext } from '../../contexts/UserContext'; // importa o contexto UserContext
import api from '../../util/api'; // importa a instância do axios
import logo from '../../assets/logo.png'; // importa a logo

import './styles.css'; // importa o arquivo de estilos

// define o componente NavBar
const NavBar: React.FC = () => {
  // cria um estado para armazenar o usuário
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const location = useLocation();

  const selectedStyle = {
    color: '#C66AFF'
  }

  // retorna o JSX do componente
  return <header className='header'>
    <div className='logo'><img src={logo} alt="logo"/></div>
    <div className='links'>
      <a href="/" style={location.pathname === "/" ? selectedStyle : {}} >Início</a>
      <a href="/noticias" style={location.pathname === "/noticias" ? selectedStyle : {}}>Notícias</a>
      <a href="/destaques" style={location.pathname === "/destaques" ? selectedStyle : {}}>Destaques</a>
      <a href={user ? `/profile/${user.id}` : "/login" } style={location.pathname.startsWith("/profile") ? selectedStyle : {}}>Perfil</a>
    </div>
    <div className="user">
      {user ? (
        <>
          <span>{user.username}</span>
          <a href={`/profile/${user.id}`}><img src={user.profile_picture} alt="user_picture"/></a>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  </header>
}

export default NavBar;
