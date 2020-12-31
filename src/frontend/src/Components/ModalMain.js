import React from 'react';
import {connect} from 'react-redux';

//Import other modals
import ModalError from './ModalError';

//Import actions
import {modalClick} from 'redux/rootActions';

const MODAL_COMPONENTS = {
  "MODAL_ERROR": ModalError,
}

function ModalMain(props){
  //console.log(props);
  if(!props.modal.type){
    //No modal
    return <span/>
  }else{
    const SpecificModal = MODAL_COMPONENTS[props.modal.type];
    //TODO: ADD CHECK TO MAKE SURE SpecificModal is OK
    return <SpecificModal {...props}/>
  }
}
const mapStateToProps = (state) => ({
  modal:state.root.modal
});
const mapDispatchToProps = (dispatch) => ({
  onModalButtonClick : (actionType,actionData) => dispatch(modalClick(actionType,actionData))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalMain)

