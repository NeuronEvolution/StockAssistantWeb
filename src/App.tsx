import * as React from 'react';
import MessagesPage from './messagesPage/MessagesPage';
import StocksPage from './stocksPage/StocksPage';
import SettingsPage from './settingsPage/SettingsPage';
import MyPage from './myPage/MyPage';
import { connect } from 'react-redux';
import IndexManagePage from './indexManagePage/IndexManagePage';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { onErrorMessage, RootState } from './redux';
import { StandardAction } from './_common/action';
import { parseQueryString, valueOrDefault } from './_common/common';
import Tabs, { Tab } from 'material-ui/Tabs';
import { CSSProperties } from 'react';

const TAB_STOCKS_PAGE = 0;
const TAB_INDEX_MANAGE_PAGE = 1;
const TAB_MESSAGES_PAGE = 2;
const TAB_SETTINGS_PAGE = 3;
const TAB_MY_PAGE = 4;

export interface Props {
    rootState: RootState;
    onErrorMessage: (params: { message: string }) => StandardAction;
}

interface State {
    token: string;
    refreshToken: string;
    tabIndex: number;
}

class App extends React.Component<Props, State> {
    componentWillMount() {
        const queryParamsMap = parseQueryString(window.location.search);
        const token = valueOrDefault(queryParamsMap.get('token'));
        const refreshToken = valueOrDefault(queryParamsMap.get('refreshToken'));

        this.setState({
            token: token,
            refreshToken: refreshToken,
            tabIndex: 0,
        });

        if (token === '' || refreshToken === '') {
            // window.location.href = 'http://localhost:3004' + '?from=' + encodeURIComponent(window.location.href);
            return;
        }
    }

    renderErrorMessage() {
        return (
            <Dialog open={this.props.rootState.errorMessage != null}>
                <DialogTitle>发生了错误</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.rootState.errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            this.props.onErrorMessage({message: ''});
                        }}
                        color="primary"
                        autoFocus={true}
                    >
                        我知道了
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderLoginFrame() {
        return (
            <div>
                <iframe></iframe>
            </div>
        );
    }

    render() {
        if (this.state.token === '') {
            return this.renderLoginFrame();
        }

        const tabStyle: CSSProperties = {
            width: '20%',
            height: '30px',
        };

        return (
            <div>
                <div
                    style={{
                        width: '100%',
                        height: '48px',
                        backgroundColor: '#333',
                        color: '#FFF'}}
                >
                    <label
                        style={{
                            textAlign: 'center',
                            float: 'center',
                            display: 'block',
                            fontSize: '200%',
                        }}
                    >
                        Buffet助理
                    </label>
                </div>
                <div style={{marginRight: 'auto', marginLeft: 'auto'}}>
                    <Tabs
                        value={this.state.tabIndex}
                        onChange={(event: {}, v: number) => {
                            this.setState({tabIndex: v});
                        }}
                    >
                        <Tab style={tabStyle} label={'股票'}/>
                        <Tab style={tabStyle} label={'指标'}/>
                        <Tab style={tabStyle} label={'消息'}/>
                        <Tab style={tabStyle} label={'设置'}/>
                        <Tab style={tabStyle} label={'我的'}/>
                    </Tabs>
                </div>
                <div>
                    {this.state.tabIndex === TAB_STOCKS_PAGE && <StocksPage/>}
                    {this.state.tabIndex === TAB_INDEX_MANAGE_PAGE && <IndexManagePage/>}
                    {this.state.tabIndex === TAB_MESSAGES_PAGE && <MessagesPage/>}
                    {this.state.tabIndex === TAB_SETTINGS_PAGE && <SettingsPage/>}
                    {this.state.tabIndex === TAB_MY_PAGE && <MyPage/>}
                </div>
                {this.renderErrorMessage()}
            </div>
        );
    }
}

function selectProps(rootState: RootState) {
    return {rootState};
}

export default connect(selectProps, {
    onErrorMessage,
})(App);