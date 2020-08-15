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
        // 建筑
        Building: cc.Node,
        BuildingBeforePos: cc.v2(0, 0),
        // 设置界面及其子选项
        Setting: cc.Node,
        SettingClose: cc.Node,
        SettingRotate: cc.Node,
        SettingCheck: cc.Node,
        // 编辑网格节点
        EditGrid: cc.Node,
        // 编辑网格大小
        GridSize: {
            get(){
                return this._GridSize;
            },
            set(value){
                this._GridSize = value;
                // 计算网格偏移
                this.GridOffset = cc.v2((value.y-value.x) * this.rhombusWidth / 4, 
                                         (value.x + value.y - 2) * this.rhombusHeight / 4);
                // 更改位置
                let pos = this.node.position.add(this.GridOffset);            
                // 调节位置
                let newPos = this.checkBuildingPosition(pos);
                // 检查位置是否合法
                this.canPutDown = this.checkGrids(newPos);
                this.node.setPosition(newPos.sub(this.GridOffset));
                // 绘制网格
                let graphics = this.EditGrid.getComponent(cc.Graphics);
                graphics.clear();
                let halfWidth = this.rhombusWidth / 2;
                let halfHeight = this.rhombusHeight / 2;
                let origin = this.GridOffset.add(cc.v2(0, 50));
                for(let i = 0; i <= value.x; ++i){
                    let tempStart = origin.add(cc.v2(i * halfWidth, -i * halfHeight));
                    let tempEnd = tempStart.add(cc.v2(- value.y * halfWidth, -value.y * halfHeight));
                    graphics.moveTo(tempStart.x, tempStart.y);
                    graphics.lineTo(tempEnd.x, tempEnd.y);
                }
                // 斜向下
                for(let i = 0; i <= value.y; ++i){
                    let tempStart = origin.add(cc.v2(-i * halfWidth, -i * halfHeight));
                    let tempEnd = tempStart.add(cc.v2(value.x * halfWidth, -value.x * halfHeight));
                    graphics.moveTo(tempStart.x, tempStart.y);
                    graphics.lineTo(tempEnd.x, tempEnd.y);
                }
                graphics.stroke();
            }
        },
        // 编辑类型
        EditType: 0, // 0表示是创建物体，1表示是移动物体        

        // 是否可放置
        canPutDown: {
            get(){
                return this._canPutDown;
            },
            set(value){
                this._canPutDown = value;
                if(!this.EditGrid)
                    this.EditGrid = this.node.getChildByName('EditGrid');
                if(!value){
                    // 编辑网格变色
                    this.EditGrid.getComponent(cc.Graphics).strokeColor = cc.Color.RED;
                }
                else{
                    // 编辑网格变色
                    this.EditGrid.getComponent(cc.Graphics).strokeColor = cc.Color.GREEN;
                }   
                this.EditGrid.getComponent(cc.Graphics).stroke();
                
                if(!this.Setting){
                    this.Setting = this.node.getChildByName('Setting');
                    this.SettingClose = this.Setting.getChildByName('Close');
                    this.SettingRotate = this.Setting.getChildByName('Rotate');
                    this.SettingCheck = this.Setting.getChildByName('Check');                                
                }                
                this.SettingCheck.getComponent(cc.Button).interactable = value;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 绑定点击事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
            let pos = this.node.parent.convertToNodeSpaceAR(event.getLocation()).add(this.GridOffset);            
            // 调节位置
            let newPos = this.checkBuildingPosition(pos);
            // 检查位置是否合法
            this.canPutDown = this.checkGrids(newPos);
            this.node.setPosition(newPos.sub(this.GridOffset));
            // 停止触摸事件传播
            event.stopPropagation();
        }, this);
    },

    start () {
        // 游戏管理员
        this.GameAdmin = cc.find('/GameAdmin').getComponent('GameAdmin');
        // 游戏界面
        this.GameCanvas = cc.find('/Canvas/GameCanvas');
        // 游戏变量获取
        this.rhombusWidth = this.GameAdmin.rhombusWidth;
        this.rhombusHeight = this.GameAdmin.rhombusHeight;
        this.lineCount = this.GameAdmin.lineCount;
        // 建筑
        this.Building = null;
        // 设置界面及其子选项
        this.Setting = this.node.getChildByName('Setting');
        this.SettingClose = this.Setting.getChildByName('Close');
        this.SettingRotate = this.Setting.getChildByName('Rotate');
        this.SettingCheck = this.Setting.getChildByName('Check');
        // 编辑网格
        this.EditGrid = this.node.getChildByName('EditGrid');
        
        this.EditGrid.zIndex = 0;
        this.Setting.zIndex = 2;
        // 计时器
        this.time = 0;
    },
    checkBuildingPosition(pos){
        let halfGridWidth = this.rhombusWidth / 2;
        let halfGridHeight = this.rhombusHeight / 2;

        let xNum = Math.round(pos.x / halfGridWidth);
        let yNum = Math.round(pos.y / halfGridHeight);

        if ((xNum + yNum) % 2 != 0) {
            let k = halfGridHeight / halfGridWidth;
            if (Math.abs(pos.x) <= Math.abs(pos.y) * k)
                ++xNum;
            else
                ++yNum;
        }
        return cc.v2(xNum * halfGridWidth, yNum * halfGridHeight);
    },
    checkGrids(newPos){
        let state = true;
            for(let i = 0; i < this.GridSize.y; ++i){
                for(let j = 0; j < this.GridSize.x; ++j){
                    let offset = cc.v2((j - i) * this.rhombusWidth / 2, -(i + j) * this.rhombusHeight / 2);
                    let gridPos = newPos.add(offset);
                    if(!this.checkGridPosition(gridPos)){
                        state = false;
                        break;
                    }
                }
                if(!state)
                    break; 
            }
        return state;
    },
    checkGridPosition(pos){
        // 首先检查是否越界
        if(Math.abs(0.5 * pos.x) + Math.abs(pos.y) >= (this.lineCount * this.rhombusHeight + 0.5 * this.rhombusHeight))
            return false;
        // 网格位置变为网格坐标
        let gridCoord = this.gridPosToGridCoord(pos.x, pos.y);
        if(this.GameAdmin && this.GameAdmin.BuildingSpaceArray[gridCoord.x][gridCoord.y] == 0)
            return true;
        else
            return false;
    },
    setBuilding(building, type){
        if(this.node.childrenCount >= 3)
            return;
        
        // 显示编辑界面
        this.Setting.active = true;
        this.EditGrid.active = true;
        // 记录建筑之前的位置
        this.EditType = type;
        this.Building = building;
        this.OffsetY = building.getComponent('BuildingController').OffsetY;
        this.GridSize = this.Building.getComponent('BuildingController').BuildingSize;
        if(type == 1){ // 0 表示创建建筑，1表示移动建筑
            this.BuildingBeforePos = cc.v2(building.x, building.y);    
            // 将之前建筑所在地盘的BuildingSpaceArray归0
            this.setBuildingSpaceArray(this.BuildingBeforePos.x + this.GridOffset.x, this.BuildingBeforePos.y + this.GridOffset.y, 0);
            this.canPutDown = true;
        }
        this.node.setPosition(building.x, building.y);
        building.parent = this.node;
        building.zIndex = 1;
        building.setPosition(0, building.getComponent('BuildingController').OffsetY);
        
    },
    rotateBuilding(){
        this.Building.getComponent('BuildingController').rotate();
        if(this.GridSize.x != this.GridSize.y)
            this.GridSize = cc.v2(this.GridSize.y, this.GridSize.x);
    },
    putDownBuilding(){
        if(!this.canPutDown)
            return;
        
        // 将现在建筑所在地盘的BuildingSpaceArray归1
        this.setBuildingSpaceArray(this.node.x + this.GridOffset.x, this.node.y + this.GridOffset.y, 1);
        // 如果建筑是史诗建筑，则给周围一圈设置buff
        if(this.Building.getComponent('BuildingController').BuildingBuff != 0x0000000){
            let origin = cc.v2(this.node.x, this.node.y).add(this.GridOffset).add(cc.v2(0, this.rhombusHeight));
            // 四条边按照上左，上右，下左，下右的顺序设置
            // 上左
            for(let i = 0; i < this.GridSize.x + 2; ++i){
                let offset = cc.v2( i * this.rhombusWidth / 2, -i * this.rhombusHeight / 2);
                let gridPos = origin.add(offset);
                let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                if(gridCoord.x >= 0 && gridCoord.x < this.lineCount && gridCoord.y >= 0 && gridCoord.y < this.lineCount){
                    this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] | this.Building.getComponent('BuildingController').BuildingBuff;
                }
            }
            // 上右
            for(let i = 1; i < this.GridSize.y + 2; ++i){
                let offset = cc.v2( -i * this.rhombusWidth / 2, -i * this.rhombusHeight / 2);
                let gridPos = origin.add(offset);
                let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                if(gridCoord.x >= 0 && gridCoord.x < this.lineCount && gridCoord.y >= 0 && gridCoord.y < this.lineCount){
                    this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] | this.Building.getComponent('BuildingController').BuildingBuff;
                }
            }
            // 下左
            for(let i = 1; i < this.GridSize.x + 2; ++i){
                let offset = cc.v2((i - this.GridSize.y - 1) * this.rhombusWidth / 2, -(this.GridSize.y + 1 + i) * this.rhombusHeight / 2);
                let gridPos = origin.add(offset);
                let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                if(gridCoord.x >= 0 && gridCoord.x < this.lineCount && gridCoord.y >= 0 && gridCoord.y < this.lineCount){
                    this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] | this.Building.getComponent('BuildingController').BuildingBuff;
                }
            }
            // 下右
            for(let i = 1; i < this.GridSize.y + 1; ++i){
                let offset = cc.v2((this.GridSize.x + 1 -i) * this.rhombusWidth / 2, -(this.GridSize.x + 1 + i) * this.rhombusHeight / 2);
                let gridPos = origin.add(offset);
                let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                if(gridCoord.x >= 0 && gridCoord.x < this.lineCount && gridCoord.y >= 0 && gridCoord.y < this.lineCount){
                    this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.GameAdmin.BuildingBuffArray[gridCoord.x][gridCoord.y] | this.Building.getComponent('BuildingController').BuildingBuff;
                }
            }
        }
        
        this.Building.parent = this.GameCanvas;
        this.Building.setPosition(this.node.x, this.node.y);
        this.Building = null;
        
        // 隐藏编辑界面
        this.Setting.active = false;
        this.EditGrid.active = false;
    },
    setBuildingSpaceArray(x, y, state){
        // 更改GameAdmin的BuildingSpaceArray和BuildingBuffArray
        for(let i = 0; i < this.GridSize.y; ++i){
            for(let j = 0; j < this.GridSize.x; ++j){
                let offset = cc.v2((j - i) * this.rhombusWidth / 2, -(i + j) * this.rhombusHeight / 2);
                let gridPos = cc.v2(x, y).add(offset);
                
                let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                this.GameAdmin.BuildingSpaceArray[gridCoord.x][gridCoord.y] = state;
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
    },
    closeEditCanvas(){
        if(this.EditType == 1){
            // 在移动物体，取消时物体放回原处
            this.Building.parent = this.GameCanvas;
            this.Building.setPosition(this.BuildingBeforePos.x, this.BuildingBeforePos.y);
            this.Building = null;
        }
        else{
            // 在创建物体，取消时删除物体

            this.Building.removeFromParent(false);
            this.Building = null;
        }
        // 隐藏编辑界面
        this.Setting.active = false;
        this.EditGrid.active = false;
    },
    update (dt) {
        this.time += dt;
        if(this.Building)
            this.Building.setPosition(this.Building.x, this.OffsetY + 50 * Math.sin(this.time));
    },
});
