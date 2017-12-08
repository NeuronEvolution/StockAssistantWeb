import * as React from 'react';
import List, { ListItem } from 'material-ui/List';
import { UserStockEvaluate } from '../../apis/StockAssistant/gen/api';
import Button from 'material-ui/Button';
import { UserStockEvaluatedListState } from '../../redux';

export interface Props {
    state: UserStockEvaluatedListState;
    onLoadMore: () => void;
    openEvaluateDialog: (stockId: string) => void;
}

export default class NotEvaluatedList extends React.Component<Props> {
    renderItem(e: UserStockEvaluate) {
        if (e.stockId == null) {
            return null;
        }

        let stockId = e.stockId ? e.stockId : '';

        return (
            <ListItem
                key={e.stockId}
                button={true}
                divider={true}
                style={{height: '20px'}}
                onClick={() => {
                    this.props.openEvaluateDialog(stockId);
                }}
            >
                <label style={{width: '25%', textAlign: 'left'}}>{e.stockCode}</label>
                <label style={{width: '25%', textAlign: 'left'}}>{e.stockNameCN}</label>
                <label style={{width: '25%', textAlign: 'left'}}>{e.industryName}</label>
                <div style={{width: '10%', height: '100%', float: 'right'}}>
                    <Button
                        style={{width: '100%', height: '100%', textAlign: 'center'}}
                        onClick={() => {
                            this.props.openEvaluateDialog(stockId);
                        }}
                    >
                        立即评估
                    </Button>
                </div>
            </ListItem>
        );
    }

    render() {
        const hasMore = this.props.state.nextPageToken && this.props.state.nextPageToken !== '';
        return (
            <List>
                {this.props.state && this.props.state.items &&
                this.props.state.items.map(this.renderItem.bind(this))}
                <ListItem style={{width: '100%', height: '100%'}}>
                    <Button
                        style={{width: '100%', height: '100%'}}
                        disabled={!hasMore}
                        onClick={
                            () => {
                                console.log('onLoadMore');
                                this.props.onLoadMore();
                            }
                        }
                    >
                        {hasMore ? '更多' : '没有更多了'}
                    </Button>
                </ListItem>
            </List>
        );
    }
}