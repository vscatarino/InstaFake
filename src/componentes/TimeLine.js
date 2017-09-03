import React, { Component } from 'react';
import FotoItem from './FotoItem';
import Pubsub from 'pubsub-js';

export default class Timeline extends Component {

    constructor(props){
      super(props);
      this.state = {fotos:[]};
      this.login = this.props.login;
    }

    componentWillMount(){
      Pubsub.subscribe('timeline',(topico,fotos) => {
        this.setState({fotos});
      });

      Pubsub.subscribe('atualiza-liker',(topico, infoLiker) => {
        const fotoAtual = this.state.fotos.find(foto => foto.id === infoLiker.fotoId); 
        fotoAtual.likeada = !fotoAtual.likeada;      
        const possivelLiker = fotoAtual.likers.find(liker => liker.login === infoLiker.liker.login);
        
        if(possivelLiker === undefined){
           fotoAtual.likers.push(infoLiker.liker);
        }else{
           const novosLikers = fotoAtual.likers.filter(liker => liker.login !== infoLiker.liker.login); 
           fotoAtual.likers = novosLikers;
        }                   
        this.setState({fotos:this.state.fotos});
      });

      Pubsub.subscribe('novos-comentarios', (topico, infoComentario) => {
        const fotoAtual = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
        fotoAtual.comentarios.push(infoComentario.novoComentario);
        this.setState({fotos:this.state.fotos});       
      });  
    }
    
    carregaFotos(){
      let urlPerfil;       
      if(this.login === undefined){
        urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
      }else{
        urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
      }

      fetch(urlPerfil)
       .then(response => response.json())
       .then(fotos => {
         this.setState({fotos:fotos});
       });
    }

    componentDidMount(){
     this.carregaFotos();
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.login !== undefined){
        this.login = nextProps.login;
        this.carregaFotos();
      }
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
        Pubsub.publish('atualiza-liker',{fotoId, liker});
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
        Pubsub.publish('novos-comentarios', {fotoId, novoComentario});
      })
    }

    render(){
        return (
        <div className="fotos container">
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} curte={this.curte}  comenta={this.comenta}/> )
          }                
        </div>            
        );
    }
}