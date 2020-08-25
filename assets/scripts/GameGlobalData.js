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
        Building: null,
        BuildingType: [],

        BackpackItem: null,
        BackpackBuilding: [],
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Building = cc.Class({
            name: "BuildingData",
            properties: {
                id: 0,
                name: "实验楼",
                science: 200,
                culture: 5,
                charm: 0,
                size: new cc.v2(2, 2),
                isEpic: false,
                imageUrl: "woodBuilding",
                prefabUrl: "prefabs/"
            },
            init(id, name, science, culture, charm, size, isEpic, imageUrl, prefabUrl){
                this.id = id;
                this.name = name;
                this.science = science;
                this.culture = culture;
                this.charm = charm;
                this.size = size;
                this.isEpic = isEpic;
                this.imageUrl = imageUrl;
                this.prefabUrl = prefabUrl;
                return this;
            },
        });
        this.BuildingType = new Array();
        this.BuildingType.push(
            new this.Building().init(0,  "实验室",       200, 1,  50,  new cc.v2(2, 2), false, "woodBuilding", "prefabs/woodBuilding1"),
            new this.Building().init(1,  "教室",         70,  3,  50,  new cc.v2(2, 2), false, "woodBuilding", "prefabs/woodBuilding2"),
            new this.Building().init(2,  "活动室",       0,   1,  200, new cc.v2(2, 2), false, "woodBuilding", "prefabs/woodBuilding3"),
            new this.Building().init(3,  "实验楼",       600, 2,  100, new cc.v2(2, 3), false, "cinema",       "prefabs/cinema1"),
            new this.Building().init(4,  "教学楼",       200, 9,  100, new cc.v2(2, 3), false, "cinema",       "prefabs/cinema2"),
            new this.Building().init(5,  "艺术设计馆",   0,   2,  600, new cc.v2(2, 3), false, "cinema",       "prefabs/cinema3"),
            new this.Building().init(6,  "西山实验室",   3,   30, 1,   new cc.v2(3, 3), true,  "pennyMall",    "prefabs/pennyMall1"),
            new this.Building().init(7,  "工科大楼",     2,   45, 1,   new cc.v2(3, 3), true,  "pennyMall",    "prefabs/pennyMall2"),
            new this.Building().init(8,  "中心教学楼",   1.5, 80, 1,   new cc.v2(3, 3), true,  "pennyMall",    "prefabs/pennyMall3"),
            new this.Building().init(9,  "徐特立图书馆", 1.5, 50, 1.5, new cc.v2(3, 3), true,  "pennyMall",    "prefabs/pennyMall4"),
            new this.Building().init(10, "北理工的恶龙", 1.5, 40, 2,   new cc.v2(3, 3), true,  "pennyMall",    "prefabs/pennyMall5"),
            new this.Building().init(11, "体育馆",       1,   40, 3,   new cc.v2(3, 3), true,  "pennyMall",    "prefabs/pennyMall6")
        );

        this.BackpackItem = cc.Class({
            name: "BackpackItemData",
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
