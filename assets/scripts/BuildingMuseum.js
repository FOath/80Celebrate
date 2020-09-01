// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        canvasState: 0, // 0 表示商店打开， 1表示背包打开
        
        StoreBtn: cc.Node,
        StoreScrollView: cc.Node,
        StoreContent: cc.Node,

        BackpackBtn: cc.Node,
        BackpackScrollView: cc.Node,
        BackpackContent: cc.Node,
        
        // 帮助界面
        HelpCanvas: cc.Node,
        HelpBtn: cc.Node,
        HelpSprite: cc.SpriteFrame,
        HelpSpriteDisable: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {

    //},

    start () {
        // 商店初始化一次即可
        for(let i = 0; i < 12; ++i){
            cc.resources.load("prefabs/storeItem", (err, item)=>{
                var storeItem = cc.instantiate(item);
                storeItem.getComponent('StoreItem').init(i);
                this.StoreContent.addChild(storeItem);
            });
        }
    },
    init(){
        this.GameGlobalData = cc.find('/GameGlobalData').getComponent('GameGlobalData');
        switch(this.canvasState){
            case 0:
                this.openStore();
                break;
            case 1:
                this.openBackpack();
                break;
        }
        
    },
    openStore(){
        this.canvasState = 0;
        // 商店初始化一次即可，不需要每次都开都初始化
        // 设置商店界面显示，商店按钮不可用
        this.StoreBtn.getComponent(cc.Button).interactable = false;
        this.StoreScrollView.active = true;
        // 设置背包界面显示，背包按钮可用
        this.BackpackBtn.getComponent(cc.Button).interactable = true;
        this.BackpackScrollView.active = false;
    },
    openBackpack(){
        this.canvasState = 1;
        // 初始化背包
        this.BackpackContent.removeAllChildren();
        for(let i = 0; i < this.GameGlobalData.BackpackBuilding.length; ++i){
            cc.resources.load("prefabs/backpackItem", (err, item)=>{
                var backpackItem = cc.instantiate(item);
                let id = this.GameGlobalData.BackpackBuilding[i].buildingId;
                let level = this.GameGlobalData.BackpackBuilding[i].level;
                backpackItem.getComponent('BackpackItem').init(id, level);
                this.BackpackContent.addChild(backpackItem);
            });
        }
        // 设置背包界面显示，背包按钮不可用
        this.BackpackBtn.getComponent(cc.Button).interactable = false;
        this.BackpackScrollView.active = true;
        // 设置背包界面显示，背包按钮可用
        this.StoreBtn.getComponent(cc.Button).interactable = true;
        this.StoreScrollView.active = false;
    },
    openInstruction(){
        if(this.HelpCanvas.active){
            this.HelpCanvas.active = false;
            this.HelpBtn.getComponent(cc.Button).normalSprite = this.HelpSprite;
            this.HelpBtn.getComponent(cc.Button).pressedSprite = this.HelpSprite;
            this.HelpBtn.getComponent(cc.Button).hoverSprite = this.HelpSprite;
            this.HelpBtn.getComponent(cc.Button).disabledSprite = this.HelpSprite;
        }
        else{
            this.HelpCanvas.active = true;
            this.HelpBtn.getComponent(cc.Button).normalSprite = this.HelpSpriteDisable;
            this.HelpBtn.getComponent(cc.Button).pressedSprite = this.HelpSpriteDisable;
            this.HelpBtn.getComponent(cc.Button).hoverSprite = this.HelpSpriteDisable;
            this.HelpBtn.getComponent(cc.Button).disabledSprite = this.HelpSpriteDisable;
        }
    }
    // update (dt) {},
});
