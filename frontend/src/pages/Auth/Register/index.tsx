import React from 'react';
import logo from '../../../assets/logo.png';
import auth_girl_1 from '../../../assets/auth/auth_girl_1.png';
import auth_girl_2 from '../../../assets/auth/auth_girl_2.png';
import { useNavigate } from "react-router-dom";
import api from '../../../util/api';
import { useState } from 'react'

import '../auth.css'
import './styles.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const res = await api.post('/users/create', {username, email, password, passwordConfirmation});
    if (res.status === 200) {
      console.log('Usuário criado com sucesso');
    }
    navigate('/login');

  }

  return <div className="container">
    <header>
      <img className="logo" src={logo} alt="logo"/>
    </header>
    <main>
    <div className="register">
      <h2>Cadastro</h2>
      <form className="register_form" onSubmit={handleSubmit}>
        <input type="text" name="username" className="username" placeholder="Nome de usuário" value={username} onChange={e=>setUsername(e.target.value)}/>
        <input type="email" name="email" className="email" placeholder="Endereço de E-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type="password" name="password" className="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)}/>
        <input type="password" name="password_confirm" className="password_confirm" placeholder="Confirme sua senha" value={passwordConfirmation} onChange={e=>setPasswordConfirmation(e.target.value)}/>

        <button className="register_button">Criar</button>
      </form>
      <div className="register_submit">
        <span>Já possui conta? <a href="/login">Entre!</a></span>

      </div>
    </div>
    </main>
    <footer>
      <img className="auth_girl_2" src={auth_girl_2} alt="auth_girl_2"/>
      <img className="auth_girl_1" src={auth_girl_1} alt="auth_girl_1"/>
    </footer>
</div>
}

export default Register;