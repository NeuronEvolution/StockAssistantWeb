import * as React from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { connect } from 'react-redux';
import EvaluatedList from './components/EvaluatedList';
import NotEvaluatedList from './components/NotEvaluatedList';
import EvaluatingDialog from './components/EvaluatingDialog';
import {
    apiStockGet,
    apiUserIndexEvaluateList, apiUserIndexEvaluateSave, apiUserStockEvaluateList, apiUserStockIndexList,
    onResetUserStockEvaluateList, RootState,
    UserStockEvaluatedListState
} from '../redux';
import {
    Stock, StockGetParams, UserIndexEvaluate, UserIndexEvaluateListParams, UserIndexEvaluateSaveParams,
    UserStockEvaluateListParams,
    UserStockIndex,
    UserStockIndexListParams
} from '../api/StockAssistant/gen/api';
import { Dispatchable, StandardAction } from '../_common/action';
import { CSSProperties } from 'react';

const TAB_INDEX_EVALUATED = 0;
const TAB_INDEX_NOT_EVALUATED = 1;
const TAB_INDEX_AI_EVALUATE = 2;

const testUid = '18616781549';

interface Props {
    userStockEvaluatedListState: UserStockEvaluatedListState;
    userStockIndexList: Array<UserStockIndex>;
    userIndexEvaluateListMap: Map<string, Array<UserIndexEvaluate>>;
    stockMap: Map<string, Stock>;

    apiUserStockIndexList: (p: UserStockIndexListParams) => Dispatchable;
    apiUserStockEvaluateList: (p: UserStockEvaluateListParams) => Dispatchable;
    apiUserIndexEvaluateList: (p: UserIndexEvaluateListParams) => Dispatchable;
    apiUserIndexEvaluateSave: (p: UserIndexEvaluateSaveParams) => Dispatchable;
    apiStockGet: (p: StockGetParams) => Dispatchable;
    onResetUserStockEvaluateList: () => StandardAction;
}

interface State {
    controlTabIndex: number;
    evaluating: boolean;
    evaluatingStockId: string;
}

class StocksPage extends React.Component<Props, State> {
    componentWillMount() {
        this.setState({controlTabIndex: 0, evaluating: false});

        this.openEvaluateDialog = this.openEvaluateDialog.bind(this);
        this.onEvalDialogClose = this.onEvalDialogClose.bind(this);
        this.onEvalStarsChange = this.onEvalStarsChange.bind(this);

        this.props.apiUserStockEvaluateList({userId: testUid, pageToken: '', pageSize: 40});
        this.props.apiUserStockIndexList({userId: testUid});
    }

    refreshStockEvaluateList(notEvaluated?: boolean) {
        this.props.apiUserStockEvaluateList({
            userId: testUid,
            notEvaluated: notEvaluated,
            pageToken: '',
            pageSize: 40
        });
    }

    openEvaluateDialog(stockId: string): void {
        this.setState({evaluating: true, evaluatingStockId: stockId});

        this.props.apiUserIndexEvaluateList({userId: testUid, stockId: stockId});

        this.props.apiStockGet({stockId: stockId});
    }

    onEvalStarsChange(indexName: string, evalStars: number) {
        this.props.apiUserIndexEvaluateSave({
            userId: testUid,
            stockId: this.state.evaluatingStockId,
            indexEvaluate: {
                indexName: indexName,
                evalStars: evalStars
            }
        });
    }

    onEvalDialogClose() {
        this.setState({evaluating: false});

        switch (this.state.controlTabIndex) {
            case TAB_INDEX_EVALUATED:
                this.refreshStockEvaluateList();
                break;
            case TAB_INDEX_NOT_EVALUATED:
                this.refreshStockEvaluateList(true);
                break;
            case TAB_INDEX_AI_EVALUATE:
                break;
            default:
                break;
        }
    }

    render() {
        const tabStyle: CSSProperties = {
            width: '20%',
            height: '30px',
        };

        let userIndexEvaluateList = this.props.userIndexEvaluateListMap.get(this.state.evaluatingStockId);
        let stock = this.props.stockMap.get(this.state.evaluatingStockId);
        return (
            <div>
                <Tabs
                    fullWidth={true}
                    centered={true}
                    value={this.state.controlTabIndex}
                    onChange={(event: {}, v: number) => {
                        this.setState({controlTabIndex: v});
                        switch (v) {
                            case TAB_INDEX_EVALUATED:
                                this.props.onResetUserStockEvaluateList();
                                this.refreshStockEvaluateList();
                                break;
                            case TAB_INDEX_NOT_EVALUATED:
                                this.props.onResetUserStockEvaluateList();
                                this.refreshStockEvaluateList(true);
                                break;
                            case TAB_INDEX_AI_EVALUATE:
                                break;
                            default:
                                throw 'never';
                        }
                    }}
                >
                    <Tab style={tabStyle} label="已评估"/>
                    <Tab style={tabStyle} label="未评估"/>
                    <Tab style={tabStyle} label="AI评估"/>
                </Tabs>
                <div style={{height: '1px', backgroundColor: '#ddd'}}/>
                {this.state.controlTabIndex === TAB_INDEX_EVALUATED &&
                <EvaluatedList
                    state={this.props.userStockEvaluatedListState}
                    openEvaluateDialog={this.openEvaluateDialog}
                    indexCount={this.props.userStockIndexList ? this.props.userStockIndexList.length : 0}
                    onLoadMore={(): void => {
                        this.props.apiUserStockEvaluateList({
                            userId: testUid,
                            pageToken: this.props.userStockEvaluatedListState.nextPageToken,
                            pageSize: 40
                        });
                    }}
                />}
                {this.state.controlTabIndex === TAB_INDEX_NOT_EVALUATED &&
                <NotEvaluatedList
                    state={this.props.userStockEvaluatedListState}
                    openEvaluateDialog={this.openEvaluateDialog}
                    onLoadMore={() => {
                        this.props.apiUserStockEvaluateList({
                            userId: testUid,
                            notEvaluated: true,
                            pageToken: this.props.userStockEvaluatedListState.nextPageToken,
                            pageSize: 40
                        });
                    }}
                />}
                {this.state.controlTabIndex === TAB_INDEX_AI_EVALUATE && null}
                {this.state.evaluating &&
                <EvaluatingDialog
                    indexEvaluatingList={userIndexEvaluateList}
                    stock={stock}
                    onEvalDialogClose={this.onEvalDialogClose}
                    onEvalStarsChange={this.onEvalStarsChange}
                />}
            </div>
        );
    }
}

function selectProps(rootState: RootState) {
    return {
        userStockEvaluatedListState: rootState.userStockEvaluatedListState,
        userStockIndexList: rootState.userStockIndexList,
        userIndexEvaluateListMap: rootState.userIndexEvaluateListMap,
        stockMap: rootState.stockMap
    };
}

export default connect(selectProps, {
    apiUserStockIndexList,
    apiUserStockEvaluateList,
    apiUserIndexEvaluateList,
    apiUserIndexEvaluateSave,
    apiStockGet,
    onResetUserStockEvaluateList,
})(StocksPage);