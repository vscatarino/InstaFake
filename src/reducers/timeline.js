import {List} from 'immutable';

function atualiza(lista,fotoId, callnackAtualizaPropriedades){
    const fotoEstadoAtual = lista.find(foto => foto.id === fotoId);
    const novasPropriedades = callnackAtualizaPropriedades(fotoEstadoAtual);
    
    const fotoEstadoNovo = Object.assign({},fotoEstadoAtual,novasPropriedades);
    
    const indiceDaLista = lista.findIndex(foto => foto.id === fotoId);
    return lista.set(indiceDaLista, fotoEstadoNovo);   
}

export function timeline(state=new List(),action){
    if(action.type === 'LISTAGEM'){
        return new List(action.fotos);
    }

    if(action.type === 'COMENTARIO'){      
        return atualiza(state, action.fotoId, fotosEstadoAtual =>{
            const novosComentarios = fotosEstadoAtual.comentarios.concat(action.novoComentario);
            return {comentarios:novosComentarios}
        });
    }

    if(action.type === 'CURTE'){       
        
        return atualiza(state, action.fotoId, fotoEstadoAtual =>{
            const likeada = !fotoEstadoAtual.likeada;      
            const possivelLiker = fotoEstadoAtual.likers.find(likerAtual => likerAtual.login === action.liker.login);
            let novosLikers;
            if(possivelLiker === undefined){
                novosLikers = fotoEstadoAtual.likers.concat(action.liker);
            }else{
               novosLikers = fotoEstadoAtual.likers.filter(likerAtual => likerAtual.login !== action.liker.login);           
            } 
            return {likeada,likers:novosLikers}
        });               
    }    
    return state;
}