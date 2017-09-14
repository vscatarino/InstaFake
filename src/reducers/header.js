export function alerta(state='', action){
    if(action.type === 'ALERTA'){
        return action.msg;
    }

    return state;
}