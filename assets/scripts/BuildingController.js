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
        Name: 'woodBuilding',
        Sprite: cc.SpriteFrame,
        SpriteR: cc.SpriteFrame,
        // 建筑是否翻转
        isRotate: {
            get(){
                return this._isRotate;
            },
            set(value){
                this._isRotate = value;
                if(!value)
                    this.getComponent(cc.Sprite).spriteFrame = this.Sprite;
                else
                    this.getComponent(cc.Sprite).spriteFrame = this.SpriteR;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.resources.load(this.Name, cc.SpriteFrame, (err, sprite)=>{
            this.Sprite = sprite;
            this.isRotate = false;
        });
        cc.resources.load(this.Name + 'R', cc.SpriteFrame, (err, sprite)=>{
            this.SpriteR = sprite;
        })
    },

    start () {

    },

    // update (dt) {},
});
