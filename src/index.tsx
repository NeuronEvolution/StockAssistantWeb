import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {  Provider } from 'react-redux';
import { createStore,applyMiddleware} from 'redux';
import {BrowserRouter,Route} from 'react-router-dom';
import thunk from 'redux-thunk';
import apicall from './redux/apicall';
import logger from 'redux-logger';
import {rootReducer, RootState} from './redux/redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import App from './containers/App';

let store=createStore<RootState>(rootReducer,{},applyMiddleware(thunk,apicall,logger));

const theme = createMuiTheme();

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <BrowserRouter>
                        <Route path="/" component={App}/>
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
