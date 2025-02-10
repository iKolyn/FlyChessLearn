import { _decorator, Component, Node, Prefab } from 'cc';
import { ResMgr } from '../Framework/ResMgr';

export class GameApp extends Component {
    static _instance: GameApp = null;
    public static get Instance(): GameApp {
        return this._instance ??= new GameApp();
    }

    public Init(): void {

    }

    public async EnterGame() {
        console.log("EnterGame ====!");
        var uigamePrefab = await ResMgr.Instance.AwaitGetAsset("GUI","UIGame") as Prefab;
        console.log(uigamePrefab);
    }
}


