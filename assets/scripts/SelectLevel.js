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
        GameGlobalData: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.GameGlobalData = cc.find('/GameGlobalData');

        this.Levels = new Array();
        for(let i = 1; i <= 8; ++i){
            this.Levels[i] = this.node.getChildByName("Level" + i);
        }

        let level = this.GameGlobalData.getComponent('GameGlobalData').level;
        for(let i = level + 1; i <= 8; ++i){
            this.Levels[i].getComponent(cc.Button).interactable = false;
            this.Levels[i].getChildByName("Background").color = cc.color(180, 180, 180);
        }
    },
    selectLevel(event, level){
        cc.log("load level " + level);
        cc.game.addPersistRootNode(this.GameGlobalData);
        this.GameGlobalData.getComponent('GameGlobalData').currentLevel = parseInt(level);
        cc.director.loadScene("levelScene");
    },
    backToMain(){
        cc.director.loadScene("main");
    }
    // update (dt) {},
});
