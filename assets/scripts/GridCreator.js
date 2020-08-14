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
        GameAdmin: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.GameAdmin = cc.find("/GameAdmin");
        this.rhombusWidth = this.GameAdmin.getComponent('GameAdmin').rhombusWidth;
        this.rhombusHeight = this.GameAdmin.getComponent('GameAdmin').rhombusHeight;
        this.lineCount = this.GameAdmin.getComponent('GameAdmin').lineCount; // 注意N行要画N + 1条直线
        this.createGrid();
    }, 
    createGrid(){
        if(this.lineCount % 2 != 0)
            return;
        
        let graphics = this.getComponent(cc.Graphics);
        if(!graphics){
            graphics = this.addComponent(cc.Graphics);
        }
        let halfWidth = this.rhombusWidth / 2;
        let halfHeight = this.rhombusHeight / 2;
        let offsetH = this.lineCount * this.rhombusWidth / 2;
        let offsetV = this.lineCount * this.rhombusHeight / 2;
        // 斜向上
        for(let i = 0; i <= this.lineCount; ++i){
            graphics.moveTo(i * halfWidth - offsetH, -i * halfHeight);
            graphics.lineTo(i * halfWidth, -i * halfHeight + offsetV);
        }
        // 斜向下
        for(let i = 0; i <= this.lineCount; ++i){
            graphics.moveTo(i * halfWidth - offsetH, i * halfHeight);
            graphics.lineTo(i * halfWidth, i * halfHeight - offsetV);
        }
        graphics.stroke();
    }
    // update (dt) {},
});
