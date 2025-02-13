import { _decorator, Animation, Component, Node } from 'cc';

export class UIGameCtrl extends Component {
    private diceAnim:Animation = null;
    public Init():void{
        this.diceAnim = this.node.getComponentInChildren(Animation);
        this.diceAnim.node.active = false;
        //遊戲沒開始前先隱藏骰子
    }
}


