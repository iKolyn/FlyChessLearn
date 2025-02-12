import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { ResMgr } from '../Framework/ResMgr';
import { EventMgr } from '../Framework/EventMgr';
import { UILoadingCtrl } from './UIControllers/UILoadingCtrl';
import { GameEvent, UIGameEvent } from './Constant';
import { UIMainCtrl } from './UIControllers/UIMainCtrl';
import { UIConfigCtrl } from './UIControllers/UIConfigCtrl';

//負責掌控所有遊戲邏輯的控制中心
export class GameApp extends Component {
    static _instance: GameApp = null;
    public static get Instance(): GameApp {
        return this._instance ??= new GameApp();
    }

    public Init() {
        //這是增加所有UI處理事件的訂閱事件。
        EventMgr.Instance.AddListener(GameEvent.UI, this.OnUIEventProcess, this);
    }

    protected onDestroy(): void {
        EventMgr.Instance.RemoveListener(GameEvent.UI, this.OnUIEventProcess, this);
    }

    //當獲得到UI所發送的事件，我們會根據不同的子事件來做相對應的處理。
    private OnUIEventProcess(mainEventType: number, subEventType: number, udata: any) {
        switch (subEventType) {
            case UIGameEvent.UILoadingEnded://UI加載完畢後，進行的處理。
                this.OnUILoadingEndedEvent();//簡單來說會刪除防沉迷頁面，並載入初始畫面。
            case UIGameEvent.UIConfigGame:
                this.ConfigGame();//當加載完主畫面後，將加載頁面刪除並進入配置頁面。
                break;
            case UIGameEvent.UIGameStarted:
                this.StartGameWithConfig(udata);//依照玩家選擇配置的，處理初始化並進入遊戲。
                break;
        }
    }

    private async StartGameWithConfig(config) {
        console.log(config);
    }

    private async ConfigGame() {
        const canvas = find("Canvas");
        const uiConfigPrefab = await ResMgr.Instance.AwaitGetAsset("GUI", "UIConfig") as Prefab;
        //如果有的話就將他創建出來
        const uiConfig = instantiate(uiConfigPrefab);
        uiConfig.name = uiConfigPrefab.name;//重新命名該節點
        canvas.addChild(uiConfig);//將他加入到當前的畫布中。
        uiConfig.addComponent(UIConfigCtrl).Init();//最後在他身上加入UIMainControl並Init()初始化。

        //記住，我們不能使用GM_Button的模式控制，會導致耦合。所以我們要通過事件驅動來控制。請到UIConfigCtrl查看。
    }

    private async OnUILoadingEndedEvent() {
        this.OnEnterMainPage();

        const canvas = find("Canvas");
        const uiLoading = canvas.getChildByName("UILoading");
        uiLoading?.destroy();
    }

    private async OnEnterMainPage() {
        const canvas = find("Canvas");
        const uiMainPrefab = await ResMgr.Instance.AwaitGetAsset("GUI", "UIMain") as Prefab;
        const uiMain = instantiate(uiMainPrefab);//載入UIMain的Prefab並實例化。
        uiMain.name = uiMainPrefab.name;//命名他。
        canvas.addChild(uiMain);//將他加入到當前的畫布中。
        uiMain.addComponent(UIMainCtrl).Init();//最後在他身上加入UIMainControl並Init()初始化。
    }

    public async EnterGame() {
        const canvas = find("Canvas");
        //一開始先載入UILoading的資源們，成功載入後命名他。
        const uiLoadingPrefab = await ResMgr.Instance.AwaitGetAsset("GUI", "UILoading") as Prefab;
        const uiLoading = instantiate(uiLoadingPrefab);
        uiLoading.name = uiLoadingPrefab.name;
        canvas.addChild(uiLoading);//將他加入到當前的畫布中。
        uiLoading.addComponent(UILoadingCtrl).Init();//最後在他身上加入UILoadingCtrl並Init()初始化。

        canvas.getChildByName("UIBoot")?.destroy();//刪除Boot節點，注意要使用?避免明明沒有還刪導致異常。

        //測試進度條
        // EventMgr.Instance.Emit(GameEvent.UI,UIGameEvent.UILoadingPer,0.25);
        // this.scheduleOnce(()=>{
        //     EventMgr.Instance.Emit(GameEvent.UI,UIGameEvent.UILoadingPer,0.5);
        //     EventMgr.Instance.Emit(GameEvent.UI,UIGameEvent.UILoadingPer,0.75);
        // },3);
        // this.scheduleOnce(()=>{
        //     EventMgr.Instance.Emit(GameEvent.UI,UIGameEvent.UILoadingPer,1);
        // },7);

        this.PreloadGameAssets();
    }

    private async PreloadGameAssets() {
        //因為我們沒有封裝資源，所以手動將所有要加載的資源放入一個陣列中。
        const loadAssetsMap = [
            { abName: "GUI", url: "UIConfig" },
            { abName: "GUI", url: "UIGame" },
            { abName: "GUI", url: "UILoading" },
            { abName: "GUI", url: "UIMain" },
            { abName: "GUI", url: "UIResult" },
            { abName: "Game", url: "board" },
            { abName: "Game", url: "chess" },
            { abName: "Game", url: "diceItem" },
        ];

        //進度條的實作，我們利用要加載的資源數量計算進度條進度。
        const deltaPer = 1 / loadAssetsMap.length;
        let per = 0;
        //遍歷加載每一個資源，同時加per進度增加。最後呼叫EventMgr發送進度條loading事件。
        for (var asset of loadAssetsMap) {
            per += deltaPer;
            //還要等加載資源
            await ResMgr.Instance.AwaitGetAsset(asset.abName, asset.url);
            EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingPer, per);
        }
        //全部加載完以後，避免起見直接強制EventMgr中UILoadingPer的加載進度變成1。
        EventMgr.Instance.Emit(GameEvent.UI, UIGameEvent.UILoadingPer, 1.0);
        //加載完畢以後請回到OnUILoadingEndedEvent()中處理剩餘邏輯。
    }
}
