// importa as dependências necessárias
import React, { useCallback, useContext } from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar
import './styles.css'; // importa o arquivo de estilos
import { UserContext } from '../../contexts/UserContext'; // importa o contexto UserContext
import { IoSearchSharp } from "react-icons/io5";
import { RiUserFollowLine, RiUserFollowFill } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdDownloading } from "react-icons/md";
import api from '../../util/api';
import { useNavigate } from "react-router-dom"; // importa o useNavigate

// define o componente Home
const Home: React.FC = () => {
  // cria um estado para armazenar o usuário
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const [profiles, setProfiles] = useState<any>([]);
  const [loadingProfiles, setLoadingProfiles] = useState<boolean>(true);
  const [profileSearch, setProfileSearch] = useState<string>('');
  const [posts, setPosts] = useState<any>([]);
  const [page, setPage] = useState<any>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const width = window.innerWidth;
  const navigate = useNavigate();

  const getRandomProfiles = useCallback(async () => {
    setLoadingProfiles(true);
    try {
      const res = await api.get('/users/random');
      if (user) {
        setProfiles(res.data.filter((profile: any) => profile.id !== user.id));
      } else {
        setProfiles(res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingProfiles(false);
    }
  }, [user]);

  async function getProfiles() {
    try {
      if (width > 768) {
        const res = await api.get(`/users/?username=${profileSearch}`)
        setProfiles(res.data)
      } else {
        navigate(`/profiles/?name=${profileSearch}`)
      }
      
    }
    catch(e) {
      console.log(e)
    }
    
  }

  const getPosts = useCallback(async (nextPage?: string) => {
    if (!nextPage) {
      nextPage = '0'
    }
    const res = await api.get(`/posts/?page=${nextPage}`)
    if (res.data.pages > 0) {
      setHasNextPage(true)
      setPage(page + 1)
    } else {
      setHasNextPage(false)
    }

    setPosts((prev: any) => [...prev, ...res.data.posts])
  }, [page])

  async function handleKawaii(postId: string) {
    try {
      // Encontre o post específico
      const post = posts.find((post: any) => post.id === postId);
  
      // Verifique se o post existe e se o tamanho de kawaiis é maior que 0
      if (post.kawaiis.length <= 0) {
        await api.post(`/posts/kawaii/${postId}`);
        setPosts((prev: any) => prev.map((post: any) => {
          if (post.id === postId) {
            post.kawaiis_count += 1;
            post.kawaiis = [{}]
          }
          return post;
        }));
      } else {
        await api.delete(`/posts/unkawaii/${postId}`);
        setPosts((prev: any) => prev.map((post: any) => {
          if (post.id === postId) {
            post.kawaiis_count -= 1;
            post.kawaiis = []
          }
          return post;
        }));
      }
    } catch(e) {
      
      
    }
  }

  async function handleFollow(profileId: string) {
    try {
      const profile = profiles.find((profile: any) => profile.id === profileId);
  
      if (profile) {
        if (profile.followeds && profile.followeds.length > 0) {
          await api.delete(`/users/unfollow/${profileId}`);
          setProfiles((prev: any) => prev.map((p: any) => {
            if (p.id === profileId) {
              p.followeds = [];
            }
            return p;
          }));
        } else {
          await api.post(`/users/follow/${profileId}`);
          setProfiles((prev: any) => prev.map((p: any) => {
            if (p.id === profileId) {
              p.followeds = [{}];
            }
            return p;
          }));
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  


  // define o efeito colateral para buscar o usuário no localStorage
  useEffect(() => {
    if (user !== null) {
      getRandomProfiles();
      getPosts();
    }
  }, [user]);
  

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
          {loadingProfiles === false && profiles.map((profile: any) => {
            return <div className="profile" key={profile.id}>
                    <div className="profile_link"><img src={profile.profile_picture} alt="" className="profile_picture" /> <span>{profile.username}</span>
                    {profile.followeds && profile.followeds.length > 0 ? (
          <RiUserFollowFill onClick={() => handleFollow(profile.id)} className='conhecer' />
        ) : (
          <RiUserFollowLine onClick={() => handleFollow(profile.id)} className='conhecer' />
        )}
                    </div> 
                  </div>
          }, [])}
        </div>
        <div className='post_container'>
          {posts.map((post:any) => {
            return <div className="post" key={post.id}>
                    <div className="post_header">
                      <a href="." className="post_profile"><img src={post.user.profile_picture} alt="" className="post_profile_picture" /> <span>{post.user.username}</span></a>
                      <div className="kawaiis"><span className="kawaii_count">{post.kawaiis_count.toString()}</span>
                      {post.kawaiis.length > 0 ? (
  <FaHeart onClick={() => handleKawaii(post.id)} className='kawaii_icon' />
) : (
  <FaRegHeart onClick={() => handleKawaii(post.id)} className='kawaii_icon' />
)}
                      </div>
                    </div>
                    <div className="post_content">
                    <img src={post.image} alt="" className="post_image" />
                    <p>{post.text}</p>
                    </div>
                  </div>
          },[])}

          {hasNextPage ? <MdDownloading onClick={() => getPosts(page.toString())} className='load_more'/> : <span className='no_more_posts'>Não existem mais posts no momento!</span> }
          
        </div>

    </main>
    
  </div>
}

export default Home;