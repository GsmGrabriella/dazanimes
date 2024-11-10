// importa as dependências necessárias
import React, { useCallback, useContext } from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar
import './styles.css'; // importa o arquivo de estilos
import { UserContext } from '../../contexts/UserContext'; // importa o contexto UserContext
import { LuImagePlus } from "react-icons/lu";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdDownloading } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import api from '../../util/api';
import { useNavigate, useParams } from "react-router-dom"; // importa o useNavigate

// define o componente Profile
const Profile: React.FC = () => {
  const {id} = useParams();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const [profile, setProfile] = useState<any>();
  const [posts, setPosts] = useState<any>([]);
  const [page, setPage] = useState<any>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const navigate = useNavigate();

  async function getProfile() {
    try {
      const res = await api.get(`/users/?id=${id}`)
      setProfile(res.data)
      
    }
    catch(e) {
      console.log(e)
    }
    
  }

  const getPosts = useCallback(async (nextPage?: string) => {
    if (!nextPage) {
      nextPage = '0'
    }
    const res = await api.get(`/posts/?page=${nextPage}&fromUser=${id}`)
    if (res.data.pages > 0) {
      setHasNextPage(true)
      setPage(page + 1)
    } else {
      setHasNextPage(false)
    }

    setPosts((prev: any) => [...prev, ...res.data.posts])
  }, [page, id]);

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

  async function handleUpdateProfilePic(e:any) {
    e.preventDefault();
    console.log(e.target.files[0])
    const formData = new FormData();
    formData.append('profileImage', e.target.files[0]);
    try {
      const res = await api.put(`/users/update/${user?.id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      setProfile(res.data)
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.reload();
      
    }
    catch(e) {
      console.log(e)
  }}

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  }

  // define o efeito colateral para buscar o usuário no localStorage
  useEffect(() => {
    if (user !== null) {
      getPosts();
      getProfile();
    }
  }, [user]);
  

  // retorna o JSX do componente 
  return <div className='profile_container'>
    <NavBar/>
    <main className='profile_main_home'>
      <div className="profile_profile_container">
        <div className="profile_profile_image_container">
          <img src={profile?.profile_picture} alt="" className="profile_profile_image" />
          <label htmlFor="profile_image_input">
            <input type="file" accept='image/*' name="profile_image_input" id="profile_image_input" onChange={handleUpdateProfilePic} />
            {profile?.id === user?.id && <><span>Trocar Foto</span> <LuImagePlus className='profile_image_icon'/></>}
          </label>
        </div>
        <div className="profile_profile_content_container">
          <div className="profile_profile_name">
            <h1>{profile?.username}</h1>
            {profile?.id === user?.id && <GiExitDoor onClick={handleLogout}/>}
          </div>
          
          <div className="profile_profile_info_container">
            <span>{profile?.followed_count} Conhecidos</span>
            <span>{profile?.follows_count} Conhecendo</span>
          </div>
          {profile?.id === user?.id && <GrDocumentUpdate className='profile_profile_new_post' onClick={() => navigate("/newpost")}/>}
        </div>
      </div>
      <div className='profile_bar'></div>
        <div className='profile_post_container'>
          {posts.map((post:any) => {
            return <div className="profile_post" key={post.id}>
                    <div className="profile_post_header">
                      <a href="." className="profile_post_profile"><img src={post.user.profile_picture} alt="" className="profile_post_profile_picture" /> <span>{post.user.username}</span></a>
                      <div className="profile_kawaiis"><span className="profile_kawaii_count">{post.kawaiis_count.toString()}</span>
                      {post.kawaiis.length > 0 ? (
  <FaHeart onClick={() => handleKawaii(post.id)} className='profile_kawaii_icon' />
) : (
  <FaRegHeart onClick={() => handleKawaii(post.id)} className='profile_kawaii_icon' />
)}
                      </div>
                    </div>
                    <div className="profile_post_content">
                    <img src={post.image} alt="" className="profile_post_image" />
                    <p>{post.text}</p>
                    </div>
                  </div>
          },[])}

          {hasNextPage ? <MdDownloading onClick={() => getPosts(page.toString())} className='profile_load_more'/> : <span className='profile_no_more_posts'>Não existem mais posts no momento!</span> }
          
        </div>

    </main>
    
  </div>
}

export default Profile;
