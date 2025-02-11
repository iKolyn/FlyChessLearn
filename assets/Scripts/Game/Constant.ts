//定義常量，是所有的事件主類型
export enum GameEvent {
    UI,
    AI,
    System,
}

//我的UI事件子類型
export enum UIGameEvent {
    UILoadingPer,//加載中
    UILoadingEnded,//加載完成
    UIGameStarted,//開始遊戲
    //...
}

//還有更多的EventType
export enum AIGameEvent{
    //...
    AIDoAction,
}


