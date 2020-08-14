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
        // 游戏管理员
        GameAdmin: cc.Component,

        Name: 'woodBuilding',
        OffsetY: 100,
        BuildingSize: cc.v2(2, 2),
        Sprite: cc.SpriteFrame,
        SpriteR: cc.SpriteFrame,
        // 建筑是否翻转
        IsRotate: {
            get(){
                return this._IsRotate;
            },
            set(value){
                this._IsRotate = value;
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
            this.IsRotate = false;
        });
        cc.resources.load(this.Name + 'R', cc.SpriteFrame, (err, sprite)=>{
            this.SpriteR = sprite;
        })

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            // 检查游戏是否处于编辑态
            if(this.GameAdmin.GameState == 1){
                let EditCanvas = this.GameAdmin.EditCanvas; 
                if(!EditCanvas.active){
                    EditCanvas.active = true;
                    EditCanvas.setPosition(this.node.x, this.node.y);
                    EditCanvas.addChild(this.node);
                    EditCanvas.getComponent('EditBuilding').Building = this.node;
                    EditCanvas.getComponent('EditBuilding').GridSize = this.BuildingSize;
                    EditCanvas.canPutDown = EditCanvas.checkGrid(this.node.position);
                    this.node.setPosition(0, this.OffsetY);
                }
            }
        }, this);
    },
 
    start () {
        this.GameAdmin = cc.find('/GameAdmin').getComponent('GameAdmin');
    },
    Rotate(){
        this.IsRotate = !this.IsRotate;
    }
    // update (dt) {},
});
