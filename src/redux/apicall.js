export const SWAGGER_API="SWAGGER_API"

function callApi(apiName,request,callback) {
    console.log(apiName,request,callback)
}

export default store => next => action => {
    const swaggerApi = action[SWAGGER_API]
    if (typeof swaggerApi === 'undefined') {
        return next(action)
    }

    const apiName = swaggerApi["api"]
    if (typeof apiName === 'undefined') {
        return console.error("api undefined")
    }

    const [REQUEST_ACTION, SUCCESS_ACTION, FAILED_ACTION] = swaggerApi.types

    const {request} = swaggerApi

    let callback = (error, payload, response) => {
        if (error) {
            return next({type: FAILED_ACTION, error: true, payload: error})
        }

        return next({type: SUCCESS_ACTION, payload: payload})
    }

    next({type: REQUEST_ACTION})

    callApi(apiName, request, callback)
}
