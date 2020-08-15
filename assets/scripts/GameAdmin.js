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
        // }
        Background: cc.Node,
        
        // 游戏数据记录区
        // 游戏状态
        GameState: {
            get(){
                return this._GameState;
            },
            set(value){
                this._GameState = value;
            }
        }, // 0 指普通运行态， 1 指编辑态
        // 菱形网格
        rhombusWidth: 200, // 地形菱形网格宽
        rhombusHeight: 100, // 地形菱形网格高
        lineCount: 8,
        // 当前文化值总和
        CultureSum: 0,
        // 编辑界面
        EditCanvas: cc.Node,
        // 可放置区域标记
        BuildingSpaceArray: Array, // 标记为1则该区域已有建筑，标记为0则该区域没有建筑
        // 建筑buff区域标记
        BuildingBuffArray: Array, // 标记该区域的buff，范围为0x0000000到0x0000000
        // 六个史诗建筑各自的属性
        EpicBuilding1: cc.v3(0, 0, 0),
        EpicBuilding2: cc.v3(0, 0, 0),
        EpicBuilding3: cc.v3(0, 0, 0),
        EpicBuilding4: cc.v3(0, 0, 0),
        EpicBuilding5: cc.v3(0, 0, 0),
        EpicBuilding6: cc.v3(0, 0, 0),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始化可放置区域
        this.BuildingSpaceArray = new Array();
        for(let i = 0; i < (2 * this.lineCount + 1); ++i){
            this.BuildingSpaceArray[i] = new Array();
            for(let j = 0; j < (2 * this.lineCount + 1); ++j){
                this.BuildingSpaceArray[i][j] = 0;
            }
        }
        // 把中间的马路设为1
        for(let i = 0; i < (2 * this.lineCount + 1); ++i){
            this.BuildingSpaceArray[this.lineCount][i] = 1;
            this.BuildingSpaceArray[i][this.lineCount] = 1;
        }
        // 初始化buff作用区域
        this.BuildingBuffArray = new Array();
        for(let i = 0; i < (2 * this.lineCount + 1); ++i){
            this.BuildingBuffArray[i] = new Array();
            for(let j = 0; j < (2 * this.lineCount + 1); ++j){
                this.BuildingBuffArray[i][j] = 0x000000;
            }
        }
        // 初始化各种数据
        this.CultureSum = 0;
        this.Background.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
            let screenSize = cc.winSize;
            let offset = event.getDelta();
            let des = cc.v2(this.Background.getPosition().x + offset.x, this.Background.getPosition().y + offset.y);
            let x = this.clamp(des.x, -(this.Background.width - screenSize.width) / 2, (this.Background.width - screenSize.width) / 2);
            let y = this.clamp(des.y, -(this.Background.height - screenSize.height) / 2, (this.Background.height - screenSize.height) / 2);
            this.Background.setPosition(x, y);
        }, this);
    },
    
    start () {
        this.GameState = 1;
        this.EditCanvas = cc.find('/Canvas/GameCanvas/EditCanvas');
    },
    clamp(num, min, max){
        if(num < min){
            return min;
        }
        else if(num > max){
            return max;
        }
        else 
            return num;
    },
    // update (dt) {},
});
