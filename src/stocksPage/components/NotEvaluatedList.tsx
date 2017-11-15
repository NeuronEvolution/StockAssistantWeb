import * as React from 'react'
import List,{ ListItem } from 'material-ui/List';
import {UserStockEvaluate} from "../../apis/StockAssistant/gen/api";
import Button from 'material-ui/Button'
import './NotEvaluatedList.css'

export interface Props {
    notEvaluatedList:Array<UserStockEvaluate>
    openEvaluateDialog:(stockId:string)=>void
}

interface State{

}

export default class NotEvaluatedList extends React.Component<Props,State> {
    renderItem(e: UserStockEvaluate) {
        if (e.stockId == null) {
            return null
        }

        let stockId = e.stockId ? e.stockId : "";

        return (
            <ListItem key={e.stockId} button={true} divider={true} onClick={() => {
                this.props.openEvaluateDialog(stockId)
            }}>
                <label className="NotEvaluatedList-StockCode">{e.stockCode}</label>
                <label className="NotEvaluatedList-StockName">{e.stockNameCN}</label>
                <label className="NotEvaluatedList-IndustryName">{e.industryName}</label>
                <div className="NotEvaluatedList-EvaluateButtonDiv">
                    <Button className="NotEvaluatedList-EvaluateButton" onClick={() => {
                        this.props.openEvaluateDialog(stockId)
                    }}>
                        立即评估
                    </Button>
                </div>
            </ListItem>
        )
    }

    render() {
        return (
            <List>
                {this.props.notEvaluatedList &&
                this.props.notEvaluatedList.map(this.renderItem.bind(this))}
                <ListItem className="NotEvaluatedList-More">
                    <Button className="NotEvaluatedList-MoreButton">
                        更多
                    </Button>
                </ListItem>
            </List>
        )
    }
}