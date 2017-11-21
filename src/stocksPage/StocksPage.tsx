import * as React from 'react'
import "./StocksPage.css"
import Button from 'material-ui/Button'
import {Stock, UserIndexEvaluate, UserStockIndex} from "../apis/StockAssistant/gen/api";
import Tabs, { Tab } from 'material-ui/Tabs';
import {
    apiUserStockIndexList,  apiUserStockEvaluateList, apiUserIndexEvaluateList,
    apiUserIndexEvaluateSave, apiStockGet, RootState, User, UserStockEvaluatedListState
} from "../redux";
import {connect} from "react-redux";
import EvaluatedList from "./components/EvaluatedList";
import NotEvaluatedList from "./components/NotEvaluatedList";
import EvaluatingDialog from "./components/EvaluatingDialog";

const TAB_INDEX_EVALUATED=0
const TAB_INDEX_NOT_EVALUATED=1
const TAB_INDEX_AI_EVALUATE=2

interface Props {
    user: User
    userStockEvaluatedListState: UserStockEvaluatedListState
    userStockIndexList: Array<UserStockIndex>
    userIndexEvaluateListMap: Map<string, Array<UserIndexEvaluate>>
    stockMap: Map<string, Stock>

    apiUserStockIndexList: (userId: string) => any
    apiUserStockEvaluateList: (params: { userId: string, notEvaluated?: boolean, pageToken?: string, pageSize?: number, sort?: string }) => any
    apiUserIndexEvaluateList: (userId: string, stockId: string) => any,
    apiUserIndexEvaluateSave: (userId: string, stockId: string, indexName: string, evalStars: number) => any
    apiStockGet: (stockId: string) => any
}

interface State {
    controlTabIndex: number
    evaluating: boolean
    evaluatingStockId:string
}

class StocksPage extends React.Component<Props,State> {
    componentWillMount() {
        this.setState({controlTabIndex: 0, evaluating: false})

        this.props.apiUserStockEvaluateList({userId: this.props.user.id, pageToken: "", pageSize: 40})
        this.props.apiUserStockIndexList(this.props.user.id)
    }

    refreshStockEvaluateList(notEvaluated?: boolean) {
        this.props.apiUserStockEvaluateList({
            userId: this.props.user.id,
            notEvaluated: notEvaluated,
            pageToken: "",
            pageSize: 40
        })
    }

    openEvaluateDialog(stockId: string): void {
        this.setState({evaluating: true, evaluatingStockId: stockId});

        this.props.apiUserIndexEvaluateList(this.props.user.id,stockId)

        this.props.apiStockGet(stockId)
    }

    onEvalStarsChange(indexName: string, evalStars: number) {
        this.props.apiUserIndexEvaluateSave(this.props.user.id, this.state.evaluatingStockId, indexName, evalStars)
    }

    onEvalDialogClose() {
        this.setState({evaluating: false});

        switch (this.state.controlTabIndex) {
            case TAB_INDEX_EVALUATED:
                this.refreshStockEvaluateList()
                break;
            case TAB_INDEX_NOT_EVALUATED:
                this.refreshStockEvaluateList(true)
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
        let stock = this.props.stockMap.get(this.state.evaluatingStockId)
        return (
            <div className="StocksPage">
                <Tabs className="StocksPage-ControlTab" value={this.state.controlTabIndex}
                      onChange={(event: any, v: any) => {
                          this.setState({controlTabIndex: v});
                          switch (v) {
                              case TAB_INDEX_EVALUATED:
                                  this.refreshStockEvaluateList()
                                  break;
                              case TAB_INDEX_NOT_EVALUATED:
                                  this.refreshStockEvaluateList(true)
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
                <EvaluatedList state={this.props.userStockEvaluatedListState}
                               openEvaluateDialog={this.openEvaluateDialog.bind(this)}
                               indexCount={this.props.userStockIndexList ? this.props.userStockIndexList.length : 0}
                               onLoadMore={() => {
                                   this.props.apiUserStockEvaluateList({
                                       userId: this.props.user.id,
                                       pageToken: this.props.userStockEvaluatedListState.nextPageToken,
                                       pageSize: 40
                                   })
                               }}/>}
                {this.state.controlTabIndex == TAB_INDEX_NOT_EVALUATED &&
                <NotEvaluatedList state={this.props.userStockEvaluatedListState}
                                  openEvaluateDialog={this.openEvaluateDialog.bind(this)}
                                  onLoadMore={() => {
                                      this.props.apiUserStockEvaluateList({
                                          userId: this.props.user.id,
                                          notEvaluated: true,
                                          pageToken: this.props.userStockEvaluatedListState.nextPageToken,
                                          pageSize: 40
                                      })
                                  }}/>}
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
        userStockEvaluatedListState: rootState.userStockEvaluatedListState,
        userStockIndexList:rootState.userStockIndexList,
        userIndexEvaluateListMap:rootState.userIndexEvaluateListMap,
        stockMap:rootState.stockMap
    }
}

export default connect(selectProps,{
    apiUserStockIndexList,
    apiUserStockEvaluateList,
    apiUserIndexEvaluateList,
    apiUserIndexEvaluateSave,
    apiStockGet,
})(StocksPage)