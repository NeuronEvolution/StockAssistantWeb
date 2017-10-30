import {DefaultApiFactory, UserStockEvaluate} from "./StockAssistant/gen/api";

export const API="API"

export const API_USER_LOGIN="API_USER_LOGIN"
export const API_STOCKS_EVALUATED_LIST="API_STOCKS_EVALUATED_LIST"
export const API_NOT_EVALUATED_LIST="API_NOT_EVALUATED_LIST"

function callApi(apiName:string,request:any,callback:any) {
    console.log(apiName, request, callback)

    switch (apiName) {
        case API_USER_LOGIN:
            return callback(null, {jwt: "jwt-0123456789ABCDEF"}, null)
        case API_STOCKS_EVALUATED_LIST: {
            let stockApi = DefaultApiFactory(fetch, "http://127.0.0.1:8082/api/stock-assistant/v1/")
            return stockApi.userStockEvaluateList({userId: request.userId}).then((evalList: Array<UserStockEvaluate>) => {
                return callback(null, evalList, null)
            }).catch((response: any) => {
                response.json().then((data: any) => {
                    return callback(data, null, response)
                }).catch((err: any) => {
                    return callback(err, null, response)
                })
            })
        }
        case API_NOT_EVALUATED_LIST: {
            let stockApi = DefaultApiFactory(fetch, "http://127.0.0.1:8082/api/stock-assistant/v1/")
            return stockApi.userStockEvaluateList({userId: request.userId,notEvaluated:"true"}).then((evalList: Array<UserStockEvaluate>) => {
                return callback(null, evalList, null)
            }).catch((response: any) => {
                response.json().then((data: any) => {
                    return callback(data, null, response)
                }).catch((err: any) => {
                    return callback(err, null, response)
                })
            })
        }
        default:
            return callback("no impl", null, null)
    }
}

export default (store:any) => (next:any) => (action:any) => {
    const swaggerApi = action[API]
    if (typeof swaggerApi === 'undefined') {
        return next(action)
    }

    const apiName = swaggerApi["api"]
    if (typeof apiName === 'undefined') {
        return console.error("api undefined")
    }

    const [REQUEST_ACTION, SUCCESS_ACTION, FAILED_ACTION] = swaggerApi.types

    const {request} = swaggerApi

    let callback = (error:any, payload:any, response:any) => {
        if (error) {
            return next({type: FAILED_ACTION, error: true, payload: error})
        }

        return next({type: SUCCESS_ACTION, payload: payload})
    }

    next({type: REQUEST_ACTION})

    callApi(apiName, request, callback)
}