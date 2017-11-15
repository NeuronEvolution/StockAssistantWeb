import * as React from 'react'
import "./StocksPage.css"
import Button from 'material-ui/Button'
import {Stock, UserIndexEvaluate, UserStockEvaluate, UserStockIndex} from "../apis/StockAssistant/gen/api";
import Tabs, { Tab } from 'material-ui/Tabs';
import {apiUserStockIndexList,apiNotEvaluatedList, apiStockEvaluateList,apiUserIndexEvaluateList,apiUserIndexEvaluateSave,apiStockGet, RootState, User} from "../redux";
import {connect} from "react-redux";
import EvaluatedList from "./components/EvaluatedList";
import NotEvaluatedList from "./components/NotEvaluatedList";
import EvaluatingDialog from "./components/EvaluatingDialog";

const TAB_INDEX_EVALUATED=0
const TAB_INDEX_NOT_EVALUATED=1
const TAB_INDEX_AI_EVALUATE=2

interface Props {
    user: User
    stockEvaluateList: Array<UserStockEvaluate>
    notEvaluatedList: Array<UserStockEvaluate>
    userStockIndexList: Array<UserStockIndex>
    userIndexEvaluateListMap: Map<string, Array<UserIndexEvaluate>>
    stockMap:Map<string,Stock>

    apiUserStockIndexList:(userId: string) => any
    apiNotEvaluatedList: (userId: string) => any
    apiStockEvaluateList: (userId: string) => any
    apiUserIndexEvaluateList: (userId: string,stockId:string) => any,
    apiUserIndexEvaluateSave: (userId:string,stockId:string,indexName:string,evalStars:number)=>any
    apiStockGet:(stockId:string)=>any
}

interface State {
    controlTabIndex: number
    evaluating: boolean
    evaluatingStockId:string
}

class StocksPage extends React.Component<Props,State> {
    componentWillMount() {
        this.setState({controlTabIndex: 0, evaluating: false})

        this.props.apiStockEvaluateList(this.props.user.id)
        this.props.apiUserStockIndexList(this.props.user.id)
    }

    openEvaluateDialog(stockId: string): void {
        this.setState({evaluating: true, evaluatingStockId: stockId})

        this.props.apiUserIndexEvaluateList(this.props.user.id, stockId)
        this.props.apiStockGet(stockId)
    }

    onEvalStarsChange(indexName: string, evalStars: number) {
        this.props.apiUserIndexEvaluateSave(this.props.user.id, this.state.evaluatingStockId, indexName, evalStars)
    }

    onEvalDialogClose() {
        this.setState({evaluating: false})

        switch (this.state.controlTabIndex) {
            case TAB_INDEX_EVALUATED:
                this.props.apiStockEvaluateList(this.props.user.id)
                break;
            case TAB_INDEX_NOT_EVALUATED:
                this.props.apiNotEvaluatedList(this.props.user.id)
                break;
            case TAB_INDEX_AI_EVALUATE:
                break;
            default:
                break;
        }
    }

    render() {
        console.log(this.props.userStockIndexList)
        let userIndexEvaluateList = this.props.userIndexEvaluateListMap.get(this.state.evaluatingStockId)
        let stock=this.props.stockMap.get(this.state.evaluatingStockId)
        return (
            <div className="StocksPage">
                <Tabs className="StocksPage-ControlTab" value={this.state.controlTabIndex}
                      onChange={(event: any, v: any) => {
                          this.setState({controlTabIndex: v})
                          switch (v) {
                              case TAB_INDEX_EVALUATED:
                                  this.props.apiStockEvaluateList(this.props.user.id)
                                  break;
                              case TAB_INDEX_NOT_EVALUATED:
                                  this.props.apiNotEvaluatedList(this.props.user.id)
                                  break;
                              case TAB_INDEX_AI_EVALUATE:
                                  break;
                              default:
                                  console.error("default case")
                          }
                      }}>
                    <Tab className="StocksPage-ControlTabItem" label="已评估"/>
                    <Tab className="StocksPage-ControlTabItem" label="未评估"/>
                    <Tab className="StocksPage-ControlTabItem" label="AI评估"/>
                </Tabs>
                {this.state.controlTabIndex == TAB_INDEX_EVALUATED &&
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
                {this.state.controlTabIndex == TAB_INDEX_NOT_EVALUATED &&
                <div className="StocksPage-ControlPanel">
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">筛选</Button>
                    </div>
                </div>}
                {this.state.controlTabIndex == TAB_INDEX_AI_EVALUATE &&
                <div className="StocksPage-ControlPanel">
                    <div className="StocksPage-ControlPanel-ItemDiv">
                        <Button className="StocksPage-ControlPanel-Button">筛选</Button>
                    </div>
                </div>}
                <div className="StocksPage-Divider"/>
                {this.state.controlTabIndex == TAB_INDEX_EVALUATED &&
                <EvaluatedList evaluatedList={this.props.stockEvaluateList}
                               openEvaluateDialog={this.openEvaluateDialog.bind(this)}
                               indexCount={this.props.userStockIndexList ? this.props.userStockIndexList.length : 0}/>}
                {this.state.controlTabIndex == TAB_INDEX_NOT_EVALUATED &&
                <NotEvaluatedList notEvaluatedList={this.props.notEvaluatedList}
                                  openEvaluateDialog={this.openEvaluateDialog.bind(this)}/>}
                {this.state.controlTabIndex == TAB_INDEX_AI_EVALUATE && null}
                {this.state.evaluating &&
                <EvaluatingDialog indexEvaluatingList={userIndexEvaluateList} stock={stock}
                                  onEvalDialogClose={this.onEvalDialogClose.bind(this)}
                                  onEvalStarsChange={this.onEvalStarsChange.bind(this)}/>}
            </div>
        )
    }
}

function selectProps(rootState:RootState) {
    return {
        user:rootState.user,
        stockEvaluateList: rootState.stockEvaluateList,
        notEvaluatedList: rootState.notEvaluatedList,
        userStockIndexList:rootState.userStockIndexList,
        userIndexEvaluateListMap:rootState.userIndexEvaluateListMap,
        stockMap:rootState.stockMap
    }
}

export default connect(selectProps,{
    apiUserStockIndexList,
    apiNotEvaluatedList,
    apiStockEvaluateList,
    apiUserIndexEvaluateList,
    apiUserIndexEvaluateSave,
    apiStockGet,
})(StocksPage)