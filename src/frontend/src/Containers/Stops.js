
import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {connect} from 'react-redux';
import {Grid,Card,Table} from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { format,formatDistanceToNow,fromUnixTime } from 'date-fns'
import L from 'leaflet';

//Import Actions
import {fetchBusesForStop} from 'redux/busActions';
//Import Styles
import './Stops.scss';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function Stops(props) {
    let {stopid} = useParams();
    useEffect(() => {   
        props.getBuses(stopid);
        // eslint-disable-next-line
     },[]);
     
    if(!props.stopInfo.name || !props.stopInfo.lat || !props.stopInfo.lon){
        return(<div></div>)
    }
    //console.log(props.stopInfo);
    let markerPosition = [props.stopInfo.lat,props.stopInfo.lon];
    let markerInfo = `${props.stopInfo.name}`;
    return(
        <Grid stackable className="main" container>
            <Grid.Row>
                <Card className="panel">
                    <Card.Content className="panelHeader">
                        <div className="zone">{props.stopInfo.zoneId}</div>
                        <Card.Header>{props.stopInfo.code} : {props.stopInfo.name}</Card.Header>
                        <Card.Meta>{props.stopInfo.gtfsId}</Card.Meta>
                        <Card.Description>{props.stopInfo.desc}</Card.Description>
                    </Card.Content>
                    <Card.Content className="panelContent">
                        <Grid stackable  className='gridData'>
                            <Grid.Row columns={2} className='gridData'>
                                <Grid.Column width={10}>
                                    <Card className="panel">
                                        <Card.Content className="panelHeader">
                                            <Card.Header>Next buses</Card.Header>
                                        </Card.Content>
                                        <Card.Content className="panelContent">
                                            <Table celled unstackable>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>Departs at</Table.HeaderCell>
                                                        <Table.HeaderCell>Number</Table.HeaderCell>
                                                        <Table.HeaderCell>Destination</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {props.stopInfo.stoptimesWithoutPatterns.map((x,i)=>{
                                                        return(
                                                            <Table.Row key={i} positive={x.realtimeState==="UPDATED"}>
                                                                <Table.Cell>{format(fromUnixTime(x.serviceDay+x.realtimeDeparture),'HH:mm')} (in {formatDistanceToNow(fromUnixTime(x.serviceDay+x.realtimeDeparture))})</Table.Cell>
                                                                <Table.Cell>{x.trip.routeShortName} </Table.Cell>
                                                                <Table.Cell>{x.trip.tripHeadsign}</Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    })}
                                                </Table.Body>
                                            </Table>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <Card className="panel">
                                        <Card.Content className="panelHeader">
                                            <Card.Header>Map</Card.Header>
                                        </Card.Content>
                                        <Card.Content className="panelMapContent">
                                            <MapContainer center={markerPosition} zoom={16} scrollWheelZoom={false}>
                                                <TileLayer
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <Marker position={markerPosition}>
                                                    <Popup>{markerInfo}</Popup>
                                                </Marker>
                                            </MapContainer>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                </Card>
            </Grid.Row>
        </Grid>
        
    )
}

const mapStateToProps = (state) => ({
    stopInfo:state.bus.stopInfo,
});
const mapDispatchToProps = (dispatch) => ({
    getBuses : (stopid) => dispatch(fetchBusesForStop(stopid)),
});
export default connect(
    mapStateToProps,mapDispatchToProps
)(Stops)