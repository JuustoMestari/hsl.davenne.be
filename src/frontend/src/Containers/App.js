import React, {Suspense} from 'react';
import {createStore,applyMiddleware,compose} from 'redux';
import { Switch,BrowserRouter,Route } from 'react-router-dom';
import { routerMiddleware,ConnectedRouter } from 'connected-react-router'
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from "history";

//Import containers
import Home from 'Containers/Home';
import Stops from 'Containers/Stops';

//Import Reducer
import rootReducer from 'redux/rootReducer';

//Import Components
import ModalMain from 'Components/ModalMain';
import LoadingOverlay from 'Components/LoadingOverlay';

//Import
import './App.scss';

const history = createBrowserHistory()
//Create redux store
const appStore = createStore(
    rootReducer(history),
    compose(
      applyMiddleware(
        routerMiddleware(history),
        thunk)
      )
  );

function App() {
  return (
    <Provider store={appStore}>
        <BrowserRouter>
        <ConnectedRouter history={history}>
            <div className="app-wrapper">
                <Suspense fallback={null}>
                    <Switch>
                        <Route component={Stops} path="/stop/:stopid"/>
                        <Route component={Home} />
                    </Switch>
                    <ModalMain/>
                    <LoadingOverlay/>
                </Suspense>
            </div>
        </ConnectedRouter>
        </BrowserRouter>
    </Provider>
  );
}

export default App;
