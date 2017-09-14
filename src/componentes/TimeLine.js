import React, { Component } from 'react';
import FotoItem from './FotoItem';
import TimelineApi from '../logicas/TimelineApi';

export default class Timeline extends Component {

    constructor(props){
      super(props);
      this.state = {fotos:[]};
      this.login = this.props.login;      
    }

    componentWillMount(){
        this.props.store.subscribe(() =>{
        this.setState({fotos:this.props.store.getState().timeline});
      })    
    }
    
    carregaFotos(){
      let urlPerfil;       
      if(this.login === undefined){
        urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
      }else{
        urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
      }    
       this.props.store.dispatch(TimelineApi.lista(urlPerfil));
      
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
      this.props.store.dispatch(TimelineApi.curte(fotoId));
    }

    comenta(fotoId, comentario){
      this.props.store.dispatch(TimelineApi.comenta(fotoId, comentario));
      // this.props.store.comenta(fotoId, comentario);
    }

    render(){
        return (
        <div className="fotos container">
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} curte={this.curte.bind(this)}  comenta={this.comenta.bind(this)}/> )
          }                
        </div>            
        );
    }
}