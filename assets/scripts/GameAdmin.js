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
        /*Product: {
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
        },*/
        // 珍藏馆界面
        BuildingMuseum: {
            default: null,
            visible: false,
        },
        // UI界面
        /*SendWordBtn: {
            default: null,
            visible: false,
        },*/
        RankBtn: {
            default: null,
            visible: false,
        },
        HistoryBtn: {
            default: null,
            visible: false,
        },
        MuseumBtn: {
            default: null,
            visible: false,
        },
        TreasureBoxBtn: {
            default: null,
            visible: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    /*onLoad() {
        this.CultureSum = 0;
    },*/

    start() {
        this.GameState = 0;

        this.GameGlobalData = cc.find('/GameGlobalData').getComponent('GameGlobalData'); // 全局数据记录区
        this.GameCanvas = cc.find('/Canvas/GameCanvas');
        this.EditCanvas = cc.find('/Canvas/GameCanvas/EditCanvas');
        this.EditCanvas.zIndex = 1000;

        /*
        this.Product = cc.find('/Canvas/UICanvas/Product');
        this.ScienceLabel = this.Product.getChildByName('Science').getChildByName('ScienceLabel');
        this.CultureLabel = this.Product.getChildByName('Culture').getChildByName('CultureLabel');
        this.MoneyLabel = this.Product.getChildByName('Money').getChildByName('MoneyLabel');
        */
        this.BuildingMuseum = cc.find('/Canvas/UICanvas/BuildingMuseum');
        
        let JumpBtns = cc.find('/Canvas/UICanvas/JumpBtns');
        //this.SendWordBtn    = JumpBtns.getChildByName('SendWord');
        this.RankBtn        = JumpBtns.getChildByName('Rank');
        this.HistoryBtn     = JumpBtns.getChildByName('History');
        this.MuseumBtn      = JumpBtns.getChildByName('Museum'); 
        this.TreasureBoxBtn = JumpBtns.getChildByName('TreasureBox'); 

        //this.BuildingDetailCanvas = cc.find('/Canvas/UICanvas/BuildingDetailCanvas');

        this.SettingCanvas = cc.find('/Canvas/UICanvas/SettingCanvas');

        this.init();
    },
    switchGameState(){
        // 游戏处于普通运行态
        if(this.GameState == 0){
            this.GameState = 1; // 转为编辑态

            //this.SendWordBtn.getComponent(cc.Animation).play();

            this.RankBtn.getComponent(cc.Animation).play();

            this.HistoryBtn.getComponent(cc.Animation).play();

            this.MuseumBtn.getComponent(cc.Animation).play();

            this.TreasureBoxBtn.getComponent(cc.Animation).play();
            
        }
        // 游戏处于编辑态
        else if(this.GameState == 1){
            this.GameState = 0;
            //this.SendWordBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            //this.SendWordBtn.getComponent(cc.Animation).stop();

            if(this.EditCanvas.getComponent('EditBuilding').Building != null){
                this.EditCanvas.getComponent('EditBuilding').closeEditCanvas();
            }

            this.RankBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.RankBtn.getComponent(cc.Animation).stop();

            this.HistoryBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.HistoryBtn.getComponent(cc.Animation).stop();

            this.MuseumBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.MuseumBtn.getComponent(cc.Animation).stop();

            this.TreasureBoxBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.TreasureBoxBtn.getComponent(cc.Animation).stop();
        }
    },
    init() {
        // 根据GameGlobalData的数据放置建筑
        let buildingArray = this.GameGlobalData.ExistingBuildingArray;
        for (let i = 0; i < buildingArray.length; ++i) {
            // 检测在不在背包,若在则不生成在场景中
            if(buildingArray[i].isBackpack)
                continue;

            switch (buildingArray[i].typeId) {
                case 0:
                case 1:
                case 2:
                    cc.resources.load('prefabs/woodBuilding' + (buildingArray[i].typeId + 1), (err, prefab) => {
                        if (err != undefined)
                            cc.log(err);
                        let building = cc.instantiate(prefab);
                        
                        building.getComponent('BuildingController').init(buildingArray[i].index, buildingArray[i].uniqueId, buildingArray[i].typeId, buildingArray[i].level);
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
                        building.getComponent('BuildingController').init(buildingArray[i].index, buildingArray[i].uniqueId, buildingArray[i].typeId, buildingArray[i].level);
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
                        building.getComponent('BuildingController').init(buildingArray[i].index, buildingArray[i].uniqueId, buildingArray[i].typeId, buildingArray[i].level);
                        building.getComponent('BuildingController').putDown(this.GameCanvas, buildingArray[i].posX, buildingArray[i].posY);
                    });
                    break;
            }
        }

    },
    /*computeProduct() {
        // 计算总魅力值
        let moneySum = 0;
        this.GameCanvas.walk((target) => {
            let buildingController = target.getComponent('BuildingController');
            if (buildingController) {
                moneySum += buildingController.getProduct().z;
            }
        }, null);
        this.MoneyLabel.getComponent(cc.Label).string = this.GameGlobalData.money + " + " + moneySum + "/分钟";
        // 计算总文化
        let cultureSum = 0;
        this.GameCanvas.walk((target) => {
            let buildingController = target.getComponent('BuildingController');
            if (buildingController) {
                cultureSum += buildingController.culture;
            }
        }, null);
        this.CultureLabel.getComponent(cc.Label).string = cultureSum;
        // 计算总科技产出
        let scienceSum = 0;
        this.GameCanvas.walk((target) => {
            let buildingController = target.getComponent('BuildingController');
            if (buildingController) {
                scienceSum += buildingController.getProduct().x;
            }
        }, null);
        let res = Math.round(scienceSum * (1 + cultureSum / 100));
        this.ScienceLabel.getComponent(cc.Label).string = this.GameGlobalData.science + " + " + res + "/分钟"; 
    },*/
    // update (dt) {},
    initBuilding(event, index, uniqueId, typeId, level) {
        if (this.EditCanvas.childrenCount >= 3)
            return;
        // 改变游戏运行态
        this.GameState = 1;

        switch (typeId) {
            case 0:
            case 1:
            case 2:
                cc.resources.load('prefabs/woodBuilding' + (typeId + 1), (err, prefab) => {
                    if (err != undefined)
                        cc.log(err);
                    let building = cc.instantiate(prefab);
                    building.parent = this.GameCanvas;
                    building.setPosition(0, 0);
                    building.getComponent('BuildingController').init(index, uniqueId, typeId, level);
                    this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
                });
                break;
            case 3:
            case 4:
            case 5:
                cc.resources.load('prefabs/cinema' + (typeId - 2), (err, prefab) => {
                    if (err != undefined)
                        cc.log(err);
                    let building = cc.instantiate(prefab);
                    building.parent = this.GameCanvas;
                    building.setPosition(0, 0);
                    building.getComponent('BuildingController').init(index, uniqueId, typeId, level);
                    this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
                });
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                cc.resources.load('prefabs/pennyMall' + (typeId - 5), (err, prefab) => {
                    if (err != undefined)
                        cc.log(err);
                    let building = cc.instantiate(prefab);
                    building.parent = this.GameCanvas;
                    building.setPosition(0, 0);
                    building.getComponent('BuildingController').init(index, uniqueId, typeId, level);
                    this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
                });
                break;
        }
    },
    switchToHistory() {
        cc.game.addPersistRootNode(this.GameGlobalData);
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
    },
    /*openBuildingDetail(building){
        this.BuildingDetailCanvas.getComponent("BuildingDetailController").init(building);
    },*/
    switchSettingCanvas(){
        if(this.SettingCanvas.active){
            this.SettingCanvas.active = false;
        }
        else{
            this.SettingCanvas.active = true;
        }
    }
});
