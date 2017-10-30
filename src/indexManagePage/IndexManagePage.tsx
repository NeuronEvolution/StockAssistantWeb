import * as React from 'react'

import "./IndexManagePage.css"

export interface Props {
}

export default class IndexManagePage extends React.Component<Props> {
    render() {
        return (
            <div className="IndexManagePage">
                <div>
                    <div>
                        <label>我的指标</label>
                    </div>
                </div>
                <div>
                   <div>
                       <label>推荐指标</label>
                   </div>
                </div>
            </div>
        )
    }
}