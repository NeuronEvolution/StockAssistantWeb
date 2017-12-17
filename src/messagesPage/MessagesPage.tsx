import * as React from 'react';
import List, { ListItem } from 'material-ui/List';

export default class MessagesPage extends React.Component {
    render() {
        return (
            <div>
                <List>
                    <ListItem key={'system'} button={true} divider={true}>
                        <span><label>系统</label></span>
                    </ListItem>
                    <ListItem key={'notify'} button={true} divider={true}>
                        <span><label>提醒</label></span>
                    </ListItem>
                    <ListItem key={'order'} button={true} divider={true}>
                        <span><label>交易</label></span>
                    </ListItem>
                    <ListItem key={'news'} button={true} divider={true}>
                        <span><label>新闻</label></span>
                    </ListItem>
                    <ListItem key={'friend'} button={true} divider={true}>
                        <span><label>好友</label></span>
                    </ListItem>
                </List>
            </div>
        );
    }
}