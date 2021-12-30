let intial_state ={
    userID: null,
}
function reducer(state={...intial_state}, action)
{
    switch(action.type)
    {
        case 'update_id':
            return {
                ...state,
                userID: action.payload.newID
            }
        default:{
            return state
        }
    }
}

export default reducer;