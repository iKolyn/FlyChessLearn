//定義常量，是所有的事件主類型
export enum GameEvent {
    UI,
    AI,
    System,
}

//我的UI事件子類型
export enum UIGameEvent {
    Invalid = 1,
    UILoadingPer,//加載中
    UILoadingEnded,//加載完成
    UIConfigGame,//設定遊戲
    UIGameStarted,//開始遊戲
    //...
}

//還有更多的EventType
export enum AIGameEvent {
    //...
    AIDoAction,
}

//GM_Config，我們直接寫死，你可以試著從表格拿取。
export enum RoleType {
    Invalid = 1,
    BlueRole,
    GreenRole,
    RedRole,
    YellowRole,
}

export enum GameState{
    Invalid = 1,//不能用
    Ready,//資源準備好
    Started,//遊戲開始了

    RoundTime,//輪到玩家操作
    RoundInterval,//輪到玩家操作完，等待下一個玩家

    Checked,//遊戲結算了
}

export enum ChessState{
    Invalid = 1,
    Stopped,//停機了
    TakedOff,//起飛了
    Arrived,//到達終點
}
