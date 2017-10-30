import * as React from 'react';
import './App.css';
import List, { ListItem } from 'material-ui/List';
import MessagesPage from "./messagesPage/MessagesPage";
import StocksPage from "./stocksPage/StocksPage";
import SettingsPage from "./settingsPage/SettingsPage";
import MyPage from "./myPage/MyPage";
import {connect} from "react-redux";
import {
    onAppTabItemClick, APP_TAB_ITEM_CLICK_MESSAGES, APP_TAB_ITEM_CLICK_STOCKS, APP_TAB_ITEM_CLICK_SETTINGS,
    APP_TAB_ITEM_CLICK_MY,
    apiUserLogin, apiStockEvaluateList, apiNotEvaluatedList, RootState, APP_TAB_ITEM_CLICK_INDEX_MANAGE
} from "./redux";
import LoginPage from "./loginPage/LoginPage";
import IndexManagePage from "./indexManagePage/IndexManagePage";

export interface Props {
    rootState:RootState
    onAppTabItemClick: any
    apiUserLogin: any
    apiStockEvaluateList: any
    apiNotEvaluatedList:any
}

const STOCKS_PAGE_NAME="STOCKS_PAGE_NAME"
const INDEX_MANAGE_PAGE_NAME="INDEX_MANAGE_PAGE_NAME"
const MESSAGES_PAGE_NAME="MESSAGES_PAGE_NAME"
const SETTINGS_PAGE_NAME="SETTINGS_PAGE_NAME"
const MY_PAGE_NAME="MY_PAGE_NAME"

interface State{
    currentPageName:string
}

class App extends React.Component<Props,State> {
    constructor() {
        super()

        this.state = {
            currentPageName: STOCKS_PAGE_NAME
        }
    }

    componentDidMount() {
        this.props.apiStockEvaluateList(this.props.rootState.user.id)
    }

    render() {
        let content: JSX.Element
        switch (this.state.currentPageName) {
            case STOCKS_PAGE_NAME: {
                content = <StocksPage stockEvaluateList={this.props.rootState.stockEvaluateList}
                                      notEvaluatedList={this.props.rootState.notEvaluatedList}
                                      apiStockEvaluatedList={this.props.apiStockEvaluateList}
                                      apiNotEvaluatedList={this.props.apiNotEvaluatedList}/>;
                break;
            }
            case INDEX_MANAGE_PAGE_NAME: {
                content = <IndexManagePage/>
                break;
            }
            case MESSAGES_PAGE_NAME:
                content = <MessagesPage/>;
                break;
            case SETTINGS_PAGE_NAME:
                content = <SettingsPage/>;
                break;
            case MY_PAGE_NAME:
                content = <MyPage/>;
                break;
            default:
                console.error("default case")
                return <div/>
        }

        return (
            <div className="App">
                <div className="App-Inner">
                    <div className="App-LeftPanel">
                        <div className="App-LeftPanel-Header">
                            <span className="App-LeftPanel-Header-Name"> <label>巴菲特</label></span>
                        </div>
                        <div className="App-LeftPanel-Divider"/>
                        <List>
                            <ListItem key={"stocks"} button={true} divider={true} onClick={() => {
                                this.props.onAppTabItemClick(APP_TAB_ITEM_CLICK_STOCKS)
                                this.props.apiStockEvaluateList(this.props.rootState.user.id)
                                this.setState({currentPageName: STOCKS_PAGE_NAME})
                            }}>
                                <label className="App-LeftPanel-Menu-Item-Text">股票</label>
                            </ListItem>
                            <ListItem key={"indexManage"} button={true} divider={true} onClick={() => {
                                this.props.onAppTabItemClick(APP_TAB_ITEM_CLICK_INDEX_MANAGE)
                                this.setState({currentPageName: INDEX_MANAGE_PAGE_NAME})
                            }}>
                                <label className="App-LeftPanel-Menu-Item-Text">指标</label>
                            </ListItem>
                            <ListItem key={"messages"} button={true} divider={true} onClick={() => {
                                this.props.onAppTabItemClick(APP_TAB_ITEM_CLICK_MESSAGES)
                                this.setState({currentPageName: MESSAGES_PAGE_NAME})
                            }}>
                                <label className="App-LeftPanel-Menu-Item-Text">消息</label>
                            </ListItem>
                            <ListItem key={"settings"} button={true} divider={true} onClick={() => {
                                this.props.onAppTabItemClick(APP_TAB_ITEM_CLICK_SETTINGS)
                                this.setState({currentPageName: SETTINGS_PAGE_NAME})
                            }}>
                                <label className="App-LeftPanel-Menu-Item-Text">设置</label>
                            </ListItem>
                            <ListItem key={"my"} button={true} divider={true} onClick={() => {
                                this.props.onAppTabItemClick(APP_TAB_ITEM_CLICK_MY)
                                this.setState({currentPageName: MY_PAGE_NAME})
                            }}>
                                <label className="App-LeftPanel-Menu-Item-Text">我的</label>
                            </ListItem>
                        </List>
                    </div>
                    <div className="App-Content">
                        {content}
                    </div>
                    {
                        !this.props.rootState.session || !this.props.rootState.session.jwt ?
                            <div className="App-LoginPage-Container">
                                <LoginPage apiUserLogin={this.props.apiUserLogin}/>
                            </div> : null
                    }
                </div>
            </div>
        );
    };
}

function selectProps(rootState:RootState) {
    return {rootState}
}

export default connect(selectProps,
    {
        onAppTabItemClick,
        apiUserLogin,
        apiStockEvaluateList,
        apiNotEvaluatedList
    })(App);