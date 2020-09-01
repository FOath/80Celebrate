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
        // 游戏全局数据
        GameGlobalData: cc.Component,


        buildingId: {
            get(){
                return this._buildingId;
            },
            set(value){
                this._buildingId = value;
                this.buildingName = this.GameGlobalData.BuildingType[value].name;
                this.science      = this.GameGlobalData.BuildingType[value].science;
                this.culture      = this.GameGlobalData.BuildingType[value].culture;
                this.charm        = this.GameGlobalData.BuildingType[value].charm;
                this.size         = this.GameGlobalData.BuildingType[value].size;
                this.epicType     = this.GameGlobalData.BuildingType[value].epicType;
                this.imageUrl     = this.GameGlobalData.BuildingType[value].imageUrl;
            }
        },
        buildingName: "实验楼",
        science: 0,
        culture: 0,
        charm: 0,
        size: {
            get(){
                return this._size;
            },
            set(value){
                this._size = value;
                this.gridOffset = cc.v2((this.size.y-this.size.x) * this.rhombusWidth / 4, 
                                         (this.size.x + this.size.y - 2) * this.rhombusHeight / 4);
            }
        },
        epicType: 0,
        imageUrl: 'woodBuilding',

        // 预置体自身的数据
        offsetY: 100,
        level: 0, // 建筑等级
        gridOffset: null,

        Sprite: cc.SpriteFrame,
        SpriteR: cc.SpriteFrame,
        
        // 建筑是否翻转
        isRotate: {
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
        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            // 检查游戏是否处于编辑态
            if(this.GameAdmin.GameState == 1){
                let EditCanvas = this.GameAdmin.EditCanvas;
                if(!EditCanvas || this.node.parent == EditCanvas)
                    return;
                EditCanvas.getComponent('EditBuilding').setBuilding(this.node, 1);
            }
        }, this);
    },
    start () {
        
    },
    init(id, level){
        // 游戏管理员
        this.GameAdmin = cc.find('/GameAdmin').getComponent('GameAdmin');
        // 游戏全局数据
        this.GameGlobalData = cc.find('/GameGlobalData').getComponent('GameGlobalData');
        // 网格属性获取
        this.rhombusWidth = this.GameGlobalData.rhombusWidth;
        this.rhombusHeight = this.GameGlobalData.rhombusHeight;
        this.lineCount = this.GameGlobalData.lineCount;
        // 设置建筑id
        this.buildingId = id;
        // 获得建筑产出属性
        this.science = this.GameGlobalData.BuildingType[id].science;
        this.culture = this.GameGlobalData.BuildingType[id].culture;
        this.charm   = this.GameGlobalData.BuildingType[id].charm;
        // 设置建筑等级
        this.level = level;

        cc.resources.load(this.imageUrl, cc.SpriteFrame, (err, sprite)=>{
            this.Sprite = sprite;
            this.isRotate = false;
        });
        cc.resources.load(this.imageUrl + 'R', cc.SpriteFrame, (err, sprite)=>{
            this.SpriteR = sprite;
        });
    },
    rotate(){
        this.isRotate = !this.isRotate;
        this.size = cc.v2(this.size.y, this.size.x);
    },
    getProduct(){
        // 非史诗建筑才需要算产出
        let record = 0;
        if(this.epicType == 0){
            for(let i = 0; i < this.size.y; ++i){
                for(let j = 0; j < this.size.x; ++j){
                    let offset = cc.v2((j - i) * this.rhombusWidth / 2, -(i + j) * this.rhombusHeight / 2);
                    let gridPos = cc.v2(this.node.x, this.node.y).add(this.gridOffset).add(offset);
                    let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);

                    record = record | this.GameGlobalData.BuildingBuffArray[gridCoord.x][gridCoord.y];
                }
            }
        }
        let science = this.science;
        let charm = this.charm;
        for(let i = 0; i < this.GameGlobalData.EpicBuildingBuff.length; ++i){
            let sign = 1 << i;
            if((record & sign) != 0){
                science *= this.GameGlobalData.EpicBuildingBuff[i].x;
                charm *= this.GameGlobalData.EpicBuildingBuff[i].z;                
            }
        }
        return cc.v3(science, this.culture, charm);
    },
    putDown(parent, x, y){
        this.node.parent = parent;
        //cc.log(x + ' ' + y);
        this.node.setPosition(x, y);
        let coord = this.gridPosToGridCoord(this.node.x + this.gridOffset.x, this.node.y + this.gridOffset.y);
        this.node.zIndex = this.calculateZIndex(coord.x, coord.y);

        this.GameAdmin.computeProduct();
    },
    calculateZIndex(x, y){
        let newX = (2 * this.lineCount)- y;
        let newY = x;
        let line = newX + newY + 1;

        let tempSum = 0;
        for(let i = 1; i < line; ++i){
            if(i <= (2 * this.lineCount + 1)){
                tempSum += i;
            }
            else{
                tempSum += (4 * this.lineCount + 2 - i);
            }
        }

        if(line <= (2 * this.lineCount + 1))
            tempSum += newY;
        else{
            let delta = line - (2 * this.lineCount + 1);
            tempSum += (newY - delta);
        }

        return tempSum;
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
