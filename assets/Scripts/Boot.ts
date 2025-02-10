import { _decorator, Component, director, Node } from 'cc';
import { GameApp } from './Game/GameApp';
import { ResMgr } from './Framework/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Boot')
export class Boot extends Component {

    private InitFramework(): void {
        // 初始化框架的其它模块
        this.node.addComponent(ResMgr).Init();

        // 初始化游戏GameApp模块，作为控制中心;
        this.node.addComponent(GameApp);//這邊寫兩行或寫一行都可以，避免錯誤先寫成兩行。
        GameApp.Instance.Init();
    }


    protected onLoad(): void {
        director.addPersistRootNode(this.node);//常駐節點，不會被刪除。
        this.InitFramework();
    }

    protected start(): void {
        GameApp.Instance.EnterGame();
    }

}


