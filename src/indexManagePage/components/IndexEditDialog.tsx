import * as React from 'react'
import List,{ ListItem } from 'material-ui/List';
import Button from 'material-ui/Button'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {UserStockIndex} from "../../apis/StockAssistant/gen/api";
import {CSSProperties} from "react";

export interface Props {
    adding: boolean
    indexEditing: UserStockIndex
    onIndexSave: (adding: boolean, e: UserStockIndex, nameOld?: string) => void
    onCancel: () => void
}

interface State {
    closed: boolean
    indexEditing: UserStockIndex
}

export default class IndexEditDialog extends React.Component<Props,State> {
    componentWillMount() {
        this.setState({
            closed: false, indexEditing: {
                name: this.props.indexEditing.name,
                desc: this.props.indexEditing.desc,
                evalWeight: this.props.indexEditing.evalWeight,
                aiWeight: this.props.indexEditing.aiWeight
            }
        })
    }

    render() {
        const itemStyle:CSSProperties={height:"30px"}
        return (
            <Dialog open={!this.state.closed}>
                <DialogTitle>{this.props.adding ? "新增" : "修改"}</DialogTitle>
                <DialogContent>
                    <List style={{width:"200px"}}>
                        <ListItem key={"indexName"} style={itemStyle}>
                            <TextField id={"name"}
                                       label={"指标名称"} margin="normal"
                                       value={this.state.indexEditing.name && this.state.indexEditing.name}
                                       onChange={(e) => {
                                           let index = this.state.indexEditing;
                                           index.name = e.target.value;
                                           this.setState({indexEditing: index})
                                       }}/>
                        </ListItem>
                        <ListItem key={"evalWeight"} style={itemStyle}>
                            <TextField label={"该指标的权重"} margin="normal"
                                       value={this.state.indexEditing.evalWeight && this.state.indexEditing.evalWeight}
                                       onChange={(e) => {
                                           let index = this.state.indexEditing;
                                           index.evalWeight = parseInt(e.target.value);
                                           this.setState({indexEditing: index})
                                       }}/>
                        </ListItem>
                        <ListItem key={"aiWeight"} style={itemStyle}>
                            <TextField label={"该指标中AI所占的比例"} margin="normal"
                                       value={this.state.indexEditing.aiWeight && this.state.indexEditing.aiWeight}
                                       onChange={(e) => {
                                           let index = this.state.indexEditing;
                                           index.aiWeight = parseInt(e.target.value);
                                           this.setState({indexEditing: index})
                                       }}/>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.props.onCancel()
                        this.setState({closed: true})
                    }}>
                        取消
                    </Button>
                    <Button onClick={() => {
                        this.props.onIndexSave(this.props.adding, this.state.indexEditing, this.props.indexEditing.name);
                        this.setState({closed: true})
                    }}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}