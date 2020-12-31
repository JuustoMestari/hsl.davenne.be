import React from 'react';
import { connect } from 'react-redux';
import { Dimmer,Loader  } from 'semantic-ui-react'

function LoadingOverlay(props){
  return( 
    <Dimmer active={props.loading} page>
      <Loader size='huge'>Loading ...</Loader>
    </Dimmer>
  );
}


const mapStateToProps = (state) => ({
    loading:state.root.loading
});

  export default connect(
    mapStateToProps,null
  )(LoadingOverlay);