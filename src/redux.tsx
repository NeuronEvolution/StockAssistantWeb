import {AnyAction, combineReducers} from 'redux'
import {Props as AppProps} from "./App";
import {
    DefaultApiFactory, InlineResponseDefault, UserStockEvaluate,
    UserStockIndex
} from "./apis/StockAssistant/gen/api";

function responseError(response:Response):Promise<InlineResponseDefault> {
    return response.json().then((json) => {
        return json
    }).catch((err) => {
        return {status: response.status, message: err.toString}
    })
}

const STOCK_ASSISTANT_API_URL='http://127.0.0.1:8082/api/stock-assistant/v1';
let stockAssistantApi = DefaultApiFactory(fetch, STOCK_ASSISTANT_API_URL);

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
            dispatch({type: STOCK_EVALUATE_LIST_FAILURE, error: true, payload: responseError(response)})
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
            dispatch({type: NOT_EVALUATED_LIST_FAILURE, error: true, payload: responseError(response)})
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
            dispatch({type: USER_STOCK_INDEX_LIST_FAILURE, error: true, payload: responseError(response)})
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
            dispatch({type: USER_STOCK_INDEX_ADD_FAILURE, error: true, payload: responseError(response)})

            dispatch(apiUserStockIndexList(userId))//refresh
        })
    }
}

export const USER_STOCK_INDEX_UPDATE_REQUEST='USER_STOCK_INDEX_UPDATE_REQUEST';
export const USER_STOCK_INDEX_UPDATE_SUCCESS='USER_STOCK_INDEX_UPDATE_SUCCESS';
export const USER_STOCK_INDEX_UPDATE_FAILURE='USER_STOCK_INDEX_UPDATE_FAILURE';
export function apiUserStockIndexUpdate(userId:string,userStockIndex:UserStockIndex) {
    if (!userStockIndex.name) {
        console.error("!userStockIndex.name")
        return
    }

    return function (dispatch: any, getState: any) {
        dispatch({type: USER_STOCK_INDEX_UPDATE_REQUEST})

        return stockAssistantApi.userStockIndexUpdate({
            userId: userId, indexName: userStockIndex.name ? userStockIndex.name : "", index: userStockIndex
        }).then((userStockIndex) => {
            dispatch({type: USER_STOCK_INDEX_UPDATE_SUCCESS, payload: userStockIndex})

            dispatch(apiUserStockIndexList(userId))//refresh
        }).catch((response) => {
            dispatch({type: USER_STOCK_INDEX_UPDATE_FAILURE, error: true, payload: responseError(response)})

            dispatch(apiUserStockIndexList(userId))//refresh
        })
    }
}

export const USER_STOCK_INDEX_DELETE_REQUEST='USER_STOCK_INDEX_DELETE_REQUEST';
export const USER_STOCK_INDEX_DELETE_SUCCESS='USER_STOCK_INDEX_DELETE_SUCCESS';
export const USER_STOCK_INDEX_DELETE_FAILURE='USER_STOCK_INDEX_DELETE_FAILURE';
export function apiUserStockIndexDelete(userId:string) {
    return function (dispatch:any,getState:any) {

    }
}

export const USER_STOCK_INDEX_RENAME_REQUEST='USER_STOCK_INDEX_RENAME_REQUEST';
export const USER_STOCK_INDEX_RENAME_SUCCESS='USER_STOCK_INDEX_RENAME_SUCCESS';
export const USER_STOCK_INDEX_RENAME_FAILURE='USER_STOCK_INDEX_RENAME_FAILURE';
export function apiUserStockIndexRename(userId:string) {
    return function (dispatch:any,getState:any) {

    }
}

//------------------------- states
export interface RootState {
    session: Session
    user: User
    stockEvaluateList: Array<UserStockEvaluate>
    notEvaluatedList: Array<UserStockEvaluate>
    userStockIndexList: Array<UserStockIndex>
}

export interface Session{
    jwt: string
}

export interface User {
    id: string
    name: string
}

//------------------------- reducers
function appStateReducer(state:AppProps,action:AnyAction) {
    if (state==null){
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
    if (session == null) {
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
    if(user==null){
        return {id:"u00001"}
    }

    return user
}

function stockEvaluateListReducer(stockEvaluateList:Array<UserStockEvaluate>,action:AnyAction) {
    if (stockEvaluateList == null) {
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
    if (notEvaluatedList == null) {
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
    if (list == null) {
        return []
    }

    switch (action.type) {
        case USER_STOCK_INDEX_LIST_REQUEST:
            return list;
        case USER_STOCK_INDEX_LIST_SUCCESS:
            return action.payload;
        case USER_STOCK_INDEX_LIST_FAILURE:
            return list;
        case USER_STOCK_INDEX_ADD_REQUEST:
            return list;
        case USER_STOCK_INDEX_ADD_SUCCESS:
            return list;
        case USER_STOCK_INDEX_ADD_FAILURE:
            return list;
        case USER_STOCK_INDEX_UPDATE_REQUEST:
            return list;
        case USER_STOCK_INDEX_UPDATE_SUCCESS:
            return list;
        case USER_STOCK_INDEX_UPDATE_FAILURE:
            return list;
        default:
            return list
    }
}

export const rootReducer=combineReducers({
    appProps:appStateReducer,
    session:loginReducer,
    user:userReducer,
    stockEvaluateList:stockEvaluateListReducer,
    notEvaluatedList:notEvaluatedListReducer,
    userStockIndexList:userStockIndexListReducer
});
