import {AnyAction, combineReducers} from 'redux'
import {Props as AppProps} from "./App";
import {
    DefaultApiFactory, StockIndexAdvice, UserStockEvaluate,
    UserStockIndex
} from "./apis/StockAssistant/gen/api";
import {isUndefined} from "util";

//------------------------- states
export interface RootState {
    errorMessage: string|null
    session: Session
    user: User
    stockEvaluateList: Array<UserStockEvaluate>
    notEvaluatedList: Array<UserStockEvaluate>
    userStockIndexList: Array<UserStockIndex>
    stockIndexAdviceList:Array<StockIndexAdvice>
}

export interface Session{
    jwt: string
}

export interface User {
    id: string
    name: string
}

const ON_ERROR_MESSAGE="ON_ERROR_MESSAGE"
export function errorMessage(errorMessage:string) {
    if(isUndefined(errorMessage)) {
        console.error("errorMessage isUndefined")
        errorMessage = "未知错误"
    }

    return {
        type: ON_ERROR_MESSAGE,
        error: true,
        payload: {
            errorMessage: errorMessage
        },
    }
}

function dispatchResponseError(dispatch:any,actionType:any,payload:any){
    dispatch({type: actionType, error: true, payload: payload})
    dispatch(errorMessage(JSON.stringify(payload)))
}

function responseError(dispatch:any,actionType:any, response:any) {
    let payload: any
    if (response instanceof Response) {
        response.json().then((json: any) => {
            payload = json
            dispatchResponseError(dispatch, actionType, payload)
        }).catch((err: any) => {
            payload = {status: response.status, code: "NetworkException", message: err.toString}
            dispatchResponseError(dispatch, actionType, payload)
        })
    } else if (response instanceof TypeError) {
        if (response.message === "Failed to fetch") {
            payload = {status: 8193, code: "NetworkException", message: "连接失败，请检查网络"}
        } else {
            payload = {status: 8193, code: "NetworkException", message: response.toString()}
        }
        dispatchResponseError(dispatch, actionType, payload)
    } else {
        console.error("unknown error response:" + response)
        payload = {status: 8193, code: "NetworkException", message: "未知错误 response:" + response}
        dispatchResponseError(dispatch, actionType, payload)
    }
}

const STOCK_ASSISTANT_API_URL='http://127.0.0.1:8082/api/stock-assistant/v1';
let stockAssistantApi = DefaultApiFactory(fetch, STOCK_ASSISTANT_API_URL);

//------------------------- network events
export const USER_LOGIN_REQUEST='USER_LOGIN_REQUEST'
export const USER_LOGIN_SUCCESS='USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAILURE='USER_LOGIN_FAILURE'
export function apiUserLogin(userName:string,password:string) {
    return function (dispatch:any,getState:any) {
        dispatch({type:USER_LOGIN_REQUEST})
        dispatch({type:USER_LOGIN_SUCCESS,payload:{jwt:"jwt18616781549"}})
    }
}

export const STOCK_EVALUATE_LIST_REQUEST='STOCK_EVALUATE_LIST_REQUEST'
export const STOCK_EVALUATE_LIST_SUCCESS='STOCK_EVALUATE_LIST_SUCCESS'
export const STOCK_EVALUATE_LIST_FAILURE='STOCK_EVALUATE_LIST_FAILURE'
export function apiStockEvaluateList(userId:string) {
    return function (dispatch: any, getState: any) {
        dispatch({type: STOCK_EVALUATE_LIST_REQUEST})
        return stockAssistantApi.userStockEvaluateList({
            userId: userId
        }).then((userStockEvaluateList) => {
            dispatch({type: STOCK_EVALUATE_LIST_SUCCESS, payload: userStockEvaluateList})
        }).catch((response) => {
            responseError(dispatch,STOCK_EVALUATE_LIST_FAILURE,response)
        })
    }
}

export const NOT_EVALUATED_LIST_REQUEST='NOT_EVALUATED_LIST_REQUEST'
export const NOT_EVALUATED_LIST_SUCCESS='NOT_EVALUATED_LIST_SUCCESS'
export const NOT_EVALUATED_LIST_FAILURE='NOT_EVALUATED_LIST_FAILURE'
export function apiNotEvaluatedList(userId:string) {
    return function (dispatch: any, getState: any) {
        dispatch({type: NOT_EVALUATED_LIST_REQUEST});
        return stockAssistantApi.userStockEvaluateList({
            userId: userId,
            notEvaluated: "true"
        }).then((userStockEvaluateList) => {
            dispatch({type: NOT_EVALUATED_LIST_SUCCESS, payload: userStockEvaluateList})
        }).catch((response) => {
            responseError(dispatch, NOT_EVALUATED_LIST_FAILURE, response)
        })
    }
}

export const USER_STOCK_INDEX_LIST_REQUEST='USER_STOCK_INDEX_LIST_REQUEST';
export const USER_STOCK_INDEX_LIST_SUCCESS='USER_STOCK_INDEX_LIST_SUCCESS';
export const USER_STOCK_INDEX_LIST_FAILURE='USER_STOCK_INDEX_LIST_FAILURE';
export function apiUserStockIndexList(userId:string) {
    return function (dispatch: any, getState: any) {
        dispatch({type: USER_STOCK_INDEX_LIST_REQUEST})
        return stockAssistantApi.userStockIndexList({userId}).then((userStockIndexList) => {
            dispatch({type: USER_STOCK_INDEX_LIST_SUCCESS, payload: userStockIndexList})
        }).catch((response) => {
            responseError(dispatch,USER_STOCK_INDEX_LIST_FAILURE,response)
        })
    }
}

export const USER_STOCK_INDEX_GET_REQUEST='USER_STOCK_INDEX_GET_REQUEST';
export const USER_STOCK_INDEX_GET_SUCCESS='USER_STOCK_INDEX_GET_SUCCESS';
export const USER_STOCK_INDEX_GET_FAILURE='USER_STOCK_INDEX_GET_FAILURE';
export function apiUserStockIndexGet(userId:string) {
    return function (dispatch:any,getState:any) {

    }
}

export const USER_STOCK_INDEX_ADD_REQUEST='USER_STOCK_INDEX_ADD_REQUEST';
export const USER_STOCK_INDEX_ADD_SUCCESS='USER_STOCK_INDEX_ADD_SUCCESS';
export const USER_STOCK_INDEX_ADD_FAILURE='USER_STOCK_INDEX_ADD_FAILURE';
export function apiUserStockIndexAdd(userId:string,userStockIndex:UserStockIndex) {
    return function (dispatch: any, getState: any) {
        dispatch({type: USER_STOCK_INDEX_ADD_REQUEST})
        return stockAssistantApi.userStockIndexAdd({
            userId: userId,
            index: userStockIndex
        }).then((userStockIndex) => {
            dispatch({type: USER_STOCK_INDEX_ADD_SUCCESS, payload: userStockIndex})
            dispatch(apiUserStockIndexList(userId))//refresh
        }).catch((response) => {
            responseError(dispatch,USER_STOCK_INDEX_ADD_FAILURE,response)
            dispatch(apiUserStockIndexList(userId))//refresh
        })
    }
}

export const USER_STOCK_INDEX_UPDATE_REQUEST='USER_STOCK_INDEX_UPDATE_REQUEST';
export const USER_STOCK_INDEX_UPDATE_SUCCESS='USER_STOCK_INDEX_UPDATE_SUCCESS';
export const USER_STOCK_INDEX_UPDATE_FAILURE='USER_STOCK_INDEX_UPDATE_FAILURE';
export function apiUserStockIndexUpdate(userId:string,userStockIndex:UserStockIndex) {
    if (!userStockIndex.name) {
        throw new Error("!userStockIndex.name")
    }

    return function (dispatch: any, getState: any) {
        dispatch({type: USER_STOCK_INDEX_UPDATE_REQUEST})
        return stockAssistantApi.userStockIndexUpdate({
            userId: userId, indexName: userStockIndex.name ? userStockIndex.name : "", index: userStockIndex
        }).then((userStockIndex) => {
            dispatch({type: USER_STOCK_INDEX_UPDATE_SUCCESS, payload: userStockIndex})
            dispatch(apiUserStockIndexList(userId))//refresh
        }).catch((response) => {
            responseError(dispatch,USER_STOCK_INDEX_UPDATE_FAILURE,response)
            dispatch(apiUserStockIndexList(userId))//refresh
        })
    }
}

export const USER_STOCK_INDEX_DELETE_REQUEST='USER_STOCK_INDEX_DELETE_REQUEST';
export const USER_STOCK_INDEX_DELETE_SUCCESS='USER_STOCK_INDEX_DELETE_SUCCESS';
export const USER_STOCK_INDEX_DELETE_FAILURE='USER_STOCK_INDEX_DELETE_FAILURE';
export function apiUserStockIndexDelete(userId:string,indexName:string) {
    console.log("apiUserStockIndexDelete userId=" + userId + ",indexName=" + indexName)
    return function (dispatch: any, getState: any) {
        dispatch({type: USER_STOCK_INDEX_DELETE_REQUEST})
        return stockAssistantApi.userStockIndexDelete({
            userId: userId,
            indexName: indexName
        }).then(() => {
            dispatch({type: USER_STOCK_INDEX_DELETE_SUCCESS})
            dispatch(apiUserStockIndexList(userId))//refresh
        }).catch((response) => {
            responseError(dispatch, USER_STOCK_INDEX_DELETE_FAILURE, response)
            dispatch(apiUserStockIndexList(userId))//refresh
        })
    }
}

export const USER_STOCK_INDEX_RENAME_REQUEST='USER_STOCK_INDEX_RENAME_REQUEST';
export const USER_STOCK_INDEX_RENAME_SUCCESS='USER_STOCK_INDEX_RENAME_SUCCESS';
export const USER_STOCK_INDEX_RENAME_FAILURE='USER_STOCK_INDEX_RENAME_FAILURE';
export function apiUserStockIndexRename(userId:string,nameOld: string,nameNew :string) {
    console.log("apiUserStockIndexRename userId=" + userId + ",nameOld=" + nameOld + ",nameNew=" + nameNew)
    return function (dispatch: any, getState: any) {
        dispatch({type: USER_STOCK_INDEX_RENAME_REQUEST})
        return stockAssistantApi.userStockIndexRename({
            userId: userId,
            nameOld: nameOld,
            nameNew: nameNew
        }).then((userStockIndexRenamed) => {
            dispatch({type: USER_STOCK_INDEX_RENAME_SUCCESS, payload: userStockIndexRenamed})
            dispatch(apiUserStockIndexList(userId))//refresh
        }).catch((response) => {
            responseError(dispatch, USER_STOCK_INDEX_RENAME_FAILURE, response)
            dispatch(apiUserStockIndexList(userId))//refresh
        })
    }
}

export const STOCK_INDEX_ADVICE_LIST_REQUEST='STOCK_INDEX_ADVICE_REQUEST';
export const STOCK_INDEX_ADVICE_LIST_SUCCESS='STOCK_INDEX_ADVICE_SUCCESS';
export const STOCK_INDEX_ADVICE_LIST_FAILURE='STOCK_INDEX_ADVICE_FAILURE';
export function apiStockIndexAdviceList(pageToken:string,pageSize:number) {
    console.log("apiStockIndexAdvice")
    return function (dispatch: any, getState: any) {
        dispatch({type: STOCK_INDEX_ADVICE_LIST_REQUEST})
        return stockAssistantApi.stockIndexAdviceList({
            pageToken:pageToken,
            pageSize:pageSize
        }).then((stockIndexAdviceList) => {
            dispatch({type: STOCK_INDEX_ADVICE_LIST_SUCCESS, payload: stockIndexAdviceList})
        }).catch((response) => {
            responseError(dispatch, STOCK_INDEX_ADVICE_LIST_FAILURE, response)
        })
    }
}

//------------------------- uI events
export const APP_TAB_ITEM_CLICK_MESSAGES= "APP_TAB_ITEM_CLICK_MESSAGES"
export const APP_TAB_ITEM_CLICK_INDEX_MANAGE= "APP_TAB_ITEM_CLICK_INDEX_MANAGE"
export const APP_TAB_ITEM_CLICK_STOCKS="APP_TAB_ITEM_CLICK_STOCKS"
export const APP_TAB_ITEM_CLICK_SETTINGS="APP_TAB_ITEM_CLICK_SETTINGS"
export const APP_TAB_ITEM_CLICK_MY="APP_TAB_ITEM_CLICK_MY"
export function onAppTabItemClick(actionType:string) {
    return {
        type: actionType,
        payload: {
            message: "onStocksPageTabItemClick"
        }
    }
}

//------------------------- reducers
function errorMessageReducer(errorMessage:string|null,action:AnyAction):string|null {
    if(isUndefined(errorMessage)){
        return null;
    }

    switch (action.type) {
        case ON_ERROR_MESSAGE:
            return action.payload.errorMessage
        default:
            return errorMessage
    }
}

function appStateReducer(state:AppProps,action:AnyAction) {
    if (isUndefined(state)){
        return {}
    }

    switch (action.type) {
        case APP_TAB_ITEM_CLICK_STOCKS:
            return state;
        case APP_TAB_ITEM_CLICK_INDEX_MANAGE:
            return state
        case APP_TAB_ITEM_CLICK_MESSAGES:
            return state;
        case APP_TAB_ITEM_CLICK_SETTINGS:
            return state;
        case APP_TAB_ITEM_CLICK_MY:
            return state;
        default:
            return state;
    }
}

function loginReducer(session:Session,action:AnyAction) {
    if (isUndefined(session)) {
        return {}
    }

    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return session;
        case USER_LOGIN_SUCCESS:
            return {
                jwt:action.payload.jwt,
            }
        case USER_LOGIN_FAILURE:
            return session;
        default:
            return session;
    }
}

function userReducer(user:User,action:AnyAction){
    if(isUndefined(user)){
        return {id:"18616781549"}
    }

    return user
}

function stockEvaluateListReducer(stockEvaluateList:Array<UserStockEvaluate>,action:AnyAction) {
    if (isUndefined(stockEvaluateList)) {
        return []
    }

    switch (action.type) {
        case STOCK_EVALUATE_LIST_REQUEST:
            return stockEvaluateList;
        case STOCK_EVALUATE_LIST_SUCCESS:
            return action.payload;
        case STOCK_EVALUATE_LIST_FAILURE:
            return stockEvaluateList;
        default:
            return stockEvaluateList;
    }
}

function notEvaluatedListReducer(notEvaluatedList:Array<UserStockEvaluate>,action:AnyAction) {
    if (isUndefined(notEvaluatedList)) {
        return []
    }

    switch (action.type) {
        case NOT_EVALUATED_LIST_REQUEST:
            return notEvaluatedList;
        case NOT_EVALUATED_LIST_SUCCESS:
            return action.payload;
        case NOT_EVALUATED_LIST_FAILURE:
            return notEvaluatedList;
        default:
            return notEvaluatedList;
    }
}

function userStockIndexListReducer(list:Array<UserStockIndex>, action:AnyAction) {
    if (isUndefined(list)) {
        return []
    }

    switch (action.type) {
        case USER_STOCK_INDEX_LIST_SUCCESS:
            return action.payload;
        default:
            return list
    }
}

function stockIndexAdviceListReducer(list:Array<StockIndexAdvice>, action:AnyAction) {
    if (isUndefined(list)) {
        return []
    }

    switch (action.type) {
        case STOCK_INDEX_ADVICE_LIST_SUCCESS:
            return action.payload;
        default:
            return list
    }
}

export const rootReducer=combineReducers({
    errorMessage:errorMessageReducer,
    appProps:appStateReducer,
    session:loginReducer,
    user:userReducer,
    stockEvaluateList:stockEvaluateListReducer,
    notEvaluatedList:notEvaluatedListReducer,
    userStockIndexList:userStockIndexListReducer,
    stockIndexAdviceList:stockIndexAdviceListReducer
});
