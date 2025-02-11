import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { ResMgr } from '../Framework/ResMgr';
import { EventMgr } from '../Framework/EventMgr';
import { UILoadingCtrl } from './UIControllers/UILoadingCtrl';
import { GameEvent, UIGameEvent } from './Constant';

//負責掌控所有遊戲邏輯的控制中心
export class GameApp extends Component {
    static _instance: GameApp = null;
    public static get Instance(): GameApp {
        return this._instance ??= new GameApp();
    }

    public Init() {
        EventMgr.Instance.AddListener(GameEvent.UI, this.OnGameEventProcess, this);//暫時的
    }

    private OnGameEventProcess(mainEventType: number, subEventType: number, udata: any) {
        switch (subEventType) {
            case UIGameEvent.UILoadingEnded:
                this.OnUILoadingEndedEvent();
        }
    }

    private OnUILoadingEndedEvent(): void {
        console.log("OnUILoadingEndedEvent called \n");
    }

    public async EnterGame() {
        //加載所有資源加載的頁面
        var canvas = find("Canvas");

        // 先加載我的uiLoading頁面，在那之前場景中會出現我的Boot頁面
        var uiLoadingPrefab = await ResMgr.Instance.AwaitGetAsset("GUI", "UILoading") as Prefab;
        // 等到awaitGetAsset完成後，我們就可以實例化這個節點了。
        var uiLoading = instantiate(uiLoadingPrefab);
        uiLoading.name = uiLoadingPrefab.name;//將這個節點的名字更改為UIBoot
        canvas.addChild(uiLoading);//將這個節點加入到canvas節點下
        uiLoading.addComponent(UILoadingCtrl).Init();
        // end

        // 最後刪除我們的UIBoot節點。
        canvas.getChildByName("UIBoot")?.destroy();

        // 測試進度條
        EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingPer, 0.25);
        this.scheduleOnce(() => {
            EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingPer, 0.5);
            EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingPer, 0.75);
            EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingPer, 1.0);
        }, 5);
        // end
    }
}


