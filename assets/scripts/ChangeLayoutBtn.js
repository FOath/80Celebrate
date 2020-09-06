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
        GameAdmin: cc.Component,
        sprite0: cc.SpriteFrame,
        sprite1: cc.SpriteFrame
    },
    start(){
        this.GameAdmin = cc.find('GameAdmin').getComponent('GameAdmin');
    },
    onClick(){
        if(this.GameAdmin.GameState == 0){
            this.getComponent(cc.Button).normalSprite = this.sprite1;
            this.getComponent(cc.Button).pressedSprite = this.sprite1;
            this.getComponent(cc.Button).hoverSprite = this.sprite1;
            this.getComponent(cc.Button).disabledSprite = this.sprite1;
        }
        else if(this.GameAdmin.GameState == 1){
            this.getComponent(cc.Button).normalSprite = this.sprite0;
            this.getComponent(cc.Button).pressedSprite = this.sprite0;
            this.getComponent(cc.Button).hoverSprite = this.sprite0;
            this.getComponent(cc.Button).disabledSprite = this.sprite0;
        }
        this.GameAdmin.switchGameState();
    }
});
