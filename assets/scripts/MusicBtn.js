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

        Check: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start(){
        this.GameAdmin = cc.find('GameAdmin').getComponent('GameAdmin');
    },
    setMusicState(event){
        if(this.Check.active){
            this.Check.active = false;
        }
        else{
            this.Check.active = true;
        }
        this.GameAdmin.switchBGM();
    }

    // update (dt) {},
});
