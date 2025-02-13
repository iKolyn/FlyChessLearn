import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { EventMgr } from '../../Framework/EventMgr';
import { GameEvent, UIGameEvent } from '../Constant';

//控制UI，注意絕對不要讓UI代碼調用遊戲邏輯代碼，完全通過事件驅動(EventMgr)。
export class UILoadingCtrl extends Component {
    private perBar: Sprite = null;
    private perLable: Label = null;
    private _per: number = 0;//當前的進度百分比
    private get per(): number {
        return this._per;
    }
    private set per(value: number) {
        this._per = value;
        this.perBar.fillRange = this._per;
        this.perLable.string = Math.floor(this._per * 100) + "%";
    }

    private moveSpeed: number = 0.5;//進度條的移動速度
    private movingTime: number = 0;
    private passedTime: number = 0;
    private isMoving: boolean = false;//進度條是否在移動中

    public Init() {
        //初始化進度條
        this.perBar = this.node.getChildByPath("pro_progress/pro_bar").getComponent(Sprite);
        this.perBar.fillRange = 0;
        //初始化載入百分比
        this.perLable = this.node.getChildByPath("pro_progress/lab_progress").getComponent(Label);
        this.perLable.string = "0%";

        this.per = 0;
        this.isMoving = false;
        EventMgr.Instance.AddListener(GameEvent.UI, this.OnUIEventProcess, this);
    }

    protected onDestroy(): void {
        EventMgr.Instance.RemoveListener(GameEvent.UI, this.OnUIEventProcess, this);
    }

    protected update(dt: number): void {
        //如果沒有移動需求就直接返回
        if (!this.isMoving) return;

        //將經過的時間賦值。
        this.passedTime += dt;

        const moveDistance = this.per + this.moveSpeed * dt;
        this.per = Math.min(moveDistance, 1);//進度條不能超過1

        //如果經過的時間超過了目標時間
        if (this.passedTime >= this.movingTime) {
            this.isMoving = false;
        }

        if (this.per >= 0.999) {
            this.per = 1;
            this.scheduleOnce(() => {
                EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingEnded, null)
            }, 0.5);
        }
    }

    //當進度更新，開始執行移動邏輯
    private OnSyncLoadingPer(per: number): void {
        //進度為0以下就不更新了
        if (per <= 0) return;

        this.isMoving = true;//進度條要移動了
        this.movingTime = (per - this.per) / this.moveSpeed;//進度條移動到新的進度需要的時間(target)
        this.passedTime = 0;//到達目標所花費的時間(currentTime)
    }

    private OnUIEventProcess(mainEvent: number, subEvent: number, udata: any): void {
        switch (subEvent) {
            case UIGameEvent.UILoadingPer:
                this.OnSyncLoadingPer(udata);
                break;
        }
    }
}