import { _decorator, Component, Node, instantiate } from 'cc';
import { GM_Config } from '../Configs/GM_Config';
import { GameState } from '../Constant';
import { GM_Player } from './GM_Player';
//作為遊戲節奏的管理器，負責管理遊戲的進行。
//每個房間都有基於遊戲，Room ==> 座位。

export class GM_RoomMgr extends Component {
    //因為我們會很常調用RoomMgr，所以我們要做靜態變量去處理。
    //使用假單例，因為這個管理員在一局結束後就saygoodbye了
    public static instantiate: GM_RoomMgr = null;

    private state: GameState = GameState.Invalid;

    private playerNum: number = 0;//多少玩家數量
    private selfSeatID: number = 0;//玩家在哪個位置
    private takeOf: number[] = [];//能起飛的骰子數
    //使用Array<number>跟number[]是一樣的，只是寫法不同而已。
    private seats: GM_Player[] = [];//座位，玩家的位置。
    private curIndex: number = -1;//當前輪到的玩家，-1是代表沒開始
    private roundTime: number = 0;//每個回合的時間
    private intervalTime: number = 0;
    private passedTime: number = 0;

    public async Init(config: any) {
        GM_RoomMgr.instantiate = this;

        this.state = GameState.Invalid;
        // 根據配置來得到配置數據。
        this.playerNum = GM_Config.Datas.PlayerNum[config.playerNumIndex];
        this.roundTime = GM_Config.Datas.RoundTime[config.playerNumIndex];//roundTime與playerNumIndex關聯
        this.intervalTime = GM_Config.Datas.RoundIntervalTime[config.playerNumIndex];
        this.selfSeatID = GM_Config.Datas.RoleType[config.roleIndex];
        this.takeOf = GM_Config.Datas.TakeOfValue[config.takeOffIndex];

        // 創建遊戲數據，玩家，玩家對應的飛行旗
        //普通玩家跟電腦玩家 ===>GM_CherectorX GM_PlayerV
        this.seats = new Array<GM_Player>();
        //創建對應數目的玩家。
        for (let i = 0; i < this.playerNum; i++) {
            const p = await this.node.addComponent(GM_Player);
            p.Init(i, this.selfSeatID === i);
            this.seats.push(p);
        }
        /* 不可以這樣寫，array裡面沒東西。
        // this.seats.forEach((player,index) =>{
        //     this.node.addComponent(GM_Player).Init(index,this.selfSeatID == index);   
        // })
        */
        //end

        // 地圖路徑的加載
        // end

        this.curIndex = -1;
        //可以到計時三秒鐘以後開始
        this.StartGame();
    }
    //開始，操作時間，操作完等一下才進下回合
    //[Started,RoundTime,RoundInterval,]
    private TurnToNextPlayer(): void {
        //只要不是遊戲開始，也不是回合間隔，就不給玩家操作。
        if (this.state !== GameState.Started && this.state !== GameState.RoundInterval) return;
        this.state = GameState.RoundTime;
        this.passedTime = 0;

        this.curIndex++;
        this.curIndex = (this.curIndex >= this.playerNum) ? 0 : this.curIndex;

        this.seats[this.curIndex].TurnToPlayer();
    }

    StartGame(): void {
        if (this.state !== GameState.Invalid) return;
        //輪到玩家後，骰子才會出來，代表輪到玩家了。
        this.state = GameState.Started;
        //每一次流程結束，就會換下一個人繼續。
        this.TurnToNextPlayer();
    }

    protected update(dt: number): void {
        if (this.state === GameState.RoundTime) {
            this.passedTime += dt;
            if (this.passedTime >= this.roundTime) {
                this.state = GameState.RoundInterval;

                this.seats[this.curIndex].OnRoundEnd();
                this.passedTime = 0;
            }
            return;
        }
        else if (this.state === GameState.RoundInterval) {
            this.passedTime += dt;
            if (this.passedTime >= this.intervalTime) {
                this.passedTime = 0;
                this.TurnToNextPlayer();
            }
            return;
        }
    }
}