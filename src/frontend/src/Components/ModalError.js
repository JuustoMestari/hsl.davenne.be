import React from 'react';
import {Modal,Icon,Button,Message} from 'semantic-ui-react';

import './ModalError.scss';

//Import Actions
import {MODAL_ERROR_OK} from 'redux/rootActions';

function ModalError (props){
    
    //console.log(this.props);
    let message = props.modal
    if (message.response){
        message=props.modal.response.data
    }
    return(
        <Modal open={true} className="modalError" size='small'>
            <Modal.Header>An error has occured</Modal.Header>
            <Modal.Content>
                <Message negative>
                    <Message.Header>{message.message}</Message.Header>
                </Message>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={()=>{props.onModalButtonClick(MODAL_ERROR_OK,{})}}>
                    <Icon name='remove' /> OK
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ModalError;