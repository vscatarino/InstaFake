export function listagem(fotos){
    return {type:'LISTAGEM', fotos}
}

export function comentar(fotoId, novoComentario){
    return {type:'COMENTARIO',fotoId, novoComentario}
}

export function curtir(fotoId, liker){
    return {type:'CURTE',fotoId, liker}
}
 
export function alertar(msg){
    return {type:'ALERTA',msg}
}