import { _decorator, Component, Node } from 'cc';

export class GameApp extends Component {
    static _instance: GameApp = null;
    public static get Instance(): GameApp {
        return this._instance ??= new GameApp();
    }

    public Init(): void {

    }

    public EnterGame(): void {
        console.log("EnterGame ====!");
    }
}


