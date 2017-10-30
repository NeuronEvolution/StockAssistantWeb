import * as React from 'react'
import "./StocksPage.css"
import List, { ListItem } from 'material-ui/List';
import Button from 'material-ui/Button'
import {UserStockEvaluate} from "../apis/StockAssistant/gen/api";
import Tabs, { Tab } from 'material-ui/Tabs';

export interface Props {
    stockEvaluateList: Array<UserStockEvaluate>
    notEvaluatedList: Array<UserStockEvaluate>
    apiNotEvaluatedList:any
    apiStockEvaluatedList:any
}

interface State {
    controlTabIndex: number
}

export default class StocksPage extends React.Component<Props,State> {
    componentWillMount() {
        this.setState({controlTabIndex: 0})
    }

     renderEvaluatedItem(stockEvaluate: UserStockEvaluate) {
        return (
            <ListItem key={stockEvaluate.stockId} button={true} divider={true}>
                <label>{stockEvaluate.stockCode}</label>
                <label>{stockEvaluate.stockNameCN}</label>
                <label>{stockEvaluate.industryName}</label>
                <label>{stockEvaluate.totalScore}</label>
            </ListItem>
        )
    }

    renderNotEvaluatedItem(stockEvaluate: UserStockEvaluate) {
        return (
            <ListItem key={stockEvaluate.stockId} button={true} divider={true}>
                <label className="StocksPage-StockListItem-NotEvaluated-StockCode">{stockEvaluate.stockCode}</label>
                <label className="StocksPage-StockListItem-NotEvaluated-StockName">{stockEvaluate.stockNameCN}</label>
                <label className="StocksPage-StockListItem-NotEvaluated-IndustryName">{stockEvaluate.industryName}</label>
                <div className="StocksPage-StockListItem-NotEvaluated-EvaluateButtonDiv">
                    <Button className="StocksPage-StockListItem-NotEvaluated-EvaluateButton">立即评估</Button>
                </div>
            </ListItem>
        )
    }

    render() {
        return (
            <div className="StocksPage">
                <Tabs className="StocksPage-ControlTab" value={this.state.controlTabIndex}
                      onChange={(event: any, v: any) => {
                          this.setState({controlTabIndex: v})
                          switch (v){
                              case 0:
                                  this.props.apiStockEvaluatedList("18616781549")
                                  break;
                              case 1:
                                  this.props.apiNotEvaluatedList("18616781549")
                                  break;
                              case 2:
                                  break;
                              default:
                                  console.error("default case")
                          }
                      }}>
                    <Tab className="StocksPage-ControlTabItem" label="已评估"/>
                    <Tab className="StocksPage-ControlTabItem" label="未评估"/>
                    <Tab className="StocksPage-ControlTabItem" label="AI评估"/>
                </Tabs>
                {this.state.controlTabIndex == 0 &&
                <div className="StocksPage-ControlPanel">
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">总评分</Button>
                    </div>
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">评估时间</Button>
                    </div>
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">上市时间</Button>
                    </div>
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">筛选</Button>
                    </div>
                </div>}
                {this.state.controlTabIndex == 1 &&
                <div className="StocksPage-ControlPanel">
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">筛选</Button>
                    </div>
                </div>}
                {this.state.controlTabIndex == 2 &&
                <div className="StocksPage-ControlPanel">
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">筛选</Button>
                    </div>
                </div>}

                <div className="StocksPage-Divider"/>
                <List className="StocksPage-StockList">
                    {this.state.controlTabIndex == 0 && this.props.stockEvaluateList &&
                    this.props.stockEvaluateList.map(this.renderEvaluatedItem.bind(this))}
                    {this.state.controlTabIndex == 1 && this.props.notEvaluatedList &&
                    this.props.notEvaluatedList.map(this.renderNotEvaluatedItem.bind(this))}
                </List>
            </div>
        )
    }
}