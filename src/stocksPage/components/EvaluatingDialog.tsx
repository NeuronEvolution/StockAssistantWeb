import * as React from 'react'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import List,{ ListItem } from 'material-ui/List';
import {Stock, StockUrl, UserIndexEvaluate} from "../../apis/StockAssistant/gen/api";
import Radio from 'material-ui/Radio';
import Button from 'material-ui/Button'
import {isUndefined} from "util";

export interface Props {
    stock?:Stock
    indexEvaluatingList?: Array<UserIndexEvaluate>
    onEvalDialogClose: () => void
    onEvalStarsChange: (indexName: string, evalStars: number) => void
}

interface State{

}

export default class EvaluatingDialog extends React.Component<Props,State> {

    renderStockUrl(stockUrl: StockUrl) {
        if (isUndefined(stockUrl.url)) {
            return null
        }
        let url = stockUrl.url;
        if (!stockUrl.url.startsWith("http")) {
            url = "http://" + stockUrl.url
        }

        return (
            <a key={stockUrl.name} href={url} target={"_blank"}>
                <label style={{paddingLeft: "1%", paddingRight: "1%", display: "inline-block"}}>{stockUrl.name}</label>
            </a>
        )
    }

    renderIndexEvaluateItem(e: UserIndexEvaluate) {
        if (isUndefined(e.indexName)) {
            return null;
        }
        const indexName = e.indexName;
        const discardStars = -10000

        return (
            <ListItem style={{height: "5px"}} key={e.indexName} divider={true}>
                <label key={"indexName"} style={{width: "32%", textAlign: "left"}}>{e.indexName}</label>
                <Radio key={"discard"} style={{width: "8%", color: "red"}} checked={e.evalStars == discardStars}
                       value={discardStars.toString()} onChange={() => {
                    this.props.onEvalStarsChange(indexName, discardStars)
                }}
                />
                {[1, 2, 3, 4, 5].map((i) => {
                    const iString = i.toString();
                    return (
                        <Radio key={"stars_" + iString} style={{width: "8%"}}
                               checked={e.evalStars == i} value={iString}
                               onChange={() => {
                                   this.props.onEvalStarsChange(indexName, i)
                               }}/>
                    )
                })}
                {e.evalStars == -1
                    ? <label style={{fontSize: "xx-small"}}>未评估</label>
                    : <label style={{fontSize: "xx-small"}}>{e.evalStars}分</label>}
            </ListItem>
        )
    }

    render() {
        return (
            <Dialog open={true}>
                <DialogTitle>{this.props.stock && (this.props.stock.stockNameCN + "(股票代码 " + this.props.stock.stockCode + ")")}</DialogTitle>
                <DialogContent>
                    <div style={{width: "600px"}}>
                        <List style={{width: "50%", float: "left"}}>
                            {this.props.indexEvaluatingList &&
                            this.props.indexEvaluatingList.map(this.renderIndexEvaluateItem.bind(this))}
                        </List>
                        <div style={{width: "50%", float: "left"}}>
                            <div style={{width: "100%", height: "1px", backgroundColor: "#666"}}/>
                            {this.props.stock &&
                            (this.props.stock.stockUrlList
                                && this.props.stock.stockUrlList.map(this.renderStockUrl.bind(this)))}
                            <div style={{width: "100%", height: "1px", backgroundColor: "#666"}}/>
                        </div>
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