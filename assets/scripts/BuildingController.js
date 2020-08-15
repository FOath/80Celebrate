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
        BuildingBuff: 0x0000000, // 0x0000000指无buff, X位为1代表是EpicBuildingX的效果
        Sprite: cc.SpriteFrame,
        SpriteR: cc.SpriteFrame,
        Science: 0,
        Culture: 0,
        Charm: 0,
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
                if(!EditCanvas)
                    return;
                
                EditCanvas.getComponent('EditBuilding').setBuilding(this.node, 1);
            }
        }, this);
    },
 
    start () {
        this.IsRotate = false;
        this.GameAdmin = cc.find('/GameAdmin').getComponent('GameAdmin');
        // 网格属性获取 
        this.rhombusWidth = this.GameAdmin.rhombusWidth;
        this.rhombusHeight = this.GameAdmin.rhombusHeight;
        // 网格偏移赋值
        this.GridOffset = cc.v2((this.BuildingSize.y-this.BuildingSize.x) * this.rhombusWidth / 4, 
                                         (this.BuildingSize.x + this.BuildingSize.y - 2) * this.rhombusHeight / 4);
    },
    rotate(){
        this.IsRotate = !this.IsRotate;
    },
    getOutput(){
        // 非史诗建筑才需要算产出
        let record = 0x0000000;
        if(this.BuildingBuff == 0x0000000){
            for(let i = 0; i < this.BuildingSize.y; ++i){
                for(let j = 0; j < this.BuildingSize.x; ++j){
                    let offset = cc.v2((j - i) * this.rhombusWidth / 2, -(i + j) * this.rhombusHeight / 2);
                    let gridPos = cc.v2(x, y).add(offset);

                    record = record | this.GameAdmin.BuildingBuffArray[gridPos.x][gridPos.y];
                }
            }
        }
        
        for(let i = 0; i < this.GameAdmin.EpicBuilding.length; ++i){
            let sign = 0x0000001 << i;
            if(record & sign != 0){
                this.Science *= this.GameAdmin.EpicBuilding[i].x;
                this.Charm *= this.GameAdmin.EpicBuilding[i].z;                
            }    
        }
    },
    gridPosToGridCoord(x, y){
        let k = this.rhombusHeight / this.rhombusWidth;
        let b1 = y - x * k;
        let xNum = Math.floor((b1 + this.lineCount * this.rhombusHeight + 0.5 * this.rhombusHeight) / this.rhombusHeight);
        xNum = (2 * this.lineCount) - xNum; // x轴上的映射方向是相反的

        let b2 = y + x * k;
        let yNum = Math.floor((b2 + this.lineCount * this.rhombusHeight + 0.5 * this.rhombusHeight) / this.rhombusHeight);

        return cc.v2(xNum, yNum);
    }
    // update (dt) {},
});
