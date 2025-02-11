import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { EventMgr } from '../../Framework/EventMgr';
import { GameEvent, UIGameEvent } from '../Constant';

//控制UI，注意絕對不要讓UI代碼調用遊戲邏輯代碼，完全通過事件驅動(EventMgr)。
export class UILoadingCtrl extends Component {
    private perBar: Sprite = null;
    private perText: Label = null;
    private per: number = 0;
    private moveSpeed: number = 0.5;//一秒跑一半
    private isMoving: boolean = false;//是否正在移動
    private movingTime: number = 0;//移動時間
    private passedTime: number = 0;//經過的時間

    public Init() {
        //初始化進度條
        this.perBar = this.node.getChildByPath("pro_progress/pro_bar").getComponent(Sprite);
        this.perBar.fillRange = 0;//初始化為0
        this.per = 0;
        this.isMoving = false;

        //初始化進度條文字
        this.perText = this.node.getChildByPath("pro_progress/lab_progress").getComponent(Label);
        this.perText.string = "0%";

        //監聽UI加載的百分比事件，當這個事件被觸發的時候，我們就會更新進度條的數值。
        EventMgr.Instance.AddListener(GameEvent.UI, this.OnUIEventProcess, this);
    }

    protected onDestroy(): void {
        EventMgr.Instance.RemoveListener(GameEvent.UI, this.OnUIEventProcess, this);
    }

    protected update(dt: number): void {
        if (!this.isMoving) return;

        this.passedTime += dt;
        if (this.passedTime > this.movingTime) {
            dt -= (this.passedTime - this.movingTime);
        }

        this.per += this.moveSpeed * dt;
        this.per = (this.per > 1.0) ? 1.0 : this.per;
        // 顯示UI
        this.perBar.fillRange = this.per;
        //向下取整得到百分比，要記得乘以100。因為百分比是從0~1。
        //百分之99的時候，寫成100%是為了給主管看(不懂程式的人看得)。
        this.perText.string = Math.floor(this.per * 100) + "%";
        // end

        //如果經過時間大於進度條的移動時間
        if (this.passedTime >= this.movingTime) {
            this.isMoving = false;
        }

        if (this.per >= 0.999) {
            this.per = 1;
            this.perBar.fillRange = this.per;
            this.perText.string = Math.floor(this.per * 100) + "%";
            this.scheduleOnce(() => {
                EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingEnded, null)
            }, 0.3);
        }
    }

    private OnSyncLoadingPer(per: number): void {
        if (per <= 0) return;//如果進度為0，就不更新進度條了。

        this.isMoving = true;
        //當前百分比到目標百分比要跑多久
        this.movingTime = (per - this.per) / this.moveSpeed;
        this.passedTime = 0;
    }

    private OnUIEventProcess(mainEventType: number, subEventType: number, udata: any): void {
        switch (subEventType) {
            case UIGameEvent.UILoadingPer:
                this.OnSyncLoadingPer(udata);
                break;
        }
    }
}