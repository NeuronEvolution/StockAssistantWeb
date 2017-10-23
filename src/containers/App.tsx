import * as React from 'react';
import './App.css';
import List, { ListItem } from 'material-ui/List';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="App-Inner">
                    <div className="App-LeftPanel">
                        <div className="App-LeftPanel-Header">
                            <span className="App-LeftPanel-Header-Name"> <label>巴菲特</label></span>
                        </div>
                        <hr className="App-LeftPanel-Divider" color={"#444"}/>
                        <List>
                            <ListItem  key={"messages"} button={true} divider={true}>
                                <label className="App-LeftPanel-Menu-Item-Text">消息</label>
                            </ListItem>
                            <ListItem key={"stocks"} button={true} divider={true}>
                                <label className="App-LeftPanel-Menu-Item-Text">股票</label>
                            </ListItem>
                            <ListItem key={"settings"} button={true} divider={true}>
                                <label className="App-LeftPanel-Menu-Item-Text">设置</label>
                            </ListItem>
                            <ListItem key={"my"} button={true} divider={true}>
                                <label className="App-LeftPanel-Menu-Item-Text">我的</label>
                            </ListItem>
                        </List>
                    </div>
                    <div className="App-Content">
                        aaa
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
