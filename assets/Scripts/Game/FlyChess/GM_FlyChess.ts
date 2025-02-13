import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame, Sprite } from 'cc';
import { ChessState } from '../Constant';
import { ResMgr } from '../../Framework/ResMgr';

export class GM_FlyChess extends Component {

    private state: ChessState = ChessState.Invalid;
    private roleIndex: number = 0;
    //依照你是哪個棋子去做。
    public async Init(roleIndex: number) {
        this.state = ChessState.Stopped;//給棋子們的初始狀態。
        //根據棋子顏色換圖片
        const sp: SpriteFrame = await ResMgr.Instance.AwaitGetAsset("Chesses", "fly_" + roleIndex + "/spriteFrame", SpriteFrame) as SpriteFrame;
        const sprite = this.node.getComponentInChildren(Sprite).spriteFrame = sp;
        //換圖片成功，這邊可以用altas，但益智類遊戲性能不會有太大問題。
    }
}
