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

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.Levels = new Array();
        for(let i = 0; i < 8; ++i){
            this.Levels[i] = this.node.getChildByName("Level" + (i + 1));
        }

        for(let i = 1; i < 8; ++i){
            this.Levels[i].getComponent(cc.Button).interactable = false;
            this.Levels[i].getChildByName("Background").color = cc.color(180, 180, 180);
        }
    },
    selectLevel(event, level){
        cc.log("load level " + level);
        switch(parseInt(level)){
            case 1:
                cc.director.loadScene("levelScene");
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            
        }
    }
    // update (dt) {},
});
