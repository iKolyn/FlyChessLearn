import { _decorator, assetManager, AssetManager, Component, Node, Prefab } from 'cc';

export class ResMgr extends Component {
    static _instance: ResMgr = null;
    public static get Instance():ResMgr{
        return this._instance ??= new ResMgr();
    }

    public Init():void{

    }

    
    //先加載bundle
    private async LoadBundle(bundleName: string) {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, assetItem) => {
                //err代表錯誤訊息的產生。如果出現了就reject回報錯誤，成功就回傳bundle。
                err ? reject(null) : resolve(assetItem);
            })
        })
    }
    //再加載裡面的資源
    private LoadAssetInBundle(b:AssetManager.Bundle,url:string,type:any = Prefab){
        return new Promise((resolve,reject) =>{
            b.load(url,type,(err,asset)=>{
                err ? reject(err) : resolve(asset);
            })
        })
    }
    //資源加載，用async / await取代異步
    //使用方式：ResMgr.Instance.AwaitGetAsset("GUI","UIGame",SpriteFrame);
    public async AwaitGetAsset(bundleName: string, url: string, type: any = Prefab) {
        //先加載Bundle
        var b: AssetManager.Bundle = assetManager.getBundle(bundleName);
        if (b == null) {
            b = await this.LoadBundle(bundleName) as AssetManager.Bundle;
            if(!b){
                return null;
            }
        }
        //然後加載Bundle裡面的資源
        var asset = await this.LoadAssetInBundle(b,url,type);
        
        return asset;
    }

}


