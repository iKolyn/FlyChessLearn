import { _decorator, Component, director, Node, Prefab } from 'cc';
import { GameApp } from './Game/GameApp';
import { ResMgr } from './Framework/ResMgr';
import { EventMgr } from './Framework/EventMgr';
const { ccclass, property } = _decorator;

//所有程式的起點，他將會被掛載在boot節點上。
@ccclass('Boot')
export class Boot extends Component {

    private InitFramwork(): void {
        //載入所有框架需要用的模塊/類
        this.node.addComponent(ResMgr).Init();
        this.node.addComponent(EventMgr).Init();

        //載入GameApp作為控制中心
        this.node.addComponent(GameApp).Init();
    }

    protected onLoad(): void {
        //此節點不會隨著場景消除而消失，是常駐節點
        director.addPersistRootNode(this.node);
        //初始化框架
        this.InitFramwork();
    }

    protected start(): void {
        GameApp.Instance.EnterGame();
    }
}
