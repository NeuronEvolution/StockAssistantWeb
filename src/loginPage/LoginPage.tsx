import * as React from 'react'

import "./LoginPage.css"

export interface Props {
    apiUserLogin: any
}

export default class LoginPage extends React.Component<Props> {
    render() {
        return (
            <div className="LoginPage">
                <div className="LoginPage-LoginPanel">
                    <button className="LoginPage-LoginPanel-LoginButton" onClick={()=>{
                        this.props.apiUserLogin()
                    }}>
                        登陆
                    </button>
                    <button className="LoginPage-LoginPanel-SignupButton">
                        注册
                    </button>
                </div>
            </div>
        )
    }
}