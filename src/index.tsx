import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {  Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from './redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import OauthJumpPage from './oauthJumpPage/OauthJumpPage';
import App from './App';
import { Switch } from 'react-router';

let store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

const theme = createMuiTheme();

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/oauthJump" component={OauthJumpPage}/>
                            <Route path="/" component={App}/>
                        </Switch>
                    </BrowserRouter>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

ReactDOM.render(
  <Root/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
