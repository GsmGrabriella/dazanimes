// importa as dependências necessárias
import React from 'react'; // importa o React
import { useState, useEffect } from 'react' // importa o useState
import { useLocation } from "react-router-dom"; // importa o useNavigate
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

  const location = useLocation();

  const selectedStyle = {
    color: '#C66AFF'
  }

  // retorna o JSX do componente
  return <header className='header'>
    <div className='logo'><img src={logo} alt="logo"/></div>
    <div className='links'>
      <a href="/" style={location.pathname === "/" ? selectedStyle : {}} >Início</a>
      <a href="/" style={location.pathname === "/noticias" ? selectedStyle : {}}>Notícias</a>
      <a href="/" style={location.pathname === "/destaques" ? selectedStyle : {}}>Destaques</a>
      <a href={user ? "/profile" : "/login" } style={location.pathname.startsWith("/profile") ? selectedStyle : {}}>Perfil</a>
    </div>
    <div className="user">
      {user ? (
        <>
          <span>{user.username}</span>
          <a href="/profile"><img src={user.profile_picture} alt="user_picture"/></a>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  </header>
}

export default NavBar;
