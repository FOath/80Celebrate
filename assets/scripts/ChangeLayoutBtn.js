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
        Hint: cc.Node,
        HintLabel: cc.Node,
        sprite0: cc.SpriteFrame,
        sprite1: cc.SpriteFrame,
        LabelArray: [],
    },
    start(){
        this.GameAdmin = cc.find('GameAdmin').getComponent('GameAdmin');
        this.LabelArray = [
            "这片地嗯...是片宝地",
            "人就要吃苦耐劳",
            "上网不涉密？然后什么来着",
            "点我换换新布局吧"
        ]
        this.timer = 0;
    },
    update(dt){
        if(this.GameAdmin.GameState == 0){
            this.timer += dt;
            if(this.timer > 4){
                let rand = Math.floor(Math.random() * 4);
                this.HintLabel.getComponent(cc.Label).string = this.LabelArray[rand];
                this.timer = 0;
            }
        }
    },
    onClick(){
        this.GameAdmin.switchGameState();
        if(this.GameAdmin.GameState == 0){
            this.HintLabel.getComponent(cc.Label).string = "修的还挺漂亮";
            this.getComponent(cc.Button).normalSprite = this.sprite0;
            this.getComponent(cc.Button).pressedSprite = this.sprite0;
            this.getComponent(cc.Button).hoverSprite = this.sprite0;
            this.getComponent(cc.Button).disabledSprite = this.sprite0;
        }
        else if(this.GameAdmin.GameState == 1){
            this.HintLabel.getComponent(cc.Label).string = "摆完记得点我";
            this.timer = 0;
            this.getComponent(cc.Button).normalSprite = this.sprite1;
            this.getComponent(cc.Button).pressedSprite = this.sprite1;
            this.getComponent(cc.Button).hoverSprite = this.sprite1;
            this.getComponent(cc.Button).disabledSprite = this.sprite1;
        }
    }
});
