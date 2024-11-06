// importa as dependências necessárias
import React from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar
import './styles.css'; // importa o arquivo de estilos
import { IoSearchSharp } from "react-icons/io5";
import { RiUserFollowLine, RiUserFollowFill } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import api from '../../util/api';

// define o componente Home
const Home: React.FC = () => {
  // cria um estado para armazenar o usuário
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<[]>([]);
  const [profileSearch, setProfileSearch] = useState<string>('');
  const [posts, setPosts] = useState<any>([]);
  const [page, setPage] = useState<any>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const width = window.innerWidth;

  async function getRandomProfiles() {
    const res = await api.get('/users/random')
    setProfiles(res.data)
  }

  async function getProfiles() {
    try {
      const res = await api.get(`/users/?username=${profileSearch}`)
      setProfiles(res.data)
    }
    catch(e) {
      console.log(e)
    }
    
  }


  async function handleScroll() {
    if(window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setPage((prev: any) => prev + 1)
      // if (hasNextPage === true) {
        
      // }
    }
    
  }

  async function getPosts(nextPage: string) {
    const res = await api.get(`/posts/${nextPage}`)
    
    setPosts((prev: any) => [...prev, ...res.data.posts])
  }
  
  


  // define o efeito colateral para buscar o usuário no localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
    getRandomProfiles();
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  })

  useEffect(() => {
    getPosts(page.toString())
  }, [page])

  

  


  // retorna o JSX do componente 
  return <div className='container'>
    <NavBar/>
    <main className='main_home'>
      <a href="." className="ad">{width < 768 ? <img src="https://i.pinimg.com/736x/33/5c/72/335c72a5dffe89ee98f34bde6eb4fb6d.jpg" alt="" className='ad_img' /> : <img src="https://i.pinimg.com/736x/41/df/32/41df3272328565d8134b15261429c62c.jpg" alt="" className='ad_img' />}</a>
        <div className="profiles">
          <div className="search">
            <input type="text" placeholder="Pesquisar" value={profileSearch} onChange={e=>setProfileSearch(e.target.value)}/>
            <IoSearchSharp className='search_button' onClick={getProfiles}/>
          </div>
          <h3 className="profile_callout">Perfis para conhecer</h3>
          {profiles.map((profile: any) => {
            return <div className="profile" key={profile.id}>
                    <div className="profile_link"><img src={profile.profile_picture} alt="" className="profile_picture" /> <span>{profile.username}</span> <RiUserFollowLine className='conhecer'/></div> 
                  </div>
          }, [])}
        </div>
        <div className='post_container'>
          {posts.map((post:any) => {
            return <div className="post" key={post.id}>
                    <div className="post_header">
                      <a href="." className="post_profile"><img src={post.user.profile_picture} alt="" className="post_profile_picture" /> <span>{post.user.username}</span></a>
                      <div className="kawaiis"><span className="kawaii_count">{post.kawaiis_count.toString()}</span> <FaRegHeart className='kawaii_icon'/></div>
                    </div>
                    <div className="post_content">
                    <img src={post.image} alt="" className="post_image" />
                    <p>{post.text}</p>
                    </div>
                  </div>
          },[])}
          
        </div>

    </main>
    
  </div>
}

export default Home;