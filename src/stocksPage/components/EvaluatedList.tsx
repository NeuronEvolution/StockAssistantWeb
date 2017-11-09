import * as React from 'react'
import List,{ ListItem } from 'material-ui/List';
import {UserStockEvaluate} from "../../apis/StockAssistant/gen/api";
import Button from 'material-ui/Button'
import './EvaluatedList.css'

export interface Props {
    evaluatedList:Array<UserStockEvaluate>
}

interface State{

}

export default class EvaluatedList extends React.Component<Props,State> {
    renderItem(e: UserStockEvaluate) {
        return (
            <ListItem key={e.stockId} button={true} divider={true}>
                <label className="EvaluatedList-StockCode">{e.stockCode}</label>
                <label className="EvaluatedList-StockName">{e.stockNameCN}</label>
                <label className="EvaluatedList-IndustryName">{e.industryName}</label>
                <label className="EvaluatedList-TotalScore">{e.totalScore}</label>
            </ListItem>
        )
    }

    render() {
        return (
            <List>
                {this.props.evaluatedList &&
                this.props.evaluatedList.map(this.renderItem.bind(this))}
                <ListItem className="EvaluatedList-More">
                    <Button className="EvaluatedList-MoreButton">
                        更多
                    </Button>
                </ListItem>
            </List>
        )
    }
}