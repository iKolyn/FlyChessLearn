import { _decorator, Component, instantiate, Node } from 'cc';
import { ResMgr } from '../../Framework/ResMgr';
import { GM_FlyChess } from './GM_FlyChess';

export class GM_Player extends Component {

    private seatID: number = 0;
    private isSelf: boolean = false;

    public async Init(seadID: number, isSelf: boolean) {
        this.seatID = seadID;
        this.isSelf = isSelf;
        //給玩家四個棋子，棋子本身也同樣有狀態，是沒有起飛、已經起飛、已經到達終點。
        //需要找到放棋子的初始節點
        const root = this.node.getChildByName("node_chess");
        const nodeRoot = this.node.getChildByName("node_point");

        //生成四個棋子，要從ResMgr拿資源。看有沒有比較簡短的寫法。
        for (let i = 0; i < 4; i++) {
            const chessPrefab = await ResMgr.Instance.AwaitGetAsset("Game", "chess");
            const chess = instantiate(chessPrefab) as Node;
            root.addChild(chess);

            // 擺設棋子的位置
            const name = "point_home_" + (this.seatID * 4 + i);
            const point = nodeRoot.getChildByName(name);
            chess.setWorldPosition(point.getWorldPosition());//3D用世界座標更方便，不用管父節點
            // end
            //根據不同座位去設定顏色
            chess.addComponent(GM_FlyChess).Init(this.seatID);
        }
    }
    public TurnToPlayer(): void {
        //輪到自己了
        console.log("[TurnToPlayer]:" + this.seatID);
    }
    public OnRoundEnd(): void {
        console.log("[OnRoundEnd]:" + this.seatID);
    }
}
