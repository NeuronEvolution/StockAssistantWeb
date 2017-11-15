import * as React from 'react'
import List,{ ListItem } from 'material-ui/List';
import {UserStockEvaluate} from "../../apis/StockAssistant/gen/api";
import Button from 'material-ui/Button'
import {isUndefined} from "util";

export interface Props {
    indexCount:number
    evaluatedList:Array<UserStockEvaluate>
    openEvaluateDialog:(stockId:string)=>void
}

interface State{
}

export default class EvaluatedList extends React.Component<Props,State> {
    renderItem(e: UserStockEvaluate) {
        if (isUndefined(e.stockId)) {
            return null
        }

        let stockId = e.stockId ? e.stockId : ""

        return (
            <ListItem key={e.stockId} button={true} divider={true} onClick={() => {
                this.props.openEvaluateDialog(stockId)
            }}>
                <label style={{width: '20%', textAlign: 'left'}}>{e.stockCode}</label>
                <label style={{width: '20%', textAlign: 'left'}}>{e.stockNameCN}</label>
                <label style={{width: '20%', textAlign: 'left'}}>{e.industryName}</label>
                <label style={{width: '20%', textAlign: 'left'}}>{e.totalScore}</label>
                <label style={{width: '10%', textAlign: 'left'}}>{e.indexCount}/{this.props.indexCount}</label>
            </ListItem>
        )
    }

    render() {
        return (
            <List>
                {this.props.evaluatedList &&
                this.props.evaluatedList.map(this.renderItem.bind(this))}
                <ListItem style={{width: '100%', height: '100%'}}>
                    <Button style={{width: '100%', height: '100%'}}>
                        更多
                    </Button>
                </ListItem>
            </List>
        )
    }
}