import * as React from 'react'

import "./IndexManagePage.css"
import List,{ ListItem } from 'material-ui/List';
import Button from 'material-ui/Button'
import {StockIndexAdvice, UserStockIndex} from "../apis/StockAssistant/gen/api";
import {
    apiUserStockIndexList, RootState, apiUserStockIndexAdd, apiUserStockIndexUpdate,
    apiUserStockIndexDelete, apiUserStockIndexRename,apiStockIndexAdviceList, User
} from "../redux";
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import {connect} from "react-redux";

export interface Props {
    user: User,
    userStockIndexList: Array<UserStockIndex>
    stockIndexAdviceList:Array<StockIndexAdvice>
    apiUserStockIndexList: any
    apiUserStockIndexAdd: any
    apiUserStockIndexUpdate: any
    apiUserStockIndexDelete: any
    apiUserStockIndexRename: any
    apiStockIndexAdviceList: any
}

interface State {
    indexEditing: UserStockIndex,
    editing: boolean
    adding: boolean
    editingNameOld?: string
}

class IndexManagePage extends React.Component<Props,State> {

    componentWillMount() {
        this.setState({
            indexEditing: {},
            editing: false,
            adding: false
        });

        this.props.apiUserStockIndexList(this.props.user.id);
        this.props.apiStockIndexAdviceList("",40);
    }

    renderSaveDialog() {
        return (
            <Dialog open={this.state.editing}>
                <DialogTitle>{this.state.adding ? "新增" : "修改"}</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem key={"indexName"}>
                            <TextField id={"name"} className="IndexManagePage-Mine-List-Add-Name"
                                       label={"指标名称"} margin="normal"
                                       value={this.state.indexEditing.name && this.state.indexEditing.name}
                                       onChange={(e) => {
                                           let index = this.state.indexEditing
                                           index.name = e.target.value
                                           this.setState({indexEditing: index})
                                       }}/>
                        </ListItem>
                        <ListItem key={"evalWeight"}>
                            <TextField className="IndexManagePage-Mine-List-Add-Name"
                                       label={"该指标的权重"} margin="normal"
                                       value={this.state.indexEditing.evalWeight && this.state.indexEditing.evalWeight}
                                       onChange={(e) => {
                                           let index = this.state.indexEditing
                                           index.evalWeight = parseInt(e.target.value)
                                           this.setState({indexEditing: index})
                                       }}/>
                        </ListItem>
                        <ListItem key={"aiWeight"}>
                            <TextField className="IndexManagePage-Mine-List-Add-Name"
                                       label={"该指标中AI所占的比例"} margin="normal"
                                       value={this.state.indexEditing.aiWeight && this.state.indexEditing.aiWeight}
                                       onChange={(e) => {
                                           let index = this.state.indexEditing
                                           index.aiWeight = parseInt(e.target.value)
                                           this.setState({indexEditing: index})
                                       }}/>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.setState({editing: false})
                    }}>
                        取消
                    </Button>
                    <Button onClick={() => {
                        if (this.state.adding) {
                            this.props.apiUserStockIndexAdd(this.props.user.id, this.state.indexEditing)
                        } else {
                            if (this.state.indexEditing.name === this.state.editingNameOld) {
                                this.props.apiUserStockIndexUpdate(this.props.user.id, this.state.indexEditing)
                            } else {
                                console.log("rename ", this.state.indexEditing.name)
                                this.props.apiUserStockIndexRename(this.props.user.id, this.state.editingNameOld, this.state.indexEditing.name)
                            }
                        }
                        this.setState({editing: false})
                    }}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    renderMyIndex(userStockIndex: UserStockIndex) {
        return (
            <ListItem key={userStockIndex.name} className="IndexManagePage-Mine-ListItem" divider={true}>
                <label className="IndexManagePage-Mine-ListItem-Name">
                    {userStockIndex.name}
                </label>
                <label className="IndexManagePage-Mine-ListItem-EvalWeight">
                    {userStockIndex.evalWeight ? userStockIndex.evalWeight : 0}
                </label>
                <label className="IndexManagePage-Mine-ListItem-AIWeight">
                    {userStockIndex.aiWeight ? userStockIndex.aiWeight : 0}
                </label>
                <Button className="IndexManagePage-Mine-ListItem-Edit-button" dense={true} onClick={() => {
                    this.setState({
                        editing: true,
                        editingNameOld: userStockIndex.name,
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
                <Button className="IndexManagePage-Mine-ListItem-Delete-button" dense={true} onClick={() => {
                    this.props.apiUserStockIndexDelete(this.props.user.id, userStockIndex.name)
                }}>
                    删除
                </Button>
            </ListItem>
        )
    }

    renderAIIndex(stockIndexAdvice: StockIndexAdvice) {
        return (
            <ListItem key={stockIndexAdvice.indexName} className="IndexManagePage-AI-ListItem">
                <label className="IndexManagePage-AI-ListItem-Name">{stockIndexAdvice.indexName}</label>
                <label className="IndexManagePage-AI-ListItem-UsedCount">{stockIndexAdvice.usedCount}</label>
                <Button className="IndexManagePage-AI-ListItem-Use-button" dense={true} onClick={() => {
                    this.props.apiUserStockIndexAdd(this.props.user.id, {
                        name: stockIndexAdvice.indexName,
                        evalWeight: 0,
                        aiWeight: 0
                    })
                }}>
                    使用
                </Button>
            </ListItem>
        )
    }

    render() {
        return (
            <div className="IndexManagePage">
                <div className="IndexManagePage-Mine">
                    <div className="IndexManagePage-Mine-Header-div">
                        <label className="IndexManagePage-Mine-Header-Title-label">我的指标</label>
                        <Button className="IndexManagePage-Mine-List-Add-button" onClick={()=>{
                            this.setState({editing:true,adding:true,indexEditing:{}})
                        }}>
                            <label className="IndexManagePage-Mine-List-Add-button-label">新增</label>
                        </Button>
                    </div>
                    <div className="IndexManagePage-Mine-List-div">
                        <List className="IndexManagePage-Mine-List">
                            {this.props.userStockIndexList
                            && this.props.userStockIndexList.map(this.renderMyIndex.bind(this))}
                        </List>
                    </div>
                </div>
                <div className="IndexManagePage-AI">
                    <div className="IndexManagePage-AI-Header-div">
                        <label className="IndexManagePage-AI-Header-Title-label">AI推荐</label>
                    </div>
                    <div>
                        <List className="IndexManagePage-AI-List">
                            {this.props.stockIndexAdviceList
                            &&this.props.stockIndexAdviceList.map(this.renderAIIndex.bind(this))}
                        </List>
                    </div>
                </div>
                {this.renderSaveDialog()}
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