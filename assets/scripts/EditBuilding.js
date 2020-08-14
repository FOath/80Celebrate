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
        GameAdmin: cc.Node,
        // 建筑
        Building: cc.Node,
        BuildingName: 'woodBuilding',
        BuildingSprite: cc.SpriteFrame,
        BuildingSpriteR: cc.SpriteFrame,
        // 建筑是否翻转
        isRotate: {
            get(){
                return this._isRotate;
            },
            set(value){
                this._isRotate = value;
                if(!value)
                    this.Building.getComponent(cc.Sprite).spriteFrame = this.BuildingSprite;
                else
                    this.Building.getComponent(cc.Sprite).spriteFrame = this.BuildingSpriteR;
            }
        }, // false代表未翻转，true代表翻转
        // 设置界面及其子选项
        Setting: cc.Node,
        SettingClose: cc.Node,
        SettingRotate: cc.Node,
        SettingCheck: cc.Node,
        // 编辑网格节点
        EditGrid: cc.Node,
        // 编辑网格偏移
        GridOffsets: Array,
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
                // 绘制网格
                let graphics = this.EditGrid.getComponent(cc.Graphics);                
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
        

        // 是否可放置
        canPutDown: {
            get(){
                return this._canPutDown;
            },
            set(value){
                this._canPutDown = value;
                if(!value){
                    // 编辑网格变色
                    this.EditGrid.getComponent(cc.Graphics).strokeColor = cc.Color.RED;
                }
                else{
                    // 编辑网格变色
                    this.EditGrid.getComponent(cc.Graphics).strokeColor = cc.Color.GREEN;
                }
                this.EditGrid.getComponent(cc.Graphics).stroke();
                this.SettingCheck.getComponent(cc.Button).interactable = value;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始化网格偏移
        this.gridOffsets = new Array();
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
            let pos = this.node.parent.convertToNodeSpaceAR(event.getLocation()).add(this.GridOffset);            
            // 调节位置
            let newPos = this.checkBuildingPosition(pos);
            // 检查位置是否合法
            this.canPutDown = this.checkGrid(newPos);
            this.node.setPosition(newPos.sub(this.GridOffset));
            // 停止触摸事件传播
            event.stopPropagation();
        }, this);
    },

    start () {
        // 游戏管理员
        this.GameAdmin = cc.find('/GameAdmin');
        // 游戏变量获取
        this.rhombusWidth = this.GameAdmin.getComponent('GameAdmin').rhombusWidth;
        this.rhombusHeight = this.GameAdmin.getComponent('GameAdmin').rhombusHeight;
        this.lineCount = this.GameAdmin.getComponent('GameAdmin').lineCount;
        // 建筑
        this.Building = this.node.getChildByName('Building');
        this.BuildingY = 100;
        this.BuildingName = 'brickBuilding';
        cc.resources.load(this.BuildingName, cc.SpriteFrame, (err, sprite)=>{
            this.BuildingSprite = sprite;
            this.isRotate = false;
        });
        cc.resources.load(this.BuildingName + 'R', cc.SpriteFrame, (err, sprite)=>{
            this.BuildingSpriteR = sprite;
        })
        // 设置界面及其子选项
        this.Setting = this.node.getChildByName('Setting');
        this.SettingClose = this.Setting.getChildByName('Close');
        this.SettingRotate = this.Setting.getChildByName('Rotate');
        this.SettingCheck = this.Setting.getChildByName('Check');
        // 编辑网格
        this.EditGrid = this.node.getChildByName('EditGrid');
        this.GridSize = cc.v2(2, 3);
        // 绘制编辑网格
        //this.paintEditGrid(cc.Color.GREEN);
        this.canPutDown = this.checkGrid(cc.v2(0, 0));
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
    checkGrid(newPos){
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
        // 先求pos所在直线的截距
        let k = this.rhombusHeight / this.rhombusWidth;
        let b1 = pos.y - pos.x * k;
        let xNum = Math.floor((b1 + this.lineCount * this.rhombusHeight + 0.5 * this.rhombusHeight) / this.rhombusHeight);
        xNum = (2 * this.lineCount) - xNum; // x轴上的映射方向是相反的
        
        let b2 = pos.y + pos.x * k;
        let yNum = Math.floor((b2 + this.lineCount * this.rhombusHeight + 0.5 * this.rhombusHeight) / this.rhombusHeight);
        // cc.log(xNum + ' ' + yNum);
        if(this.GameAdmin.getComponent('GameAdmin').BuildingSpaceArray[xNum][yNum] == 0)
            return true;
        else
            return false;
    },
    paintEditGrid(color){
        let graphics = this.EditGrid.getComponent(cc.Graphics);
        if(!graphics)
            graphics = this.EditGrid.addComponent(cc.Graphics);
        
        graphics.strokeColor = color;
        // 2行2列时
        if(this.size.x == 2 && this.size.y ==  2){
            let halfWidth = this.rhombusWidth / 2;
            let halfHeight = this.rhombusHeight / 2;
            let offsetH = 2 * this.rhombusWidth / 2;
            let offsetV = 2 * this.rhombusHeight / 2;
            // 斜向上
            for(let i = 0; i <= 2; ++i){
                graphics.moveTo(i * halfWidth - offsetH, -i * halfHeight);
                graphics.lineTo(i * halfWidth, -i * halfHeight + offsetV);
            }
            // 斜向下
            for(let i = 0; i <= 2; ++i){
                graphics.moveTo(i * halfWidth - offsetH, i * halfHeight);
                graphics.lineTo(i * halfWidth, i * halfHeight - offsetV);
            }
            graphics.stroke();
        }
    },
    rotateBuilding(){
        //this.isRotate = !this.isRotate;
        if(this.GridSize.x != this.GridSize.y)
            this.GridSize = cc.v2(this.GridSize.y, this.GridSize.x);
    },
    putDownBuilding(){
        if(!this.canPutDown)
            return;
        
        cc.resources.load('prefabs/'+this.BuildingName, (err, prefab)=>{
            var building = cc.instantiate(prefab);
            building.parent = this.node.parent;
            building.width = this.Building.width;
            building.height = this.Building.height;
            building.setPosition(this.node.x, this.node.y);
            building.getComponent('BuildingController').isRotate = this.isRotate;
        });
        this.closeEditCanvas();
    },
    closeEditCanvas(){
        this.clearEditCanvas();
        this.node.active = false;
    },
    clearEditCanvas(){
        // 卸载挂载的Building
        this.Building.getComponent(cc.Sprite).spriteFrame = null;
        this.BuildingName =     '';
        this.BuildingSprite = null;
        this.BuildingSpriteR = null;
    },
    update (dt) {
        this.time += dt;
        this.Building.setPosition(this.Building.x, this.BuildingY + 50 * Math.sin(this.time));
    },
});
