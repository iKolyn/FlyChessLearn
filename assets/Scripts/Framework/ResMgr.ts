import { _decorator, assetManager, AssetManager, Component, Node, Prefab } from 'cc';

//同樣也是單例模式，負責管理所有bundle資源與相關邏輯。
export class ResMgr extends Component {
    static _instance: ResMgr = null;
    public static get Instance(): ResMgr {
        return this._instance ??= new ResMgr();
    }
    

    public Init() {

    }

    
    private async LoadBundle(bundleName: string) {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if(err) console.error(err);
                return err ? reject(err) : resolve(bundle);
            })
        })
    }

    private async LoadAssetInBundle(bundle: AssetManager.Bundle, url: string, type: any = Prefab) {
        return new Promise((resolve, reject) => {
            bundle.load(url, type, (err, asset) => {
                return err ? reject(null) : resolve(asset);
            })
        })
    }

    public async AwaitGetAsset(bundleName: string, url: string, type: any = Prefab) {
        var b: AssetManager.Bundle = assetManager.getBundle(bundleName);
        if (b == null) {
            b = await this.LoadBundle(bundleName) as AssetManager.Bundle;
            if (!b) {
                console.error("LoadBundle Fail");
                return null;
            }
        }
        const asset = await this.LoadAssetInBundle(b, url, type);
        return asset;
    }

}