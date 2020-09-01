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

        // 游戏数据记录区
        // 游戏状态
        GameState: {
            get() {
                return this._GameState;
            },
            set(value) {
                this._GameState = value;
            },
            visible: false
        }, // 0 指普通运行态， 1 指编辑态
        // 游戏界面
        GameCanvas: {
            default: null,
            visible: false,
        },
        // 编辑界面
        EditCanvas: {
            default: null,
            visible: false,
        },
        // 产出标签界面
        Product: {
            default: null,
            visible: false,
        },
        ScienceLabel:{
            default: null,
            visible: false,
        },
        CultureLabel:{
            default: null,
            visible: false,
        },
        CharmLabel:{
            default: null,
            visible: false,
        },
        // 商店界面
        BuildingMuseum: {
            default: null,
            visible: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化各种数据
        this.CultureSum = 0;
    },

    start() {
        this.GameState = 1;
        this.GameGlobalData = cc.find('/GameGlobalData').getComponent('GameGlobalData'); // 全局数据记录区
        this.GameCanvas = cc.find('/Canvas/GameCanvas');
        this.EditCanvas = cc.find('/Canvas/GameCanvas/EditCanvas');

        this.Product = cc.find('/Canvas/UICanvas/Product');
        this.ScienceLabel = this.Product.getChildByName('ScienceLabel');
        this.CultureLabel = this.Product.getChildByName('CultureLabel');
        this.CharmLabel = this.Product.getChildByName('CharmLabel');

        this.BuildingMuseum = cc.find('/Canvas/UICanvas/BuildingMuseum');
        this.EditCanvas.zIndex = 1000;
        
        this.init();
    },
    init() {
        // 根据GameGlobalData的数据放置建筑
        let buildingArray = this.GameGlobalData.ExistingBuildingArray;
        for (let i = 0; i < buildingArray.length; ++i) {
            switch (buildingArray[i].typeId) {
                case 0:
                case 1:
                case 2:
                    cc.resources.load('prefabs/woodBuilding' + (buildingArray[i].typeId + 1), (err, prefab) => {
                        if (err != undefined)
                            cc.log(err);
                        let building = cc.instantiate(prefab);
                        building.getComponent('BuildingController').init(buildingArray[i].typeId, buildingArray[i].level);
                        building.getComponent('BuildingController').putDown(this.GameCanvas, buildingArray[i].posX, buildingArray[i].posY);
                    });
                    break;
                case 3:
                case 4:
                case 5:
                    cc.resources.load('prefabs/cinema' + (buildingArray[i].typeId - 2), (err, prefab) => {
                        if (err != undefined)
                            cc.log(err);
                        let building = cc.instantiate(prefab);
                        building.getComponent('BuildingController').init(buildingArray[i].typeId, buildingArray[i].level);
                        building.getComponent('BuildingController').putDown(this.GameCanvas, buildingArray[i].posX, buildingArray[i].posY);

                    });
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    cc.resources.load('prefabs/pennyMall' + (buildingArray[i].typeId - 5), (err, prefab) => {
                        if (err != undefined)
                            cc.log(err);
                        let building = cc.instantiate(prefab);
                        building.getComponent('BuildingController').init(buildingArray[i].typeId, buildingArray[i].level);
                        building.getComponent('BuildingController').putDown(this.GameCanvas, buildingArray[i].posX, buildingArray[i].posY);
                    });
                    break;
            }
        }

    },
    computeProduct() {
        // 计算总魅力值
        let charmSum = 0;
        this.GameCanvas.walk((target) => {
            let buildingController = target.getComponent('BuildingController');
            if (buildingController) {
                charmSum += buildingController.getProduct().z;
            }
        }, null);
        this.CharmLabel.getComponent(cc.Label).string = "魅力值: " + this.GameGlobalData.charm + " + " + charmSum + "/分钟";
        // 计算总文化
        let cultureSum = 0;
        this.GameCanvas.walk((target) => {
            let buildingController = target.getComponent('BuildingController');
            if (buildingController) {
                cultureSum += buildingController.culture;
            }
        }, null);
        this.CultureLabel.getComponent(cc.Label).string = "文化值: " + cultureSum;
        // 计算总科技产出
        let scienceSum = 0;
        this.GameCanvas.walk((target) => {
            let buildingController = target.getComponent('BuildingController');
            if (buildingController) {
                scienceSum += buildingController.getProduct().x;
            }
        }, null);
        let res = scienceSum * (1 + cultureSum / 100);
        this.ScienceLabel.getComponent(cc.Label).string = "科技值: " + this.GameGlobalData.science + " + " + scienceSum + "/分钟"; 
    },
    // update (dt) {},
    initBuilding(event, customData) {
        if (this.EditCanvas.childrenCount >= 3)
            return;
        // 改变游戏运行态
        this.GameState = 1;

        let index = parseInt(customData);
        switch (index) {
            case 1:
            case 2:
            case 3:
                cc.resources.load('prefabs/woodBuilding' + index, (err, prefab) => {
                    if (err != undefined)
                        cc.log(err);
                    let building = cc.instantiate(prefab);
                    building.parent = this.GameCanvas;
                    building.setPosition(0, 0);
                    building.getComponent('BuildingController').init(index - 1, 0);
                    this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
                });
                break;
            case 4:
            case 5:
            case 6:
                cc.resources.load('prefabs/cinema' + (index - 3), (err, prefab) => {
                    if (err != undefined)
                        cc.log(err);
                    let building = cc.instantiate(prefab);
                    building.parent = this.GameCanvas;
                    building.setPosition(0, 0);
                    building.getComponent('BuildingController').init(index - 1, 0);
                    this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
                });
                break;
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
                cc.resources.load('prefabs/pennyMall' + (index - 6), (err, prefab) => {
                    let building = cc.instantiate(prefab);
                    building.parent = this.GameCanvas;
                    building.setPosition(0, 0);
                    building.getComponent('BuildingController').init(index - 1);
                    this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
                });
                break;
        }
    },
    switchToHistory() {
        cc.director.loadScene("selectLevel");
    },
    setBuildingMuseum(event, state) {
        if (state == 'true') {
            if (!this.BuildingMuseum.getComponent('BuildingMuseum').hasInitialized) {
                this.BuildingMuseum.getComponent('BuildingMuseum').init();
            }
            this.BuildingMuseum.active = true;
        }
        else {
            this.BuildingMuseum.active = false;
        }
    }
});
