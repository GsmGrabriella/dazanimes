// importa as dependências necessárias
import React from 'react'; // importa o React
import { useState } from 'react' // importa o useState
import { useNavigate } from "react-router-dom"; // importa o useNavigate
import api from '../../../util/api'; // importa a instância do axios

import logo from '../../../assets/logo.png'; // importa a logo
import auth_girl_1 from '../../../assets/auth/auth_girl_1.png';
import auth_girl_2 from '../../../assets/auth/auth_girl_2.png';

import '../auth.css' // importa o arquivo de estilos
import './styles.css'; // importa o arquivo de estilos

// define o componente Login
const Login: React.FC = () => {
  // define a variável navigate que recebe o hook useNavigate
  const navigate = useNavigate();

  // define as variáveis de estado email e password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // define a função que será executada ao submeter o formulário ( logar usuário ) 
  async function handleSubmit(event: React.FormEvent) {

    // previne o comportamento padrão do formulário
    event.preventDefault();

    // faz a requisição para o endpoint de login
    const res = await api.post('/auth/login', {email, password});

    // armazena o token e o usuário no localStorage
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    // navega para a rota home
    navigate('/');

  }

  // retorna o JSX do componente
  return <div className="container">
    <header>
      <img className="logo" src={logo} alt="logo"/>
    </header>
    <main>
    <div className="login">
      <h2>Login</h2>
      <form className="login_form" onSubmit={handleSubmit}>
        <input type="email" name="email" className="email" placeholder="Endereço de E-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type="password" name="password" className="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)}/>
        <div><span>Esqueci minha senha <a href="#">RECUPERAR SENHA</a></span></div>
      
        <div className="login_submit">
        <span>Não possui conta? <a href="/register">CRIE UMA</a></span>
        <button className="login_button" type="submit">Login</button>
      </div>
      </form>
      
    </div>
    </main>
    <footer>
      <img className="auth_girl_2" src={auth_girl_1} alt="auth_girl_1"/>
      <img className="auth_girl_1" src={auth_girl_2} alt="auth_girl_2"/>
    </footer>
</div>
}

export default Login;
