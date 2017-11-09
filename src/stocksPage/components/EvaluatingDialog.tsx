import * as React from 'react'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import List,{ ListItem } from 'material-ui/List';
import {UserIndexEvaluate} from "../../apis/StockAssistant/gen/api";
import Radio from 'material-ui/Radio';
import Button from 'material-ui/Button'

export interface Props {
    indexEvaluatingList?: Array<UserIndexEvaluate>
    onEvalDialogClose: () => void
    onEvalStarsChange: (indexName: string, evalStars: number) => void
}

interface State{

}

export default class EvaluatingDialog extends React.Component<Props,State> {
    renderIndexEvaluateItem(userIndexEvaluate: UserIndexEvaluate) {
        console.log(userIndexEvaluate)
        let indexName = userIndexEvaluate.indexName ? userIndexEvaluate.indexName : ""
        return (
            <ListItem key={userIndexEvaluate.indexName}>
                <label>{userIndexEvaluate.indexName}</label>
                <Radio checked={userIndexEvaluate.evalStars == 1} value="1" onChange={(event) => {
                    this.props.onEvalStarsChange(indexName, 1)
                }}/>
                <Radio checked={userIndexEvaluate.evalStars == 2} value="2" onChange={(event) => {
                    this.props.onEvalStarsChange(indexName, 2)
                }}/>
                <Radio checked={userIndexEvaluate.evalStars == 3} value="3" onChange={(event) => {
                    this.props.onEvalStarsChange(indexName, 3)
                }}/>
                <Radio checked={userIndexEvaluate.evalStars == 4} value="4" onChange={(event) => {
                    this.props.onEvalStarsChange(indexName, 4)
                }}/>
            </ListItem>
        )
    }

    render() {
        return (
            <Dialog open={true}>
                <DialogTitle>评估</DialogTitle>
                <DialogContent>
                    <div className="StocksPage-EvaluatingDialog-div">
                        <List>
                            {this.props.indexEvaluatingList &&
                            this.props.indexEvaluatingList.map(this.renderIndexEvaluateItem.bind(this))}
                        </List>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.props.onEvalDialogClose()
                    }}>确定</Button>
                </DialogActions>
            </Dialog>
        )
    }
}