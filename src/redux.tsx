import {AnyAction, combineReducers} from 'redux'
import {Props as AppProps} from "./App";
import {
    DefaultApiFactory, DefaultApiFetchParamCreator, Stock, StockIndexAdvice, UserIndexEvaluate, UserStockEvaluate,
    UserStockIndex,
    UserStockEvaluateListResponse,
} from "./apis/StockAssistant/gen/api";
import {isUndefined} from "util";

//------------------------- states
export interface RootState {
    errorMessage: string|null
    session: Session
    user: User
    stockMap:Map<string,Stock>
    userStockEvaluatedListState:UserStockEvaluatedListState
    userStockIndexList: Array<UserStockIndex>
    stockIndexAdviceList:Array<StockIndexAdvice>
    userIndexEvaluateListMap: Map<string, Array<UserIndexEvaluate>>
}

export interface Session{
    jwt: string
}

export interface User {
    id: string
    name: string
}

export interface UserStockEvaluatedListState {
    items: Array<UserStockEvaluate>
    pageToken: string
    nextPageToken: string
    isFetching: boolean
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

export const USER_STOCK_EVALUATED_LIST_REQUEST='USER_STOCK_EVALUATED_LIST_REQUEST'
export const USER_STOCK_EVALUATED_LIST_SUCCESS='USER_STOCK_EVALUATED_LIST_SUCCESS'
export const USER_STOCK_EVALUATED_LIST_FAILURE='USER_STOCK_EVALUATED_LIST_FAILURE'
export function apiUserStockEvaluateList(params:{userId:string,notEvaluated?:boolean,pageToken?:string,pageSize?:number,sort?:string}) {
    return function (dispatch: any, getState: any) {
        function onError(response: any) {
            responseError(dispatch, USER_STOCK_EVALUATED_LIST_FAILURE, response)
        }

        dispatch({type: USER_STOCK_EVALUATED_LIST_REQUEST});
        fetch(STOCK_ASSISTANT_API_URL + DefaultApiFetchParamCreator.userStockEvaluateList(params).url)
            .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    onError(response)
                }
                response.json().then((data: UserStockEvaluateListResponse) => {
                    dispatch({
                        type: USER_STOCK_EVALUATED_LIST_SUCCESS, payload: {
                            params: params,
                            data: data
                        }
                    })
                }).catch((response) => {
                    onError(response)
                })
            })
            .catch((response) => {
                onError(response)
            });
    }
}

export const USER_INDEX_EVALUATE_LIST_REQUEST='USER_INDEX_EVALUATE_LIST_REQUEST'
export const USER_INDEX_EVALUATE_LIST_SUCCESS='USER_INDEX_EVALUATE_LIST_SUCCESS'
export const USER_INDEX_EVALUATE_LIST_FAILURE='USER_INDEX_EVALUATE_LIST_FAILURE'
export function apiUserIndexEvaluateList(userId:string,stockId:string) {
    return function (dispatch: any, getState: any) {
        dispatch({type: USER_INDEX_EVALUATE_LIST_REQUEST});
        return stockAssistantApi.userIndexEvaluateList({
            userId: userId,
            stockId: stockId
        }).then((userIndexEvaluateList) => {
            dispatch({
                type: USER_INDEX_EVALUATE_LIST_SUCCESS,
                payload: {
                    data: userIndexEvaluateList,
                    userId: userId,
                    stockId: stockId
                }
            })
        }).catch((response) => {
            responseError(dispatch, USER_INDEX_EVALUATE_LIST_FAILURE, response)
        })
    }
}

export const USER_INDEX_EVALUATE_SAVE_REQUEST='USER_INDEX_EVALUATE_SAVE_REQUEST'
export const USER_INDEX_EVALUATE_SAVE_SUCCESS='USER_INDEX_EVALUATE_SAVE_SUCCESS'
export const USER_INDEX_EVALUATE_SAVE_FAILURE='USER_INDEX_EVALUATE_SAVE_FAILURE'
export function apiUserIndexEvaluateSave(userId:string,stockId:string,indexName:string,evalStars:number) {
    return function (dispatch: any, getState: any) {
        dispatch({type: USER_INDEX_EVALUATE_SAVE_REQUEST});
        return stockAssistantApi.userIndexEvaluateSave({
            userId: userId,
            stockId: stockId,
            indexEvaluate: {
                indexName: indexName,
                evalStars: evalStars
            }
        }).then((userIndexEvaluate) => {
            dispatch({
                type: USER_INDEX_EVALUATE_SAVE_SUCCESS,
                payload: {
                    data: userIndexEvaluate
                }
            })
            dispatch(apiUserIndexEvaluateList(userId, stockId))//refresh
        }).catch((response) => {
            responseError(dispatch, USER_INDEX_EVALUATE_SAVE_FAILURE, response)
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
export function apiStockIndexAdviceList(userId:string,pageToken:string,pageSize:number) {
    return function (dispatch: any, getState: any) {
        dispatch({type: STOCK_INDEX_ADVICE_LIST_REQUEST})
        return stockAssistantApi.stockIndexAdviceList({
            userId: userId,
            pageToken: pageToken,
            pageSize: pageSize
        }).then((stockIndexAdviceList) => {
            dispatch({type: STOCK_INDEX_ADVICE_LIST_SUCCESS, payload: stockIndexAdviceList})
        }).catch((response) => {
            responseError(dispatch, STOCK_INDEX_ADVICE_LIST_FAILURE, response)
        })
    }
}

export const STOCK_GET_REQUEST='STOCK_GET_REQUEST';
export const STOCK_GET_SUCCESS='STOCK_GET_SUCCESS';
export const STOCK_GET_FAILURE='STOCK_GET_FAILURE';
export function apiStockGet(stockId:string) {
    return function (dispatch: any, getState: any) {
        dispatch({type: STOCK_GET_REQUEST})
        return stockAssistantApi.stockGet({
            stockId: stockId
        }).then((stock: Stock) => {
            dispatch({type: STOCK_GET_SUCCESS, payload: {data: stock}})
        }).catch((response) => {
            responseError(dispatch, STOCK_GET_FAILURE, response)
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

export const RESET_USER_STOCK_EVALUATE_LIST="RESET_USER_STOCK_EVALUATE_LIST"
export function onResetUserStockEvaluateList(){
    return{
        type:RESET_USER_STOCK_EVALUATE_LIST
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
        return null
    }

    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return {
                jwt:action.payload.jwt,
            }
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

function userStockEvaluatedListStateReducer(state:UserStockEvaluatedListState,action:AnyAction) {
    const defaultState:UserStockEvaluatedListState={
        items: [],
        pageToken: "",
        nextPageToken: "",
        isFetching: false
    };

    if (isUndefined(state)) {
        return defaultState
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
            if (action.payload.params.pageToken == null || action.payload.params.pageToken == "") {
                state.items = action.payload.data.items
            } else {
                state.items = [...state.items, ...action.payload.data.items]
            }

            return state;
        case USER_STOCK_EVALUATED_LIST_FAILURE:
            return {...state, isFetching: false};
        default:
            return state;
    }
}

function userIndexEvaluateListReducer(userIndexEvaluateListMap:Map<string,Array<UserIndexEvaluate>>,action:AnyAction) {
    if (isUndefined(userIndexEvaluateListMap)) {
        return new Map<string, Array<UserIndexEvaluate>>()
    }

    switch (action.type) {
        case USER_INDEX_EVALUATE_LIST_SUCCESS: {
            let newMap=new Map<string,Array<UserIndexEvaluate>>()
            userIndexEvaluateListMap.forEach((value:any,key:any,map:any)=>{
                newMap.set(key,value)
            })
            newMap.set(action.payload.stockId, action.payload.data)

            return newMap;
        }
        default :
            return userIndexEvaluateListMap;
    }
}

function userStockIndexListReducer(list:Array<UserStockIndex>, action:AnyAction) {
    if (isUndefined(list)) {
        return null
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
        return null
    }

    switch (action.type) {
        case STOCK_INDEX_ADVICE_LIST_SUCCESS:
            return action.payload;
        default:
            return list
    }
}

function stockMapReducer(stockMap:Map<string,Stock>,action:AnyAction){
    if(isUndefined(stockMap)){
        return new Map<string,Stock>()
    }

    switch (action.type){
        case STOCK_GET_SUCCESS:{
            let newMap=new Map<string,Stock>()
            stockMap.forEach((value:any,key:any,map:any)=>{
                newMap.set(key,value)
            })
            newMap.set(action.payload.data.stockId, action.payload.data)
            return newMap;
        }
        default:
            return stockMap
    }
}

export const rootReducer=combineReducers({
    errorMessage:errorMessageReducer,
    appProps:appStateReducer,
    session:loginReducer,
    user:userReducer,
    userStockEvaluatedListState:userStockEvaluatedListStateReducer,
    userStockIndexList:userStockIndexListReducer,
    stockIndexAdviceList:stockIndexAdviceListReducer,
    userIndexEvaluateListMap:userIndexEvaluateListReducer,
    stockMap:stockMapReducer
});
