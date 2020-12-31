
import {toast} from "react-toastify";

//Loading types
export const LOADING="LOADING";

//Actions types
export const MODAL_ERROR= "MODAL_ERROR";

//User auth
export const USER_LOGGED_IN="USER_LOGGED_IN"
export const USER_LOGGED_OUT="USER_LOGGED_OUT"

//Modal specifics
export const MODAL_CLOSE = "MODAL_CLOSE";
export const MODAL_ERROR_OK = "MODAL_ERROR_OK";
export const MODAL_CONFIRM="MODAL_CONFIRM";
export const MODAL_CONFIRM_YES = "MODAL_CONFIRM_YES";
export const MODAL_CONFIRM_NO = "MODAL_CONFIRM_NO";

export const ADD_TOAST= "ADD_TOAST";

function loading(on){
  return {
    type: LOADING,
    on
  }
}

function addToast(toastData) {
    toast(toastData.message,{type:toastData.type,autoClose:3000,pauseOnFocusLoss:false});
    return {
      type: ADD_TOAST,
      toastData
    }
}

function modalClose(){
  return{
    type:MODAL_CLOSE
  }
}
function modalClick(action,data) {
  return {
    type: action,
    data
  }
}

function modalError(modal) {
    return {
      type: MODAL_ERROR,
      modal
    }
}

function modalConfirm(modal) {
  return {
    type:MODAL_CONFIRM,
    modal
  }
}

export {
  loading,
  modalClose,
  modalClick,
  modalError,
  modalConfirm,
  addToast
}