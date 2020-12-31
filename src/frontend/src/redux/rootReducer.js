import { combineReducers } from "redux";
import {produce} from "immer";
import { connectRouter } from 'connected-react-router'

//import other reducers
import busReducer from "./busReducer";

//import actions
import {LOADING,ADD_TOAST,MODAL_ERROR} from 'redux/rootActions';
import {MODAL_CLOSE,MODAL_ERROR_OK,MODAL_CONFIRM_NO,MODAL_CONFIRM} from 'redux/rootActions';

let loadCounter=0;
const initialState={
    modal:{},
    loading:false,
    action:{
        name:null,
        data:{},
    }
};

// root reducer if needed
const rootReducer = (state=initialState,action)=>
    produce(state,draft=>{
        //console.log(state,action);
        switch(action.type){
            case "@@router/LOCATION_CHANGE":
                /*draft.action.name = "routeChanged";
                draft.action.data=action;*/
                break;
            case LOADING:
                loadCounter=(action.on)?loadCounter+1:loadCounter-1;
                draft.loading = loadCounter>0;
                break;
            case ADD_TOAST:
                //Do something if toast
                break;
            case MODAL_CONFIRM:
            case MODAL_ERROR:
                draft.modal = action.modal;
                draft.modal.type = action.type;
                draft.loading = initialState.loading;
                break;
            case MODAL_ERROR_OK:
            case MODAL_CLOSE:
            case MODAL_CONFIRM_NO:
                draft.modal = initialState.modal;
                draft.action = initialState.action;
                loadCounter=0;
                break;
            default:
                break;
        }
    });

export default (history) => combineReducers({
    router: connectRouter(history),
    root: rootReducer,
    bus:busReducer,
  });