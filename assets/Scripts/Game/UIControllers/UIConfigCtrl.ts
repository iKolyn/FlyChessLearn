import { _decorator, Component, Node, ToggleContainer } from 'cc';
import { GameEvent, UIGameEvent } from '../Constant';
import { EventMgr } from '../../Framework/EventMgr';
//自製的按鈕事件，我們只要丟索引跟事件，不要管具體的數據。
export class UIConfigCtrl extends Component {

    public Init() {
        //這邊使用getChildByName，因為這個物件名稱是場中唯一，且不是其他人的子物件。
        const gameStart = this.node.getChildByName("btn_game");
        const item:ToggleContainer = this.node.getChildByName("layout_camp").getComponent(ToggleContainer);
        item.toggleItems[0].isChecked = true;
        gameStart.on('click', this.OnStartClick, this);
    }

    protected onDestroy(): void {
        //移除所有事件
        this.node.off('click', this.OnStartClick, this);
    }

    private OnStartClick() {
        //都作為配置文件的形式，不用管UI數據，全部做成索引。
        let roleIndex = 0;
        let playerNumIndex = 0;
        let takeOffIndex = 0;

        let item: ToggleContainer = this.node.getChildByName("layout_camp").getComponent(ToggleContainer);
        roleIndex = item.toggleItems.findIndex((item) => item.isChecked);
        item = this.node.getChildByName("layout_people").getComponent(ToggleContainer);
        playerNumIndex = item.toggleItems.findIndex((item) => item.isChecked);
        item = this.node.getChildByName("layout_take_off").getComponent(ToggleContainer);
        takeOffIndex = item.toggleItems.findIndex((item) => item.isChecked);

        const configData = {
            roleIndex: roleIndex,
            playerNumIndex: playerNumIndex,
            takeOffIndex: takeOffIndex,
        }

        //當被點擊以後，依照當前的配置數據，發送事件。
        EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UIGameStarted, configData);
    }
}


