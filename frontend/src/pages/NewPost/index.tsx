// importa as dependências necessárias
import React, { useContext } from 'react'; // importa o React
import { useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar
import './styles.css'; // importa o arquivo de estilos
import { UserContext } from '../../contexts/UserContext'; // importa o contexto UserContext
import { IoIosCheckmarkCircle } from "react-icons/io";
import api from '../../util/api';
import { useNavigate } from "react-router-dom"; // importa o useNavigate

// define o componente Profile
const NewPost: React.FC = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();
  const [type, setType] = useState<any>(undefined);
  const [imagePreview, setImagePreview] = useState<any>("https://ik.imagekit.io/n8oinmsy6/90082fcc-16a2-419b-9bf3-e960fdf09cb1-kayk_OkW9CuOWd.png?updatedAt=1731266278525");
  const [image, setImage] = useState<any>(undefined);
  const [text, setText] = useState<any>(undefined);

  function handleChangeImage(e: any) {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  async function handleSubmit(e:any) {
    e.preventDefault();
    const formData = new FormData();
    if (!image && !text) {
      alert('Você precisa adicionar uma imagem ou texto para criar um post');
      return;
    }
    if (!type) {
      alert('Você precisa selecionar um tipo para criar um post');
      return;
    }

    if (image) {
      formData.append('image', image);
    }

    if (text) {
      formData.append('text', text);
    }

    formData.append('type', type);

    try {
      await api.post(`/posts`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      navigate('/')
    } catch(e) {
      console.log(e)
    }

  }

  return <div className="newpost_container">
    <NavBar/>
      <form className='newpost_form' onSubmit={handleSubmit}>
        <div className='newpost_type_container'>
        {user?.admin && <div className="newpost_type_label1">
        <label className={type === "noticiaRapida" ? 'selected' : ''}>
            <input
                type="radio"
                name='type'
                value="noticiaRapida"
                checked={type === "noticiaRapida"}
                onChange={e => setType(e.target.value)}
                className='newpost_type_radio'
            />Notícia Rápida
        </label>
        <label className={type === "ultimasNoticias" ? 'selected' : ''}>
            <input
                type="radio"
                name='type'
                value="ultimasNoticias"
                checked={type === "ultimasNoticias"}
                onChange={e => setType(e.target.value)}
                className='newpost_type_radio'
            />Últimas Notícias
        </label>
    </div>}
    <div className="newpost_type_label2">
        {user?.admin &&<label className={type === "recomendacoes" ? 'selected' : ''}>
            <input
                type="radio"
                name='type'
                value="recomendacoes"
                checked={type === "recomendacoes"}
                onChange={e => setType(e.target.value)}
                className='newpost_type_radio'
            />Recomendações
        </label>}
        <label className={type === "post" ? 'selected' : ''}>
            <input
                type="radio"
                name='type'
                value="post"
                checked={type === "post"}
                onChange={e => setType(e.target.value)}
                className='newpost_type_radio'
            />Post
        </label>
    </div>
        </div>
        <div className='newpost_bar'></div>
        <div className="newpost_content_container">
          <div className="newpost_profile_container">
            <div className="newpost_profile">
              <img src={user?.profile_picture} alt="profile_picture" />
              <span>{user?.username}</span>
            </div>
            <span className="newpost_close" onClick={() => {navigate("/")}}>X</span>
          </div>
          <label htmlFor="newpost_image" className="newpost_image_input">
            <input type="file" name="newpost_image" id="newpost_image" onChange={handleChangeImage} />
            <img src={imagePreview} alt="" />
          </label>
          <div className="newpost_input_text_container">
            <textarea name="newpost_text" id="newpost_text" placeholder="Escreva algo..." value={text} onChange={e => setText(e.target.value)}></textarea>
            <button type='submit' ><IoIosCheckmarkCircle /></button>
          </div>
        </div>
      </form>
  </div>
}

export default NewPost;