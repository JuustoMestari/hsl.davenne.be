import produce from "immer";

//Import actions
import {GET_BUSES_FOR_STOP_SUCCESS} from 'redux/busActions';

const initialState={
    stopInfo:{}
};

const busReducer = (state=initialState,action)=>
    produce(state,draft=>{
        switch(action.type){
            case GET_BUSES_FOR_STOP_SUCCESS:
                draft.stopInfo=action.stopInfo;
                break;
            default:
                break;
        }
    });

export default busReducer;