import React from 'react';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return <div>
    <h1>Home</h1>
    {!user ? <p>você não esta logado</p> : <p>Olá, {user.username}</p>}
  </div>
}

export default Home;