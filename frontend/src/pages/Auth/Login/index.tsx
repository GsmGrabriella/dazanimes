import React from 'react';
import { useState } from 'react'
import logo from '../../../assets/logo.png';
import auth_girl_1 from '../../../assets/auth/auth_girl_1.png';
import auth_girl_2 from '../../../assets/auth/auth_girl_2.png';
import { useNavigate } from "react-router-dom";

import '../auth.css'
import './styles.css';
import api from '../../../util/api';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const res = await api.post('/auth/login', {email, password});
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    navigate('/');

  }


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
      <img className="auth_girl_1" src={auth_girl_1} alt="auth_girl_1"/>
      <img className="auth_girl_2" src={auth_girl_2} alt="auth_girl_2"/>
    </footer>
</div>
}

export default Login;