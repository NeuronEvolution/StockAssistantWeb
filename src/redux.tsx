import {AnyAction, combineReducers} from 'redux'
import {API,API_USER_LOGIN,API_STOCKS_EVALUATED_LIST,API_NOT_EVALUATED_LIST} from "./apis/apicall";
import {Props as AppProps} from "./App";
import {UserStockEvaluate} from "./apis/StockAssistant/gen/api";

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
    return {
        [API]: {
            api: API_USER_LOGIN,
            types: [USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE],
            request: {
                userName: userName,
                password: password
            }
        }
    }
}

export const STOCK_EVALUATE_LIST_REQUEST='STOCK_EVALUATE_LIST_REQUEST'
export const STOCK_EVALUATE_LIST_SUCCESS='STOCK_EVALUATE_LIST_SUCCESS'
export const STOCK_EVALUATE_LIST_FAILURE='STOCK_EVALUATE_LIST_FAILURE'
export function apiStockEvaluateList(userId:string) {
    return {
        [API]: {
            api: API_STOCKS_EVALUATED_LIST,
            types: [STOCK_EVALUATE_LIST_REQUEST, STOCK_EVALUATE_LIST_SUCCESS, STOCK_EVALUATE_LIST_FAILURE],
            request: {
                userId: userId
            }
        }
    }
}

export const NOT_EVALUATED_LIST_REQUEST='NOT_EVALUATED_LIST_REQUEST'
export const NOT_EVALUATED_LIST_SUCCESS='NOT_EVALUATED_LIST_SUCCESS'
export const NOT_EVALUATED_LIST_FAILURE='NOT_EVALUATED_LIST_FAILURE'
export function apiNotEvaluatedList(userId:string) {
    return {
        [API]: {
            api: API_NOT_EVALUATED_LIST,
            types: [NOT_EVALUATED_LIST_REQUEST, NOT_EVALUATED_LIST_SUCCESS, NOT_EVALUATED_LIST_FAILURE],
            request: {
                userId: userId
            }
        }
    }
}

//------------------------- states
export interface RootState {
    session:Session
    user: User
    stockEvaluateList:Array<UserStockEvaluate>
    notEvaluatedList:Array<UserStockEvaluate>
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

export const rootReducer=combineReducers({
    appProps:appStateReducer,
    session:loginReducer,
    user:userReducer,
    stockEvaluateList:stockEvaluateListReducer,
    notEvaluatedList:notEvaluatedListReducer
});
