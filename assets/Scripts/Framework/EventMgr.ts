import { _decorator, Component, Node } from 'cc';

/*負責管理事件發送與接收，等於一個觀察者設計模式的管理員。
    mainEventType:主事件類型
    subEventType:主類中的子類
    udata:事件所帶的數據
*/
export class EventMgr extends Component {
    static _instnace: EventMgr = null;
    public static get Instance(): EventMgr {
        return this._instnace ??= new EventMgr();
    }
    private eventMap: Map<number, Array<{ callBack: Function, self: any }>> = new Map();
    //訂閱事件的map對象。可以更快速的查找對應的事件。
    public Init() {
        this.eventMap = new Map();
    }

    public AddListener(mainEventType: number, OnEventProccess: Function, target: any) {
        //如果該事件類型不存在，就創造一個新的事件類型，並給他新的數組用來儲存需要處理的回調函數+對象
        if (!this.eventMap.has(mainEventType)) {
            this.eventMap.set(mainEventType, []);
        }
        //將回調函數+對象添加到對應的事件類型中
        this.eventMap.get(mainEventType).push({ callBack: OnEventProccess, self: target });
    }

    public RemoveListener(mainEventType: number, OnEventProccess: Function, target: any) {
       //確定該Map的主類型是否存在，存在的話就開始刪除回調事件
        if (this.eventMap.has(mainEventType)) {
            //將這個map中的mainEventType對應的事件數組刪除。
            /*過濾掉所有不是刪除目標的key跟value。使用||而不是&&的原因：
                    假設現在我的數組是{
                        object1,target1
                        object2,target1
                        object2,target1
                        object2,target2 <== 想刪除的目標
                    }
                    如果使用&&的話，所有object是2 或者 target是2的都會被刪除。
                    最終你只會保留object1,target1。
                    使用||就等於，你一定要object跟target都不是目標，你才會被刪除。
                    這樣就能夠更精確的刪除目標。
                    */
            this.eventMap.set(mainEventType,
                this.eventMap.get(mainEventType).filter((handle) =>
                    handle.callBack !== OnEventProccess || handle.self !== target
                )
            );
        }
    }
    
    public Emit(mainEventType:number,subEventType:number,udata:any){
        //確定該Map的主類型是否存在，存在的話就開始發送事件
        if(this.eventMap.has(mainEventType)){
            //get所有指定的主事件類型，遍歷所有回調函數並且call調用。
            //再次補充handle是代表著{callBack:Function,self:any}的對象。
            this.eventMap.get(mainEventType).forEach((handle)=>{
                //call的時候首先要指定this是這個回調函數自己，避免this指向不明。後面就是你需要傳遞的參數了。
                handle.callBack.call(handle.self,mainEventType,subEventType,udata);                
            })
        }
    }

}


