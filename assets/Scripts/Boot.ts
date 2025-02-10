import { _decorator, Component, Node } from 'cc';
import { GameApp } from './Game/GameApp';
const { ccclass, property } = _decorator;

@ccclass('Boot')
export class Boot extends Component {

    private InitFramework(): void {
        // 初始化框架的其它模块
        // end

        // 初始化游戏GameApp模块，作为控制中心;
        this.node.addComponent(GameApp);
        GameApp.Instance.Init();
    }


    protected onLoad(): void {
        this.InitFramework();
    }

    protected start(): void {
        GameApp.Instance.EnterGame();   
    }
}


