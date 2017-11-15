import * as React from 'react'

import List,{ ListItem } from 'material-ui/List';
import Button from 'material-ui/Button'
import {StockIndexAdvice, UserStockIndex} from "../apis/StockAssistant/gen/api";
import {
    apiUserStockIndexList, RootState, apiUserStockIndexAdd, apiUserStockIndexUpdate,
    apiUserStockIndexDelete, apiUserStockIndexRename,apiStockIndexAdviceList, User
} from "../redux";
import {connect} from "react-redux";
import IndexEditDialog from "./components/IndexEditDialog";

export interface Props {
    user: User,
    userStockIndexList: Array<UserStockIndex>
    stockIndexAdviceList:Array<StockIndexAdvice>
    apiUserStockIndexList: any
    apiUserStockIndexAdd: any
    apiUserStockIndexUpdate: any
    apiUserStockIndexDelete: any
    apiUserStockIndexRename: any
    apiStockIndexAdviceList: (userId:string,pageToken:string,pageSize:number)=>any
}

interface State {
    indexEditing: UserStockIndex,
    editing: boolean
    adding: boolean
}

class IndexManagePage extends React.Component<Props,State> {

    componentWillMount() {
        this.setState({
            indexEditing: {},
            editing: false,
            adding: false
        });

        this.props.apiUserStockIndexList(this.props.user.id);
        this.props.apiStockIndexAdviceList(this.props.user.id, "", 40);
    }

    renderMyIndex(userStockIndex: UserStockIndex) {
        return (
            <ListItem key={userStockIndex.name} style={{height: "15px"}} divider={true}>
                <label style={{width: "30%", paddingLeft: "5%", textAlign: "left"}}>
                    {userStockIndex.name}
                </label>
                <label style={{width: "15%", textAlign: "left"}}>
                    {userStockIndex.evalWeight ? userStockIndex.evalWeight : 0}
                </label>
                <label style={{width: "10%", textAlign: "left"}}>
                    {userStockIndex.aiWeight ? userStockIndex.aiWeight : 0}
                </label>
                <Button dense={true} onClick={() => {
                    this.setState({
                        editing: true,
                        adding: false,
                        indexEditing: {
                            name: userStockIndex.name,
                            evalWeight: userStockIndex.evalWeight ? userStockIndex.evalWeight : 0,
                            aiWeight: userStockIndex.aiWeight ? userStockIndex.aiWeight : 0
                        }
                    })
                }}>
                    修改
                </Button>
                <Button dense={true} onClick={() => {
                    this.props.apiUserStockIndexDelete(this.props.user.id, userStockIndex.name)
                }}>
                    删除
                </Button>
            </ListItem>
        )
    }

    renderAIIndex(stockIndexAdvice: StockIndexAdvice) {
        return (
            <ListItem key={stockIndexAdvice.indexName} style={{height: "15px"}}>
                <label
                    style={{paddingLeft: "20px", width: "20%", textAlign: "left"}}>{stockIndexAdvice.indexName}</label>
                <label style={{width: "20%", textAlign: "center"}}>{stockIndexAdvice.usedCount}</label>
                <Button style={{float: "right"}}
                        dense={true}
                        disabled={stockIndexAdvice.haveUsed}
                        onClick={() => {
                            this.props.apiUserStockIndexAdd(this.props.user.id, {
                                name: stockIndexAdvice.indexName,
                                evalWeight: 0,
                                aiWeight: 0
                            })
                        }}>
                    {stockIndexAdvice.haveUsed ? "已使用" : "使用"}
                </Button>
            </ListItem>
        )
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%", backgroundColor: "#FFF"}}>
                <div style={{width: "50%", height: "100%", float: "left"}}>
                    <div style={{height: "40px", paddingLeft: "20px", paddingTop: "20px"}}>
                        <label style={{float: "left", fontSize: "x-large"}}>我的指标</label>
                        <Button style={{float: "right"}} onClick={() => {
                            this.setState({editing: true, adding: true, indexEditing: {}})
                        }}>
                            <label>新增</label>
                        </Button>
                    </div>
                    <List>
                        {this.props.userStockIndexList
                        && this.props.userStockIndexList.map(this.renderMyIndex.bind(this))}
                    </List>
                </div>
                <div style={{width: "50%", height: "100%", float: "left"}}>
                    <div style={{height: "40px", paddingLeft: "20px", paddingTop: "20px"}}>
                        <label style={{float: "left", fontSize: "x-large"}}>AI推荐</label>
                    </div>
                    <List>
                        {this.props.stockIndexAdviceList
                        && this.props.stockIndexAdviceList.map(this.renderAIIndex.bind(this))}
                    </List>
                </div>
                {this.state.editing &&
                <IndexEditDialog adding={this.state.adding} indexEditing={this.state.indexEditing}
                                 onCancel={() => {
                                     this.setState({editing: false})
                                 }}
                                 onIndexSave={(adding: boolean, e: UserStockIndex, nameOld?: string) => {
                                     this.setState({editing: false})
                                     if (adding) {
                                         this.props.apiUserStockIndexAdd(this.props.user.id, e)
                                     } else {
                                         if (e.name === nameOld) {
                                             this.props.apiUserStockIndexUpdate(this.props.user.id, e)
                                         } else {
                                             this.props.apiUserStockIndexRename(this.props.user.id, nameOld, e.name)
                                             this.props.apiUserStockIndexUpdate(this.props.user.id, e)
                                         }
                                     }
                                 }}/>}
            </div>
        )
    }
}

function selectProps(rootState:RootState) {
    return {
        user: rootState.user,
        userStockIndexList: rootState.userStockIndexList,
        stockIndexAdviceList:rootState.stockIndexAdviceList
    }
}

export default connect(selectProps,{
    apiUserStockIndexList,
    apiUserStockIndexAdd,
    apiUserStockIndexUpdate,
    apiUserStockIndexDelete,
    apiUserStockIndexRename,
    apiStockIndexAdviceList
})(IndexManagePage);