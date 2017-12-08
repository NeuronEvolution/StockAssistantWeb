import * as React from 'react';
import Button from 'material-ui/Button';

export default class MyPage extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <label>昵称：上帝本人</label>
                </div>
                <div>
                    <Button>建议或投诉</Button>
                </div>
                <div>
                    <Button>退出当前帐号</Button>
                </div>
            </div>
        );
    }
}