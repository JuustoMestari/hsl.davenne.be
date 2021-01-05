
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {Form} from "semantic-ui-react";

import './Home.scss';

function Home(props) {
    const [stopData,setStopData] = useState("");
    function handleClick (){
        props.history.push("/stop/"+stopData)
    }
    return(
        <div className="Home">
            <div>Bus Stop E3242 : <Link to="/stop/E3242">/stop/E3242</Link></div>
            <div>Bus Stop Latokasken koulu : <Link to="/stop/E3242">/stop/latokasken</Link></div>
            <div>
                <Form>
                    <Form.Group>
                        <Form.Input
                        label='Enter a bus stop ID or name'
                        placeholder='Stop'
                        name='stop'
                        value={stopData}
                        onChange={(e => setStopData(e.target.value))}
                        />
                        <Form.Button content='Check' onClick={handleClick} />
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => ({
   
});
export default connect(
    mapStateToProps,mapDispatchToProps
)(Home)