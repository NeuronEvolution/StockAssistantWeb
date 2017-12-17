import { combineReducers } from 'redux';
import { isUndefined } from 'util';
import {
    DefaultApiFactory, Stock, stockGet_FAILURE, stockGet_SUCCESS, StockGetParams, StockIndexAdvice,
    stockIndexAdviceList_FAILURE,
    stockIndexAdviceList_SUCCESS,
    StockIndexAdviceListParams,
    UserIndexEvaluate,
    userIndexEvaluateList_FAILURE,
    userIndexEvaluateList_SUCCESS,
    UserIndexEvaluateListParams, userIndexEvaluateSave_FAILURE, userIndexEvaluateSave_SUCCESS,
    UserIndexEvaluateSaveParams, UserStockEvaluate,
    userStockEvaluateList_FAILURE, userStockEvaluateList_REQUEST,
    userStockEvaluateList_SUCCESS,
    UserStockEvaluateListParams,
    UserStockEvaluateListResponse,
    UserStockIndex, userStockIndexAdd_FAILURE, userStockIndexAdd_SUCCESS, UserStockIndexAddParams,
    userStockIndexDelete_FAILURE,
    userStockIndexDelete_SUCCESS,
    UserStockIndexDeleteParams,
    UserStockIndexGetParams,
    userStockIndexList_FAILURE,
    userStockIndexList_SUCCESS,
    UserStockIndexListParams, userStockIndexRename_FAILURE, userStockIndexRename_SUCCESS, UserStockIndexRenameParams,
    userStockIndexUpdate_FAILURE,
    userStockIndexUpdate_SUCCESS,
    UserStockIndexUpdateParams
} from './api/StockAssistant/gen/api';
import { Dispatchable, StandardAction } from './_common/action';
import { Dispatch } from 'react-redux';

let stockAssistantApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8082/api/v1/stock-assistant-private');

// ------------------------- states
export interface RootState {
    errorMessage: string|null;
    stockMap: Map<string, Stock>;
    userStockEvaluatedListState: UserStockEvaluatedListState;
    userStockIndexList: Array<UserStockIndex>;
    stockIndexAdviceList: Array<StockIndexAdvice>;
    userIndexEvaluateListMap: Map<string, Array<UserIndexEvaluate>>;
}

export const ERROR_MESSAGE_ACTION = 'ERROR_MESSAGE_ACTION';
export function onErrorMessage(p: {message: string}): StandardAction {
    return {
        type: ERROR_MESSAGE_ACTION,
        error: true,
        payload: p.message
    };
}

export const RESET_USER_STOCK_EVALUATE_LIST_ACTION = 'RESET_USER_STOCK_EVALUATE_LIST_ACTION';
export function onResetUserStockEvaluateList(): StandardAction {
    return {
        type: RESET_USER_STOCK_EVALUATE_LIST_ACTION
    };
}

export interface UserStockEvaluatedListState {
    items: Array<UserStockEvaluate>;
    pageToken: string;
    nextPageToken: string;
    isFetching: boolean;
}

export function apiUserStockEvaluateList(p: UserStockEvaluateListParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        dispatch({type: userStockEvaluateList_REQUEST});
        return stockAssistantApi.userStockEvaluateList(p)
            .then((data: UserStockEvaluateListResponse) => {
                dispatch({
                    type: userStockEvaluateList_SUCCESS, payload: {
                        params: p,
                        data: data
                    }
                });
            }).catch((err) => {
                dispatch({type: userStockEvaluateList_FAILURE, error: true, payload: err});
            });
    };
}

export function apiUserIndexEvaluateList(p: UserIndexEvaluateListParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userIndexEvaluateList(p)
            .then((userIndexEvaluateList) => {
                dispatch({
                    type: userIndexEvaluateList_SUCCESS,
                    payload: {
                        data: userIndexEvaluateList,
                        userId: p.userId,
                        stockId: p.stockId
                    }
                });
            }).catch((err) => {
                dispatch({type: userIndexEvaluateList_FAILURE, error: true, payload: err});
            });
    };
}

export function apiUserIndexEvaluateSave(p: UserIndexEvaluateSaveParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userIndexEvaluateSave(p)
            .then((data) => {
                dispatch({
                    type: userIndexEvaluateSave_SUCCESS,
                    payload: {
                        data: data
                    }
                });
                dispatch(apiUserIndexEvaluateList({userId: p.userId, stockId: p.stockId})); // refresh
            }).catch((err) => {
                dispatch({type: userIndexEvaluateSave_FAILURE, error: true, payload: err});
            });
    };
}

export function apiUserStockIndexList(p: UserStockIndexListParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userStockIndexList(p)
            .then((data) => {
                dispatch({type: userStockIndexList_SUCCESS, payload: data});
            }).catch((err) => {
                dispatch({type: userStockIndexList_FAILURE, error: true, payload: err});
            });
    };
}

export function apiUserStockIndexGet(p: UserStockIndexGetParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        console.log('apiUserStockIndexGet');
    };
}

export function apiUserStockIndexAdd(p: UserStockIndexAddParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userStockIndexAdd(p)
            .then((data) => {
                dispatch({type: userStockIndexAdd_SUCCESS, payload: data});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            }).catch((err) => {
                dispatch({type: userStockIndexAdd_FAILURE, error: true, payload: err});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            });
    };
}

export function apiUserStockIndexUpdate(p: UserStockIndexUpdateParams): Dispatchable {
    if (isUndefined(p.index.name) || p.index.name == null) {
        throw new Error('!userStockIndex.name');
    }

    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userStockIndexUpdate(p)
            .then((data) => {
                dispatch({type: userStockIndexUpdate_SUCCESS, payload: data});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            }).catch((err) => {
                dispatch({type: userStockIndexUpdate_FAILURE, error: true, payload: err});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            });
    };
}

export function apiUserStockIndexDelete(p: UserStockIndexDeleteParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userStockIndexDelete(p)
            .then(() => {
                dispatch({type: userStockIndexDelete_SUCCESS});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            }).catch((err) => {
                dispatch({type: userStockIndexDelete_FAILURE, error: true, payload: err});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            });
    };
}

export function apiUserStockIndexRename(p: UserStockIndexRenameParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.userStockIndexRename(p)
            .then((data) => {
                dispatch({type: userStockIndexRename_SUCCESS, payload: data});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            }).catch((err) => {
                dispatch({type: userStockIndexRename_FAILURE, error: true, payload: err});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            });
    };
}

export function apiStockIndexAdviceList(p: StockIndexAdviceListParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.stockIndexAdviceList(p)
            .then((data) => {
                dispatch({type: stockIndexAdviceList_SUCCESS, payload: data});
            }).catch((err) => {
                dispatch({type: stockIndexAdviceList_FAILURE, error: true, payload: err});
            });
    };
}

export function apiStockGet(p: StockGetParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return stockAssistantApi.stockGet(p)
            .then((stock: Stock) => {
                dispatch({type: stockGet_SUCCESS, payload: {data: stock}});
            }).catch((err) => {
                dispatch({type: stockGet_FAILURE, error: true, payload: err});
            });
    };
}

// ------------------------- reducers
function errorMessage(state: string|null, action: StandardAction): string|null {
    if (isUndefined(state)) {
        return null;
    }

    switch (action.type) {
        default:
            return state;
    }
}

function userStockEvaluatedListState(state: UserStockEvaluatedListState, action: StandardAction) {
    const defaultState: UserStockEvaluatedListState = {
        items: [],
        pageToken: '',
        nextPageToken: '',
        isFetching: false
    };

    if (isUndefined(state)) {
        return defaultState;
    }

    switch (action.type) {
        case RESET_USER_STOCK_EVALUATE_LIST_ACTION:
            return defaultState;
        case userStockEvaluateList_REQUEST:
            return {...state, isFetching: true};
        case userStockEvaluateList_SUCCESS:
            let oldItems = state.items;
            state = {
                items: oldItems,
                pageToken: action.payload.params.pageToken,
                nextPageToken: action.payload.data.nextPageToken,
                isFetching: false
            };
            if (action.payload.params.pageToken == null || action.payload.params.pageToken === '') {
                state.items = action.payload.data.items;
            } else {
                state.items = [...state.items, ...action.payload.data.items];
            }

            return state;
        case userStockEvaluateList_FAILURE:
            return {...state, isFetching: false};
        default:
            return state;
    }
}

function userIndexEvaluateListMap(state: Map<string, Array<UserIndexEvaluate>>, action: StandardAction) {
    if (isUndefined(state)) {
        return new Map<string, Array<UserIndexEvaluate>>();
    }

    switch (action.type) {
        case userIndexEvaluateList_SUCCESS: {
            let newMap = new Map<string, Array<UserIndexEvaluate>>();
            state.forEach((value: Array<UserIndexEvaluate>, key: string, map: {}) => {
                newMap.set(key, value);
            });
            newMap.set(action.payload.stockId, action.payload.data);

            return newMap;
        }
        default :
            return state;
    }
}

function userStockIndexList(state: Array<UserStockIndex>, action: StandardAction) {
    if (isUndefined(state)) {
        return null;
    }

    switch (action.type) {
        case stockIndexAdviceList_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function stockIndexAdviceList(state: Array<StockIndexAdvice>, action: StandardAction) {
    if (isUndefined(state)) {
        return [];
    }

    switch (action.type) {
        case userIndexEvaluateList_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function stockMap(state: Map<string, Stock>, action: StandardAction) {
    if (isUndefined(state)) {
        return new Map<string, Stock>();
    }

    switch (action.type) {
        case stockGet_SUCCESS: {
            let newMap = new Map<string, Stock>();
            state.forEach((value: Stock, key: string, map: {}) => {
                newMap.set(key, value);
            });
            newMap.set(action.payload.data.stockId, action.payload.data);
            return newMap;
        }
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    errorMessage,
    userStockEvaluatedListState,
    userStockIndexList,
    stockIndexAdviceList,
    userIndexEvaluateListMap,
    stockMap
});
