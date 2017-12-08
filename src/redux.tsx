import { AnyAction, combineReducers } from 'redux';
import {
    DefaultApiFactory, Stock, StockIndexAdvice, UserIndexEvaluate, UserStockEvaluate,
    UserStockEvaluateListResponse,
    UserStockIndex,
} from './apis/StockAssistant/gen/api';
import { isUndefined } from 'util';
import { Dispatch, Dispatchable } from './_common/common';

// ------------------------- states
export interface RootState {
    errorMessage: string|null;
    user: User;
    stockMap: Map<string, Stock>;
    userStockEvaluatedListState: UserStockEvaluatedListState;
    userStockIndexList: Array<UserStockIndex>;
    stockIndexAdviceList: Array<StockIndexAdvice>;
    userIndexEvaluateListMap: Map<string, Array<UserIndexEvaluate>>;
}

export interface User {
    id: string;
    name: string;
}

export interface UserStockEvaluatedListState {
    items: Array<UserStockEvaluate>;
    pageToken: string;
    nextPageToken: string;
    isFetching: boolean;
}

export interface ApiError {
    status: number;
    code: string;
    message: string;
}

const ON_ERROR_MESSAGE = 'ON_ERROR_MESSAGE';
export function errorMessage( params: {message: string} ): AnyAction {
    return {
        type: ON_ERROR_MESSAGE,
        error: true,
        payload: {
            errorMessage: params.message
        },
    };
}

export function dispatchResponseError(dispatch: (action: AnyAction) => void , actionType: string, payload: {}) {
    dispatch({type: actionType, error: true, payload: payload});
    dispatch(errorMessage({message: JSON.stringify(payload)}));
}

export function errorFromResponse(response: {}): Promise<ApiError> {
    if (response instanceof Response) {
        return response.json().then((json: ApiError) => {
            return json;
        }).catch((err: {}) => {
            return {status: response.status, code: 'NetworkException', message: err.toString()};
        });
    } else if (response instanceof TypeError) {
        if (response.message === 'Failed to fetch') {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: '连接失败，请检查网络'});
            });
        } else {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: response.toString()});
            });
        }
    } else {
        return new Promise(function (resolve: (err: ApiError) => void) {
            resolve({status: 8193, code: 'NetworkException', message: '未知错误 response:' + response});
        });
    }
}

const STOCK_ASSISTANT_API_URL = 'http://127.0.0.1:8082/api/stock-assistant/v1';
let stockAssistantApi = DefaultApiFactory(fetch, STOCK_ASSISTANT_API_URL);

// ------------------------- network events

export interface UserStockEvaluateListParams {
    userId: string;
    notEvaluated?: boolean;
    pageToken?: string;
    pageSize?: number;
    sort?: string;
}
export const USER_STOCK_EVALUATED_LIST_REQUEST = 'USER_STOCK_EVALUATED_LIST_REQUEST';
export const USER_STOCK_EVALUATED_LIST_SUCCESS = 'USER_STOCK_EVALUATED_LIST_SUCCESS';
export const USER_STOCK_EVALUATED_LIST_FAILURE = 'USER_STOCK_EVALUATED_LIST_FAILURE';
export function apiUserStockEvaluateList(p: UserStockEvaluateListParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: USER_STOCK_EVALUATED_LIST_REQUEST});
        return stockAssistantApi.userStockEvaluateList(p)
            .then((data: UserStockEvaluateListResponse) => {
                dispatch({
                    type: USER_STOCK_EVALUATED_LIST_SUCCESS, payload: {
                        params: p,
                        data: data
                    }
                });
            }).catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, USER_STOCK_EVALUATED_LIST_FAILURE, err);
                });
            });
    };
}

export interface UserIndexEvaluateListParams {
    userId: string;
    stockId: string;
}
export const USER_INDEX_EVALUATE_LIST_REQUEST = 'USER_INDEX_EVALUATE_LIST_REQUEST';
export const USER_INDEX_EVALUATE_LIST_SUCCESS = 'USER_INDEX_EVALUATE_LIST_SUCCESS';
export const USER_INDEX_EVALUATE_LIST_FAILURE = 'USER_INDEX_EVALUATE_LIST_FAILURE';
export function apiUserIndexEvaluateList(p: UserIndexEvaluateListParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: USER_INDEX_EVALUATE_LIST_REQUEST});
        return stockAssistantApi.userIndexEvaluateList(p)
            .then((userIndexEvaluateList) => {
                dispatch({
                    type: USER_INDEX_EVALUATE_LIST_SUCCESS,
                    payload: {
                        data: userIndexEvaluateList,
                        userId: p.userId,
                        stockId: p.stockId
                    }
                });
            }).catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, USER_INDEX_EVALUATE_LIST_FAILURE, err);
                });
            });
    };
}

export interface UserIndexEvaluateSaveParams {
    userId: string;
    stockId: string;
    indexName: string;
    evalStars: number;
}
export const USER_INDEX_EVALUATE_SAVE_REQUEST = 'USER_INDEX_EVALUATE_SAVE_REQUEST';
export const USER_INDEX_EVALUATE_SAVE_SUCCESS = 'USER_INDEX_EVALUATE_SAVE_SUCCESS';
export const USER_INDEX_EVALUATE_SAVE_FAILURE = 'USER_INDEX_EVALUATE_SAVE_FAILURE';
export function apiUserIndexEvaluateSave(p: UserIndexEvaluateSaveParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: USER_INDEX_EVALUATE_SAVE_REQUEST});
        return stockAssistantApi.userIndexEvaluateSave({
            userId: p.userId,
            stockId: p.stockId,
            indexEvaluate: {
                indexName: p.indexName,
                evalStars: p.evalStars
            }
        }).then((userIndexEvaluate) => {
            dispatch({
                type: USER_INDEX_EVALUATE_SAVE_SUCCESS,
                payload: {
                    data: userIndexEvaluate
                }
            });
            dispatch(apiUserIndexEvaluateList({userId: p.userId, stockId: p.stockId})); // refresh
        }).catch((response) => {
            errorFromResponse(response).then((err) => {
                dispatchResponseError(dispatch, USER_INDEX_EVALUATE_SAVE_FAILURE, err);
            });
        });
    };
}

export interface UserStockIndexListParams {
    userId: string;
}
export const USER_STOCK_INDEX_LIST_REQUEST = 'USER_STOCK_INDEX_LIST_REQUEST';
export const USER_STOCK_INDEX_LIST_SUCCESS = 'USER_STOCK_INDEX_LIST_SUCCESS';
export const USER_STOCK_INDEX_LIST_FAILURE = 'USER_STOCK_INDEX_LIST_FAILURE';
export function apiUserStockIndexList(p: UserStockIndexListParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: USER_STOCK_INDEX_LIST_REQUEST});
        return stockAssistantApi.userStockIndexList(p).then((userStockIndexList) => {
            dispatch({type: USER_STOCK_INDEX_LIST_SUCCESS, payload: userStockIndexList});
        }).catch((response) => {
            errorFromResponse(response).then((err) => {
                dispatchResponseError(dispatch, USER_STOCK_INDEX_LIST_FAILURE, err);
            });
        });
    };
}

export interface UserStockIndexGetParams {
    userId: string;
}
export const USER_STOCK_INDEX_GET_REQUEST = 'USER_STOCK_INDEX_GET_REQUEST';
export const USER_STOCK_INDEX_GET_SUCCESS = 'USER_STOCK_INDEX_GET_SUCCESS';
export const USER_STOCK_INDEX_GET_FAILURE = 'USER_STOCK_INDEX_GET_FAILURE';
export function apiUserStockIndexGet(p: UserStockIndexGetParams): Dispatchable {
    return function (dispatch: {}) {
        console.log('apiUserStockIndexGet');
    };
}

export interface UserStockIndexAddParams {
    userId: string;
    index: UserStockIndex;
}
export const USER_STOCK_INDEX_ADD_REQUEST = 'USER_STOCK_INDEX_ADD_REQUEST';
export const USER_STOCK_INDEX_ADD_SUCCESS = 'USER_STOCK_INDEX_ADD_SUCCESS';
export const USER_STOCK_INDEX_ADD_FAILURE = 'USER_STOCK_INDEX_ADD_FAILURE';
export function apiUserStockIndexAdd(p: UserStockIndexAddParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: USER_STOCK_INDEX_ADD_REQUEST});
        return stockAssistantApi.userStockIndexAdd(p).then((data) => {
            dispatch({type: USER_STOCK_INDEX_ADD_SUCCESS, payload: data});
            dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
        }).catch((response) => {
            errorFromResponse(response).then((err) => {
                dispatchResponseError(dispatch, USER_STOCK_INDEX_ADD_FAILURE, err);
            });
            dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
        });
    };
}

export interface UserStockIndexUpdateParams {
    userId: string;
    index: UserStockIndex;
}
export const USER_STOCK_INDEX_UPDATE_REQUEST = 'USER_STOCK_INDEX_UPDATE_REQUEST';
export const USER_STOCK_INDEX_UPDATE_SUCCESS = 'USER_STOCK_INDEX_UPDATE_SUCCESS';
export const USER_STOCK_INDEX_UPDATE_FAILURE = 'USER_STOCK_INDEX_UPDATE_FAILURE';
export function apiUserStockIndexUpdate(p: UserStockIndexUpdateParams): Dispatchable {
    if (isUndefined(p.index.name) || p.index.name == null) {
        throw new Error('!userStockIndex.name');
    }

    const indexName = p.index.name == null ? '' : p.index.name;

    return function (dispatch: Dispatch) {
        dispatch({type: USER_STOCK_INDEX_UPDATE_REQUEST});
        return stockAssistantApi.userStockIndexUpdate({userId: p.userId, indexName: indexName, index: p.index})
            .then((data) => {
                dispatch({type: USER_STOCK_INDEX_UPDATE_SUCCESS, payload: data});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            }).catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, USER_STOCK_INDEX_UPDATE_FAILURE, err);
                });
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            });
    };
}

export interface UserStockIndexDeleteParams {
    userId: string;
    indexName: string;
}
export const USER_STOCK_INDEX_DELETE_REQUEST = 'USER_STOCK_INDEX_DELETE_REQUEST';
export const USER_STOCK_INDEX_DELETE_SUCCESS = 'USER_STOCK_INDEX_DELETE_SUCCESS';
export const USER_STOCK_INDEX_DELETE_FAILURE = 'USER_STOCK_INDEX_DELETE_FAILURE';
export function apiUserStockIndexDelete(p: UserStockIndexDeleteParams): Dispatchable {
    console.log('apiUserStockIndexDelete userId=' + p.userId + ',indexName=' + p.indexName);
    return function (dispatch: Dispatch) {
        dispatch({type: USER_STOCK_INDEX_DELETE_REQUEST});
        return stockAssistantApi.userStockIndexDelete(p).then(() => {
            dispatch({type: USER_STOCK_INDEX_DELETE_SUCCESS});
            dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
        }).catch((response) => {
            errorFromResponse(response).then((err) => {
                dispatchResponseError(dispatch, USER_STOCK_INDEX_DELETE_FAILURE, err);
            });
            dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
        });
    };
}

export interface UserStockIndexRenameParams {
    userId: string;
    nameOld: string;
    nameNew: string;
}
export const USER_STOCK_INDEX_RENAME_REQUEST = 'USER_STOCK_INDEX_RENAME_REQUEST';
export const USER_STOCK_INDEX_RENAME_SUCCESS = 'USER_STOCK_INDEX_RENAME_SUCCESS';
export const USER_STOCK_INDEX_RENAME_FAILURE = 'USER_STOCK_INDEX_RENAME_FAILURE';
export function apiUserStockIndexRename(p: UserStockIndexRenameParams): Dispatchable {
    console.log('apiUserStockIndexRename userId=' + p.userId + ',nameOld=' + p.nameOld + ',nameNew=' + p.nameNew);
    return function (dispatch: Dispatch) {
        dispatch({type: USER_STOCK_INDEX_RENAME_REQUEST});
        return stockAssistantApi.userStockIndexRename(p)
            .then((userStockIndexRenamed) => {
                dispatch({type: USER_STOCK_INDEX_RENAME_SUCCESS, payload: userStockIndexRenamed});
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            }).catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, USER_STOCK_INDEX_RENAME_FAILURE, err);
                });
                dispatch(apiUserStockIndexList({userId: p.userId})); // refresh
            });
    };
}

export interface UserStockIndexAdviceListParams {
    userId: string;
    pageToken: string;
    pageSize: number;
}
export const STOCK_INDEX_ADVICE_LIST_REQUEST = 'STOCK_INDEX_ADVICE_REQUEST';
export const STOCK_INDEX_ADVICE_LIST_SUCCESS = 'STOCK_INDEX_ADVICE_SUCCESS';
export const STOCK_INDEX_ADVICE_LIST_FAILURE = 'STOCK_INDEX_ADVICE_FAILURE';
export function apiStockIndexAdviceList(p: UserStockIndexAdviceListParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: STOCK_INDEX_ADVICE_LIST_REQUEST});
        return stockAssistantApi.stockIndexAdviceList(p)
            .then((stockIndexAdviceList) => {
                dispatch({type: STOCK_INDEX_ADVICE_LIST_SUCCESS, payload: stockIndexAdviceList});
            }).catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, STOCK_INDEX_ADVICE_LIST_FAILURE, err);
                });
            });
    };
}

export interface StockGetParams {
    stockId: string;
}
export const STOCK_GET_REQUEST = 'STOCK_GET_REQUEST';
export const STOCK_GET_SUCCESS = 'STOCK_GET_SUCCESS';
export const STOCK_GET_FAILURE = 'STOCK_GET_FAILURE';
export function apiStockGet(p: StockGetParams): Dispatchable {
    return function (dispatch: Dispatch) {
        dispatch({type: STOCK_GET_REQUEST});
        return stockAssistantApi.stockGet(p)
            .then((stock: Stock) => {
                dispatch({type: STOCK_GET_SUCCESS, payload: {data: stock}});
            }).catch((response) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, STOCK_GET_FAILURE, err);
                });
            });
    };
}

// ------------------------- uI events
export const APP_TAB_ITEM_CLICK_MESSAGES = 'APP_TAB_ITEM_CLICK_MESSAGES';
export const APP_TAB_ITEM_CLICK_INDEX_MANAGE = 'APP_TAB_ITEM_CLICK_INDEX_MANAGE';
export const APP_TAB_ITEM_CLICK_STOCKS = 'APP_TAB_ITEM_CLICK_STOCKS';
export const APP_TAB_ITEM_CLICK_SETTINGS = 'APP_TAB_ITEM_CLICK_SETTINGS';
export const APP_TAB_ITEM_CLICK_MY = 'APP_TAB_ITEM_CLICK_MY';
export function onAppTabItemClick(actionType: string): AnyAction {
    return {
        type: actionType,
        payload: {
            message: 'onStocksPageTabItemClick'
        }
    };
}

export const RESET_USER_STOCK_EVALUATE_LIST = 'RESET_USER_STOCK_EVALUATE_LIST';
export function onResetUserStockEvaluateList() {
    return{
        type: RESET_USER_STOCK_EVALUATE_LIST
    };
}

// ------------------------- reducers
function errorMessageReducer(message: string|null, action: AnyAction): string|null {
    if (isUndefined(message)) {
        return null;
    }

    switch (action.type) {
        case ON_ERROR_MESSAGE:
            return action.payload.errorMessage;
        default:
            return message;
    }
}

function userReducer(user: User, action: AnyAction) {
    if (isUndefined(user)) {
        return {id: '18616781549'};
    }

    return user;
}

function userStockEvaluatedListStateReducer(state: UserStockEvaluatedListState, action: AnyAction) {
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
        case RESET_USER_STOCK_EVALUATE_LIST:
            return defaultState;
        case USER_STOCK_EVALUATED_LIST_REQUEST:
            return {...state, isFetching: true};
        case USER_STOCK_EVALUATED_LIST_SUCCESS:
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
        case USER_STOCK_EVALUATED_LIST_FAILURE:
            return {...state, isFetching: false};
        default:
            return state;
    }
}

function userIndexEvaluateListReducer(state: Map<string, Array<UserIndexEvaluate>>, action: AnyAction) {
    if (isUndefined(state)) {
        return new Map<string, Array<UserIndexEvaluate>>();
    }

    switch (action.type) {
        case USER_INDEX_EVALUATE_LIST_SUCCESS: {
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

function userStockIndexListReducer(list: Array<UserStockIndex>, action: AnyAction) {
    if (isUndefined(list)) {
        return null;
    }

    switch (action.type) {
        case USER_STOCK_INDEX_LIST_SUCCESS:
            return action.payload;
        default:
            return list;
    }
}

function stockIndexAdviceListReducer(list: Array<StockIndexAdvice>, action: AnyAction) {
    if (isUndefined(list)) {
        return null;
    }

    switch (action.type) {
        case STOCK_INDEX_ADVICE_LIST_SUCCESS:
            return action.payload;
        default:
            return list;
    }
}

function stockMapReducer(stockMap: Map<string, Stock>, action: AnyAction) {
    if (isUndefined(stockMap)) {
        return new Map<string, Stock>();
    }

    switch (action.type) {
        case STOCK_GET_SUCCESS: {
            let newMap = new Map<string, Stock>();
            stockMap.forEach((value: Stock, key: string, map: {}) => {
                newMap.set(key, value);
            });
            newMap.set(action.payload.data.stockId, action.payload.data);
            return newMap;
        }
        default:
            return stockMap;
    }
}

export const rootReducer = combineReducers({
    errorMessage: errorMessageReducer,
    user: userReducer,
    userStockEvaluatedListState: userStockEvaluatedListStateReducer,
    userStockIndexList: userStockIndexListReducer,
    stockIndexAdviceList: stockIndexAdviceListReducer,
    userIndexEvaluateListMap: userIndexEvaluateListReducer,
    stockMap: stockMapReducer
});
