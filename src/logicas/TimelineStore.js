import Pubsub from 'pubsub-js';

export default class LogicaTimeline{
  constructor(foto){
     this.foto = foto;
  }

    curte(fotoId){
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method:'POST'})
        .then(response =>{
          if(response.ok){
            return response.json();
          }else{
            throw new Error("não foi possível realizar o like da foto");
          }
        })
        .then(liker =>{
            const fotoAtual = this.foto.find(foto => foto.id === fotoId); 
            fotoAtual.likeada = !fotoAtual.likeada;      
            const possivelLiker = fotoAtual.likers.find(likerAtual => likerAtual.login === liker.login);
            
            if(possivelLiker === undefined){
               fotoAtual.likers.push(liker);
            }else{
               const novosLikers = fotoAtual.likers.filter(likerAtual => likerAtual.login !== liker.login); 
               fotoAtual.likers = novosLikers;
            }                   
            Pubsub.publish('timeline', this.foto);          
        });
    }

    comenta(fotoId, comentario){
      const requestInfo ={
        method:'POST',
        body:JSON.stringify({texto:comentario}),
        headers: new Headers({
          'Content-type':'application/json'
        })
      }
      fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
      .then(response =>{
        if(response.ok){
          return response.json()
        }else{
          throw new Error("não foi possível comentar");
        }
      })
      .then(novoComentario=> {
        const fotoAtual = this.foto.find(foto => foto.id === fotoId);
        fotoAtual.comentarios.push(novoComentario);
        Pubsub.publish('timeline', this.foto);  
      })
    }

    lista(urlPerfil){
      fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.foto = fotos;
        Pubsub.publish('timeline', this.foto); 
        
      });
    }

    subscribe(callback){
      Pubsub.subscribe('timeline',(topico,fotos) => {
        callback(fotos);
      });      
    }
}