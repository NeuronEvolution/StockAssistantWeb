import * as React from 'react'

import "./IndexManagePage.css"
import List,{ ListItem } from 'material-ui/List';
import Button from 'material-ui/Button'
import {UserStockIndex} from "../apis/StockAssistant/gen/api";
import {RootState} from "../redux";
import TextField from 'material-ui/TextField';

export interface Props {
    rootState:RootState
    apiUserStockIndexList: (userID: string) => {}
    apiUserStockIndexAdd: (userID: string, userStockIndex: UserStockIndex) => {}
    apiUserStockIndexUpdate:any
    apiUserStockIndexDelete: any
    apiUserStockIndexRename: any
}

interface State {
    indexAdding: UserStockIndex
}

export default class IndexManagePage extends React.Component<Props,State> {

    componentWillMount() {
        this.setState({
            indexAdding: {}
        })

        this.props.apiUserStockIndexList("18616781549");
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
                <Button className="IndexManagePage-Mine-ListItem-Edit-button" dense={true}>
                    修改
                </Button>
                <Button className="IndexManagePage-Mine-ListItem-Delete-button" dense={true}>
                    删除
                </Button>
            </ListItem>
        )
    }

    renderAIIndex(userStockIndex: UserStockIndex) {
        return (
            <ListItem className="IndexManagePage-Mine-ListItem">
                bbb
            </ListItem>
        )
    }

    render() {
        return (
            <div className="IndexManagePage">
                <div className="IndexManagePage-Mine">
                    <div className="IndexManagePage-Mine-Header-div">
                        <label className="IndexManagePage-Mine-Header-Title-label">我的指标</label>
                    </div>
                    <div className="IndexManagePage-Mine-List-div">
                        <List className="IndexManagePage-Mine-List">
                            {this.props.rootState.userStockIndexList != null
                            && this.props.rootState.userStockIndexList.map(this.renderMyIndex.bind(this))}
                        </List>
                        <div className="IndexManagePage-Mine-List-Add－div">
                            <List>
                                <ListItem>
                                    <TextField id={"name"} className="IndexManagePage-Mine-List-Add-Name"
                                               label={"指标名称"} margin="normal"
                                               value={this.state.indexAdding.name && this.state.indexAdding.name}
                                               onChange={(e) => {
                                                   let index = this.state.indexAdding
                                                   index.name = e.target.value
                                                   this.setState({indexAdding: index})
                                               }}/>
                                </ListItem>
                                <ListItem>
                                    <TextField className="IndexManagePage-Mine-List-Add-Name"
                                               label={"该指标的权重"} margin="normal"
                                               value={this.state.indexAdding.evalWeight && this.state.indexAdding.evalWeight}
                                               onChange={(e) => {
                                                   let index = this.state.indexAdding
                                                   index.evalWeight = parseInt(e.target.value)
                                                   this.setState({indexAdding: index})
                                               }}/>
                                </ListItem>
                                <ListItem>
                                    <TextField className="IndexManagePage-Mine-List-Add-Name"
                                               label={"该指标中AI所占的比例"} margin="normal"
                                               value={this.state.indexAdding.aiWeight && this.state.indexAdding.aiWeight}
                                               onChange={(e) => {
                                                   let index = this.state.indexAdding
                                                   index.aiWeight = parseInt(e.target.value)
                                                   this.setState({indexAdding: index})
                                               }}/>
                                </ListItem>
                            </List>
                            <Button className="IndexManagePage-Mine-List-Add-button" onClick={() => {
                                this.props.apiUserStockIndexAdd("18616781549", this.state.indexAdding)
                            }}>
                                <label className="IndexManagePage-Mine-List-Add-button-label">
                                    新增
                                </label>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="IndexManagePage-AI">
                    <div className="IndexManagePage-AI-Header-div">
                        <label className="IndexManagePage-AI-Header-Title-label">推荐指标</label>
                    </div>
                    <div>
                        <List className="IndexManagePage-AI-List">
                        </List>
                    </div>
                </div>
            </div>
        )
    }
}