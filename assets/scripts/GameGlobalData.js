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
    },
    statics:{
        // 玩家的学号
        userId: "3220190920",
        // 玩家姓名
        userName: "张政",
        // 主线关卡相关数据
        currentLevel: 0,
        level: 1,
        completeLevel: false, // 记录是否完成一个关卡
        // 音频音效控制
        musicState: true,
        soundState: true,
        // 菱形网格数据
        rhombusWidth: 200, // 地形菱形网格宽
        rhombusHeight: 100, // 地形菱形网格高
        lineCount: 8,
        // 可放置区域标记
        BuildingSpaceArray: [], // 标记为1则该区域已有建筑，标记为0则该区域没有建筑
        // 建筑buff区域标记
        //BuildingBuffArray: [], // 标记该区域的buff，范围为0到1111111(二进制)
        // 预设的12种建筑及存放的数组
        BuildingTemplate: null,
        BuildingType: [],
        // 建筑升级
        //BuildingLevel: null,
        //BuildingLevelArray: [],
        // 预设的史诗建筑属性
        //EpicBuildingBuff: [],
        // 已拥有的建筑数组
        ExistingBuildingTemplate: null,
        ExistingBuildingArray: [],
        ExistingTypeArray:[],
        // 当前生产情况
        //science: 5000, // 科技
        //culture: 30, // 文化
        //charm: 10000 // 魅力
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始化菱形网格数据
        this.rhombusWidth = 200;
        this.rhombusHeight = 100;
        this.lineCount = 8;
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
        /*
        this.BuildingBuffArray = new Array();
        for(let i = 0; i < (2 * this.lineCount + 1); ++i){
            this.BuildingBuffArray[i] = new Array();
            for(let j = 0; j < (2 * this.lineCount + 1); ++j){
                this.BuildingBuffArray[i][j] = 0;
            }
        }
        */
        // 预设的建筑模板类
        this.BuildingTemplate = cc.Class({
            name: "BuildingTemplate",
            properties: {
                id: 0,
                name: "实验楼",
                science: 200,
                culture: 5,
                charm: 0,
                size: new cc.v2(2, 2),
                epicType: 0,
                imageUrl: "woodBuilding",
                prefabUrl: "prefabs/"
            },
            init(id, name, science, culture, charm, size, epicType, imageUrl, prefabUrl){
                this.id = id;
                this.name = name;
                this.science = science;
                this.culture = culture;
                this.charm = charm;
                this.size = size;
                this.epicType = epicType;
                this.imageUrl = imageUrl;
                this.prefabUrl = prefabUrl;
                return this;
            },
        });
        this.BuildingType = new Array();
        this.BuildingType.push(
            new this.BuildingTemplate().init(0,  "路灯",         0, 0, 0, new cc.v2(1, 1), 0,  "ludeng",             "prefabs/ludeng"),
            new this.BuildingTemplate().init(1,  "木灯",         0, 0, 0, new cc.v2(1, 1), 0,  "mudeng",             "prefabs/mudeng"), // 这个暂时不让摆，记住
            new this.BuildingTemplate().init(2,  "BIT路灯",      0, 0, 0, new cc.v2(1, 2), 0,  "BITludeng",          "prefabs/BITludeng"),
            new this.BuildingTemplate().init(3,  "人工湖",       0, 0, 0, new cc.v2(3, 3), 0,  "rengonghu",          "prefabs/rengonghu"),
            new this.BuildingTemplate().init(4,  "花丛",         0, 0, 0, new cc.v2(1, 1), 0,  "huacong",            "prefabs/huacong"),


            new this.BuildingTemplate().init(5,  "超市",         0, 0, 0, new cc.v2(2, 2), 0,  "chaoshi",            "prefabs/chaoshi"), // 2
            new this.BuildingTemplate().init(6,  "打印店",       0, 0, 0, new cc.v2(2, 2), 0,  "dayindian",          "prefabs/dayindian"), // 2
            new this.BuildingTemplate().init(7,  "书店",         0, 0, 0, new cc.v2(2, 2), 0,  "shudian",            "prefabs/shudian"), // 3
            new this.BuildingTemplate().init(8,  "小卖部",       0, 0, 0, new cc.v2(2, 1), 0,  "xiaomaibu",          "prefabs/xiaomaibu"), // 3

            new this.BuildingTemplate().init(9,  "活动室",        0, 0, 0, new cc.v2(2, 2), 0,  "huodongshi",         "prefabs/huodongshi"), // 1
            new this.BuildingTemplate().init(10,  "工科大楼",     0, 0, 0, new cc.v2(3, 3), 0,  "gongkedalou",         "prefabs/gongkedalou"), // 1
            new this.BuildingTemplate().init(11,  "教室",         0, 0, 0, new cc.v2(2, 2), 0,  "jiaoshi",            "prefabs/jiaoshi"), // 6
            new this.BuildingTemplate().init(12,  "教学楼",       0, 0, 0, new cc.v2(2, 3), 0,  "jiaoxuelou",         "prefabs/jiaoxuelou"), // 5
            new this.BuildingTemplate().init(13,  "实验楼",       0, 0, 0, new cc.v2(2, 3), 0,  "shiyanlou",          "prefabs/shiyanlou"), // 5
            new this.BuildingTemplate().init(14,  "实验室",       0, 0, 0, new cc.v2(2, 2), 0,  "shiyanshi",          "prefabs/shiyanshi"), // 4
            new this.BuildingTemplate().init(15,  "西山实验室",   0, 0, 0, new cc.v2(2, 3), 0,  "xishanshiyanshi",    "prefabs/xishanshiyanshi"), // 6
            new this.BuildingTemplate().init(16,  "艺术馆",       0, 0, 0, new cc.v2(3, 2), 0,  "yishuguan",          "prefabs/yishuguan"), // 7


            new this.BuildingTemplate().init(17,  "京工食堂",     0, 0, 0, new cc.v2(2, 2), 0,  "jinggongshitang",     "prefabs/jinggongshitang"), // 7
            new this.BuildingTemplate().init(18,  "丹枫楼",       0, 0, 0, new cc.v2(3, 3), 0,  "danfenglou",          "prefabs/danfenglou"), // 4
            new this.BuildingTemplate().init(19,  "北理工的恶龙", 0, 0, 0, new cc.v2(2, 3), 0,  "long",                "prefabs/long"), // 8
            new this.BuildingTemplate().init(20,  "体育馆",       0, 0, 0, new cc.v2(3, 3), 0,  "tiyuguan",            "prefabs/tiyuguan"), // 1
            new this.BuildingTemplate().init(21,  "徐特立图书馆", 0, 0, 0, new cc.v2(3, 3), 0,  "xutelitushuguan",     "prefabs/xutelitushuguan"), // 7
            new this.BuildingTemplate().init(22,  "游泳馆",       0, 0, 0, new cc.v2(3, 3), 0,  "youyongguan",         "prefabs/youyongguan"), // 8
            new this.BuildingTemplate().init(23,  "中心教学楼",   0, 0, 0, new cc.v2(3, 3), 0,  "zhongxinjiaoxuelou",  "prefabs/zhongxinjiaoxuelou"), // 8
            new this.BuildingTemplate().init(24,  "主楼",         0, 0, 0, new cc.v2(3, 3), 0,  "zhulou",              "prefabs/zhulou"), // 6
            new this.BuildingTemplate().init(25,  "理科教学楼",   0, 0, 0, new cc.v2(3, 3), 0,  "likejiaoxuelou",      "prefabs/likejiaoxuelou"), // 5
            
        );
        // 初始化史诗建筑属性
        /*this.EpicBuildingBuff = [
            //    科技 文化 魅力 （与BuildingType中保持一致）
            cc.v3(3,   30, 1),
            cc.v3(2,   45, 1),
            cc.v3(1.5, 80, 1),
            cc.v3(1.5, 50, 1.5),
            cc.v3(1.5, 40, 2),
            cc.v3(1,   40, 3)
        ];*/
        // 预设的建筑升级数据类
        /*this.BuildingLevel = cc.Class({
            name: "BuildingLevel",
            properties: {
                price: 6000, // 升级消耗的金币
                scienceState: true, // state为假是固定值增长，state为真是比例增长
                science: 0.5,
                cultureState: false, // state为假是固定值增长，state为真是比例增长
                culture: 1,
                moneyState: false, // state为假是固定值增长，state为真是比例增长
                money: 10,
            },
            init(price, scienceState, science, cultureState, culture, moneyState, money){
                this.price = price;
                this.scienceState = scienceState;
                this.science = science;
                this.cultureState = cultureState;
                this.culture = culture;
                this.moneyState = moneyState;
                this.money = money;
                return this;
            },
        });
        // 初始化建筑升级, 按顺序与BuildingType对应，别乱动
        this.BuildingLevelArray=[
            new this.BuildingLevel().init(6000,   true,  0.5, false, 1, false, 10), 
            new this.BuildingLevel().init(4500,   false, 10,  false, 2, false, 10),
            new this.BuildingLevel().init(3000,   false, 10,  false, 1, true,  0.3),
            new this.BuildingLevel().init(20000,  true,  0.5, false, 1, false, 10),
            new this.BuildingLevel().init(15000,  false, 10,  false, 3, false, 10),
            new this.BuildingLevel().init(10000,  false, 10,  false, 1, true,  0.3),
        ]*/

        // 预设的现存建筑类
        this.ExistingBuildingTemplate = cc.Class({
            name: "ExistingBuildingTemplate",
            properties:{
                index: 0, // 该建筑在ExistingBuildingArray中的下标
                uniqueId: "1598267019", // 建筑唯一id
                typeId: 0, // 建筑类型id
                level: 1, // 建筑等级
                isRotate: false, // 建筑是否旋转
                isBackpack: false, // 标志是否在背包
                posX: 50,  // 建筑x坐标
                posY: 100,  // 建筑y坐标
                lastProduce: 1598267019 // 上次获取资源的时间
            },
            init(index, uniqueId, typeId, level, isRotate, isBackpack, posX, posY, lastProduce){
                this.index = index;
                this.uniqueId = uniqueId;
                this.typeId = typeId;
                this.level = level;
                this.isRotate = isRotate;
                this.isBackpack = isBackpack;
                this.posX = posX;
                this.posY = posY;
                this.lastProduce = lastProduce;
                return this;
            }
        });
        this.ExistingBuildingArray = new Array();

        this.ExistingTypeArray = new Array();
        for(let i = 0; i < this.BuildingType.length; ++i){
            this.ExistingTypeArray[i] = false;
        }
        this.ExistingTypeArray[0] = true;
        this.ExistingTypeArray[2] = true;
        this.ExistingTypeArray[3] = true;
        this.ExistingTypeArray[4] = true;
    },

    start () {
        
    },

    init(sceneDataJson){
        this.soundState = true;
        this.musicState = true;

        // 初始化用户信息
        this.userId = sceneDataJson.personal_information.id;
        this.userName = sceneDataJson.personal_information.user_name;
        this.currentLevel = 0;
        if(sceneDataJson.game_data.score.level){
            this.level = parseInt(sceneDataJson.game_data.score.level);
        }
        else
            this.level = 1;

        console.log(this.level);
        switch (this.level) {
            case 9:
                this.ExistingTypeArray[19] = true;
                this.ExistingTypeArray[22] = true;
                this.ExistingTypeArray[23] = true;
            case 8:        
                this.ExistingTypeArray[16] = true;
                this.ExistingTypeArray[17] = true;
                this.ExistingTypeArray[21] = true;
            case 7:
                this.ExistingTypeArray[11] = true;
                this.ExistingTypeArray[15] = true;
                this.ExistingTypeArray[24] = true;
            case 6:
                this.ExistingTypeArray[12] = true;
                this.ExistingTypeArray[13] = true;
                this.ExistingTypeArray[25] = true;
            case 5:  
                this.ExistingTypeArray[14] = true;
                this.ExistingTypeArray[18] = true;
            case 4:  
                this.ExistingTypeArray[7] = true;
                this.ExistingTypeArray[8] = true;
            case 3:  
                this.ExistingTypeArray[5] = true;
                this.ExistingTypeArray[6] = true;
            case 2: 
                this.ExistingTypeArray[9] = true;
                this.ExistingTypeArray[10] = true;
                this.ExistingTypeArray[20] = true;
            case 1:  
                break;
        }
        
        this.completeLevel = false;
        // 初始化游戏数据
        // this.science = sceneDataJson.game_data.score.science;
        // this.culture = sceneDataJson.game_data.score.culture;
        // this.money   = sceneDataJson.game_data.score.charm;
        
        let buildings = sceneDataJson.game_data.buildings;
        for(let i = 0; i < buildings.length; ++i){
            this.ExistingBuildingArray.push(
                new this.ExistingBuildingTemplate().init(
                    i,
                    buildings[i].unique_id,
                    buildings[i].type_id,
                    buildings[i].level,
                    buildings[i].is_rotate,
                    buildings[i].is_backpack,
                    buildings[i].position_x,
                    buildings[i].position_y,
                    buildings[i].last_produce
                )
            )
        }
        // 根据获得的建筑信息更新可放置区域和buff作用区域
        for(let i = 0; i < this.ExistingBuildingArray.length; ++i){
            //let typeId = this.ExistingBuildingArray[i].typeId;
            //if(typeId != 1)
            //    this.ExistingTypeArray[typeId] = true;
            // 如果建筑在背包，直接跳过
            if(this.ExistingBuildingArray[i].isBackpack)
                continue;

            let x = this.ExistingBuildingArray[i].posX;
            let y = this.ExistingBuildingArray[i].posY;
            let isRotate = this.ExistingBuildingArray[i].isRotate;
            let size = this.BuildingType[typeId].size;
            let epicType = this.BuildingType[typeId].epicType;

            // 若建筑已旋转，则建筑的size的x与y互换
            if(isRotate && size.x != size.y){
                let temp = size.x;
                size.x = size.y;
                size.y = temp;
            }
            // 计算首个网格偏移
            let gridOffset = cc.v2((size.y-size.x) * this.rhombusWidth / 4, (size.x + size.y - 2) * this.rhombusHeight / 4);
            // 更新可放置区域
            for(let j = 0; j < size.y; ++j){
                for(let k = 0; k < size.x; ++k){
                    let offset = cc.v2((k - j) * this.rhombusWidth / 2, -(j + k) * this.rhombusHeight / 2);
                    let gridPos = cc.v2(x, y).add(gridOffset).add(offset);
                    let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                    
                    this.BuildingSpaceArray[gridCoord.x][gridCoord.y] = 1;
                }
            }
            /*
            // 若为史诗建筑，更新buff作用区域
            if(epicType != 0){
                // 从最上面的边缘点开始赋值buff作用区域
                let origin = cc.v2(this.node.x, this.node.y).add(gridOffset).add(cc.v2(0, this.rhombusHeight));
                let lineCount = (2 * this.lineCount + 1);
                // 上左
                for(let j = 0; j < size.x + 2; ++j){
                    let offset = cc.v2( j * this.rhombusWidth / 2, -j * this.rhombusHeight / 2);
                    let gridPos = origin.add(offset);
                    let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);

                    if(gridCoord.x >= 0 && gridCoord.x < lineCount && gridCoord.y >= 0 && gridCoord.y < lineCount){
                        this.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.BuildingBuffArray[gridCoord.x][gridCoord.y] | epicType;
                    }
                }
                // 上右
                for(let j = 1; j < size.y + 2; ++j){
                    let offset = cc.v2( -j * this.rhombusWidth / 2, -j * this.rhombusHeight / 2);
                    let gridPos = origin.add(offset);
                    let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                    if(gridCoord.x >= 0 && gridCoord.x < lineCount && gridCoord.y >= 0 && gridCoord.y < lineCount){              
                        this.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.BuildingBuffArray[gridCoord.x][gridCoord.y] | epicType;
                    }
                }
                // 下左
                for(let j = 1; j < size.x + 2; ++j){
                    let offset = cc.v2((j - size.y - 1) * this.rhombusWidth / 2, -(size.y + 1 + j) * this.rhombusHeight / 2);
                    let gridPos = origin.add(offset);
                    let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                    if(gridCoord.x >= 0 && gridCoord.x < lineCount && gridCoord.y >= 0 && gridCoord.y < lineCount){  
                        this.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.BuildingBuffArray[gridCoord.x][gridCoord.y] | epicType;
                    }
                }
                // 下右
                for(let j = 1; j < size.y + 1; ++j){
                    let offset = cc.v2((size.x + 1 -j) * this.rhombusWidth / 2, -(size.x + 1 + j) * this.rhombusHeight / 2);
                    let gridPos = origin.add(offset);
                    let gridCoord = this.gridPosToGridCoord(gridPos.x, gridPos.y);
                    if(gridCoord.x >= 0 && gridCoord.x < lineCount && gridCoord.y >= 0 && gridCoord.y < lineCount){          
                        this.BuildingBuffArray[gridCoord.x][gridCoord.y] = this.BuildingBuffArray[gridCoord.x][gridCoord.y] | epicType;
                    }
                }   
            }
            */
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
