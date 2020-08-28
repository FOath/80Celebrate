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
        // 菱形网格数据
        rhombusWidth: 200, // 地形菱形网格宽
        rhombusHeight: 100, // 地形菱形网格高
        lineCount: 8,
        // 可放置区域标记
        BuildingSpaceArray: [], // 标记为1则该区域已有建筑，标记为0则该区域没有建筑
        // 建筑buff区域标记
        BuildingBuffArray: [], // 标记该区域的buff，范围为0到1111111(二进制)
        // 预设的12种建筑及存放的数组
        BuildingTemplate: null,
        BuildingType: [],
        // 预设的史诗建筑属性
        EpicBuildingBuff: [],
        // 背包项及存放的数组
        BackpackItemTemplete: null,
        BackpackBuilding: [],
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
        this.BuildingBuffArray = new Array();
        for(let i = 0; i < (2 * this.lineCount + 1); ++i){
            this.BuildingBuffArray[i] = new Array();
            for(let j = 0; j < (2 * this.lineCount + 1); ++j){
                this.BuildingBuffArray[i][j] = 0;
            }
        }
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
            new this.BuildingTemplate().init(0,  "实验室",       200, 1,  50,  new cc.v2(2, 2), 0, "woodBuilding", "prefabs/woodBuilding1"),
            new this.BuildingTemplate().init(1,  "教室",         70,  3,  50,  new cc.v2(2, 2), 0, "woodBuilding", "prefabs/woodBuilding2"),
            new this.BuildingTemplate().init(2,  "活动室",       0,   1,  200, new cc.v2(2, 2), 0, "woodBuilding", "prefabs/woodBuilding3"),
            new this.BuildingTemplate().init(3,  "实验楼",       600, 2,  100, new cc.v2(2, 3), 0, "cinema",       "prefabs/cinema1"),
            new this.BuildingTemplate().init(4,  "教学楼",       200, 9,  100, new cc.v2(2, 3), 0, "cinema",       "prefabs/cinema2"),
            new this.BuildingTemplate().init(5,  "艺术设计馆",   0,   2,  600, new cc.v2(2, 3), 0, "cinema",       "prefabs/cinema3"),
            new this.BuildingTemplate().init(6,  "西山实验室",   3,   30, 1,   new cc.v2(3, 3), 1,  "pennyMall",   "prefabs/pennyMall1"),
            new this.BuildingTemplate().init(7,  "工科大楼",     2,   45, 1,   new cc.v2(3, 3), 2,  "pennyMall",   "prefabs/pennyMall2"),
            new this.BuildingTemplate().init(8,  "中心教学楼",   1.5, 80, 1,   new cc.v2(3, 3), 4,  "pennyMall",   "prefabs/pennyMall3"),
            new this.BuildingTemplate().init(9,  "徐特立图书馆", 1.5, 50, 1.5, new cc.v2(3, 3), 8,  "pennyMall",   "prefabs/pennyMall4"),
            new this.BuildingTemplate().init(10, "北理工的恶龙", 1.5, 40, 2,   new cc.v2(3, 3), 16,  "pennyMall",  "prefabs/pennyMall5"),
            new this.BuildingTemplate().init(11, "体育馆",       1,   40, 3,   new cc.v2(3, 3), 32,  "pennyMall",  "prefabs/pennyMall6")
        );
        // 初始化史诗建筑属性
        this.EpicBuildingBuff = [
            //    科技 文化 魅力 （与BuildingType中保持一致）
            cc.v3(3,   30, 1),
            cc.v3(2,   45, 1),
            cc.v3(1.5, 80, 1),
            cc.v3(1.5, 50, 1.5),
            cc.v3(1.5, 40, 2),
            cc.v3(1,   40, 3)
        ];
        // 预设的背包项类
        this.BackpackItemTemplete = cc.Class({
            name: "BackpackItemTemplete",
            properties: {
                buildingId: 0,
                level: 1
            },
            init(id, level){
                this.buildingId = id;
                this.level = level;
                return this;
            },
        });
        this.BackpackBuilding = new Array();
    },

    start () {
        
    },

    // update (dt) {},
});
