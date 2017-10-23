import {AnyAction, combineReducers} from 'redux'

export interface RootState{

}

function helloworld (state:object,action:AnyAction){
    return "hello"
}

export const rootReducer=combineReducers({
    helloworld
})
