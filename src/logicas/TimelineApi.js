import {listagem,comentar,curtir,alertar} from '../actions/actionCreator'

export default class TimelineApi{
  
   static curte(fotoId){
     return dispatch =>{
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method:'POST'})
        .then(response =>{
          if(response.ok){
            return response.json();
          }else{
            throw new Error("não foi possível realizar o like da foto");
          }
        })
        .then(liker =>{
          dispatch(curtir(fotoId, liker));         
        });
     }        
    }

   static comenta(fotoId, comentario){
      return dispatch =>{
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
            dispatch(comentar(fotoId, novoComentario));    
            return novoComentario;      
          })
        }      
    }

    static lista(urlPerfil){
      return dispatch =>{  
        fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
            dispatch(listagem(fotos))
            return fotos;
        });
      }  
    }

    static pesquisa(loginPesquisado){
      return dispatch =>{
          fetch(`http://localhost:8080/api/public/fotos/${loginPesquisado}`)
          .then(response => response.json())
          .then(fotos => {
              if(fotos.length === 0){
                dispatch(alertar('Usuário não encontrado!'));
              }else{
                dispatch(alertar(''));
              }
              dispatch(listagem(fotos));
          return fotos
          });
      }      
    }
    
}