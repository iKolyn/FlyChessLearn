import { _decorator, Component, Node, Prefab } from 'cc';
import { ResMgr } from '../Framework/ResMgr';
import { EventMgr } from '../Framework/EventMgr';

//負責掌控所有遊戲邏輯的控制中心
export class GameApp extends Component {
    static _instance: GameApp = null;
    public static get Instance(): GameApp {
        return this._instance ??= new GameApp();
    }


    public Init() {

    }

    public async EnterGame() {
        // var UIPrefab = await ResMgr.Instance.AwaitGetAsset("GUI", "UIMain") as Prefab;
        // console.log(UIPrefab);這鞭策適用

        EventMgr.Instance.AddListener(1, this.OnGameStart, this);

        EventMgr.Instance.Emit(1, 10001, "GameStarted");
        this.scheduleOnce(() => {
            console.log("Remove Event!");
            EventMgr.Instance.RemoveListener(1, this.OnGameStart, this);
        }, 5);

        //測試再刪除的時候有沒有刪除成功，如果不會出現OnGameStart的log就代表成功了
        this.scheduleOnce(() => {
            console.log("test Remove! ####");
            EventMgr.Instance.Emit(1, 10001, "GameStarted");
        }, 6);
    }

    private OnGameStart(mainType: number, subType: number, udata: any): void {
        console.log(mainType, subType, udata);
    }

}


