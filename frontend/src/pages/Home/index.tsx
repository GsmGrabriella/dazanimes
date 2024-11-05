// importa as dependências necessárias
import React from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar
import './styles.css'; // importa o arquivo de estilos
import { IoSearchSharp } from "react-icons/io5";

// define o componente Home
const Home: React.FC = () => {
  // cria um estado para armazenar o usuário
  const [user, setUser] = useState<any>(null);
  const width = window.innerWidth;

  // define o efeito colateral para buscar o usuário no localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  // retorna o JSX do componente 
  return <div className='container'>
    <NavBar/>
    <main>
      
      <a href="." className="ad">{width < 768 ? <img src="https://i.pinimg.com/736x/33/5c/72/335c72a5dffe89ee98f34bde6eb4fb6d.jpg" alt="" className='ad_img' /> : <img src="https://i.pinimg.com/736x/41/df/32/41df3272328565d8134b15261429c62c.jpg" alt="" className='ad_img' />}</a>
      
      <div className='content'>
        <div className="users">
          <div className="search">
            <input type="text" placeholder="Pesquisar"/>
            <IoSearchSharp className='search_button'/>
          </div>
        </div>
        <div className='post_container'>
          <div className="post">
            <div className="post_header">
              <a href="." className="profile"><img src="https://i.pinimg.com/736x/41/df/32/41df3272328565d8134b15261429c62c.jpg" alt="" className="profile_picture" /> <span>John Doe</span></a>
            </div>
            <div className="post_content">
              <img src="https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2021/09/10/demon-slayer-capa.png" alt="" className="post_image" />
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    
  </div>
}

export default Home;