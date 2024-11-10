// importa as dependências necessárias
import React, { useCallback, useContext } from 'react'; // importa o React
import { useEffect, useState } from 'react'; // importa o useEffect e useState
import NavBar from '../../components/NavBar/'; // importa o componente NavBar
import './styles.css'; // importa o arquivo de estilos
import { UserContext } from '../../contexts/UserContext'; // importa o contexto UserContext
import api from '../../util/api';


// define o componente Home
const Noticias: React.FC = () => {
  // cria um estado para armazenar o usuário
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const [rapidas, setRapidas] = useState<any>([]);
  const [noticias, setNoticias] = useState<any>([]);
  const [recomendacoes, setRecomendacoes] = useState<any>([]);

  const getPosts = useCallback(async () => {
    const res_ra = await api.get(`/posts/?type=noticiaRapida`)
    const res_no = await api.get(`/posts/?type=ultimasNoticias`)
    const res_re = await api.get(`/posts/?type=recomendacoes`)

    setRapidas((prev: any) => [...prev, ...res_ra.data.posts])
    setNoticias((prev: any) => [...prev, ...res_no.data.posts])
    setRecomendacoes((prev: any) => [...prev, ...res_re.data.posts])
  }, []) 

  // define o efeito colateral para buscar o usuário no localStorage
  useEffect(() => {
    getPosts()
  }, []);
  

  // retorna o JSX do componente 
  return <div className='noticias_container'>
    <NavBar/>
    <main className='main_noticias'>
     <div className="noticias_noticias_rapidas_container">
      <h3>Notícias Rápidas</h3>
      {rapidas.map((rapida: any) => {
        return <div className="noticias_noticia_rapida" key={rapida.id}>
          <img src={rapida.image} alt="" />
          <p>{rapida.text}</p>
        </div>
      },[])}
     </div>
     <div className="noticias_noticias_container">
     <h3>Últimas Notícias</h3>
     {noticias.map((noticia: any) => {
        return <div className="noticias_noticia" key={noticia.id}>
          <img src={noticia.image} alt="" />
          <p>{noticia.text}</p>
        </div>
      },[])}
     </div>
     <div className="noticias_noticias_recomendacoes_container">
     <h3>Recomendações</h3>
     {recomendacoes.map((recomendacao: any) => {
        return <div className="noticias_noticias_recomendacoes" key={recomendacao.id}>
          <p>{recomendacao.text}</p>
          <img src={recomendacao.image} alt="" />
        </div>
      },[])}
     </div>

    </main>
    
  </div>
}

export default Noticias;