import * as React from 'react'
import List,{ ListItem } from 'material-ui/List';
import {UserStockEvaluate} from "../../apis/StockAssistant/gen/api";
import Button from 'material-ui/Button'
import {isUndefined} from "util";
import {UserStockEvaluatedListState} from "../../redux";

export interface Props {
    state: UserStockEvaluatedListState
    onLoadMore: () => any
    openEvaluateDialog: (stockId: string) => void
    indexCount: number
}

export default class EvaluatedList extends React.Component<Props> {
    renderItem(e: UserStockEvaluate) {
        if (isUndefined(e.stockId)) {
            return null
        }

        let stockId = e.stockId ? e.stockId : "";

        return (
            <ListItem key={e.stockId} button={true} divider={true} style={{height:"20px"}} onClick={() => {
                this.props.openEvaluateDialog(stockId)
            }}>
                <label style={{width: '20%', textAlign: 'left'}}>{e.stockCode}</label>
                <label style={{width: '20%', textAlign: 'left'}}>{e.stockNameCN}</label>
                <label style={{width: '20%', textAlign: 'left'}}>{e.industryName}</label>
                <label style={e.totalScore != null && e.totalScore < 0 ? {
                    width: '20%',
                    textAlign: 'left',
                    backgroundColor: "#DDD"
                } : {width: '20%', textAlign: 'left'}}>{e.totalScore}</label>
                <label style={{width: '10%', textAlign: 'left'}}>{e.indexCount}/{this.props.indexCount}</label>
            </ListItem>
        )
    }

    render() {
        const hasMore = this.props.state.nextPageToken && this.props.state.nextPageToken != ""
        return (
            <List>
                {this.props.state && this.props.state.items &&
                this.props.state.items.map(this.renderItem.bind(this))}
                <ListItem style={{width: '100%', height: '100%'}}>
                    <Button style={{width: '100%', height: '100%'}} disabled={!hasMore} onClick={
                        () => {
                            console.log("onLoadMore")
                            this.props.onLoadMore()
                        }}>
                        {hasMore ? "更多" : "没有更多了"}
                    </Button>
                </ListItem>
            </List>
        )
    }
}