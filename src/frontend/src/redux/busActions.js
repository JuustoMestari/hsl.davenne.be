//Import Actions
import { loading, modalError } from "./rootActions";

//Import API
import {
    getBusesForStop
} from "api/api";

export const GET_BUSES_FOR_STOP_SUCCESS = "GET_BUSES_FOR_STOP_SUCCESS";

function fetchBusesForStop(stopid) {
  return (dispatch) => {
    dispatch(loading(true));
    return getBusesForStop(stopid)
      .then((data) => {
        dispatch(loading(false));
        if(data.data.stop.gtfsId===""){
          dispatch(modalError({message:`${stopid} is not a valid stop`}));
        }else{
          dispatch(fetchBusesForStopSuccess(data.data.stop));
        }
        
      })
      .catch((err) => {
        dispatch(modalError(err));
      });
  };
}

function fetchBusesForStopSuccess(stopInfo) {
    return {
      type: GET_BUSES_FOR_STOP_SUCCESS,
      stopInfo
    };
  }

export { 
    fetchBusesForStop
};
