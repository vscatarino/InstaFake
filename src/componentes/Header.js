import React,{Component} from 'react';
import Pubsub from 'pubsub-js';
import {Link} from 'react-router';

export default class Header extends Component{

  pesquisa(event){
    event.preventDefault();
    
    fetch(`http://localhost:8080/api/public/fotos/${this.loginPesquisado.value}`)
    .then(response => response.json())
    .then(fotos => {
      Pubsub.publish('timeline', fotos);
    });

  }
    render(){
        return(
            <header className="header container">
            <h1 className="header-logo">
              InstaFake
            </h1>
  
            <form className="header-busca" onSubmit={this.pesquisa.bind(this)}>
              <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.loginPesquisado = input}/>
              <input type="submit" value="Buscar" className="header-busca-submit"/>
            </form>
  
  
            <nav>
              <ul className="header-nav">
                <li className="header-nav-item">
                  <Link to={"/logout"} className="header-sair"></Link>            
                </li>
              </ul>
            </nav>
          </header>
        );
    }
}