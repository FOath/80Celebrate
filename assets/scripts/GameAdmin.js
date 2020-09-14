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
        },
        RankBtn: {
            default: null,
            visible: false,
        },*/
        HistoryBtn: {
            default: null,
            visible: false,
        },
        MuseumBtn: {
            default: null,
            visible: false,
        },

        ProducerCanvas: {
            default: null,
            visible: false,
        },

        StrategyCanvas:{
            default: null,
            visible: false,
        },
        btnClip: {
            default: null,
            visible: false,
        },

        closeClip: {
            default: null,
            visible: false,
        },

        openClip: {
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
        //this.RankBtn = JumpBtns.getChildByName('Rank');
        this.HistoryBtn = JumpBtns.getChildByName('History');
        this.MuseumBtn = JumpBtns.getChildByName('RightCanvas').getChildByName('Museum');
        this.SettingBtn = JumpBtns.getChildByName('RightCanvas').getChildByName('Setting');
        this.ShareBtn = JumpBtns.getChildByName('RightCanvas').getChildByName('Share');
        //this.TreasureBoxBtn = JumpBtns.getChildByName('TreasureBox');

        //this.BuildingDetailCanvas = cc.find('/Canvas/UICanvas/BuildingDetailCanvas');

        this.getComponent(cc.AudioSource).loop = true;
        this.SettingCanvas = cc.find('/Canvas/UICanvas/SettingCanvas');

        this.ProducerCanvas = cc.find('/Canvas/UICanvas/ProducerCanvas');

        this.StrategyCanvas = cc.find('/Canvas/UICanvas/StrategyCanvas');

        this.btnClip = cc.find('/Btn').getComponent(cc.AudioSource);
        this.closeClip = cc.find('/Close').getComponent(cc.AudioSource);
        this.openClip = cc.find('/Open').getComponent(cc.AudioSource);
        this.getComponent(cc.AudioSource).volume = 0.3;

        // 向新手玩家显示攻略
        if(this.GameGlobalData.userType == 1){
            this.StrategyCanvas.active = true;
            this.GameGlobalData.userType = 0;
        }

        this.init();
    },
    switchGameState() {
        // 游戏处于普通运行态
        if (this.GameState == 0) {
            this.GameState = 1; // 转为编辑态

            //this.SendWordBtn.getComponent(cc.Animation).play();

            //this.RankBtn.getComponent(cc.Animation).play();

            this.HistoryBtn.getComponent(cc.Animation).play();
            this.HistoryBtn.getComponent(cc.Button).interactable = false;

            //this.MuseumBtn.getComponent(cc.Animation).play();

            this.SettingBtn.getComponent(cc.Animation).play();
            this.SettingBtn.getComponent(cc.Button).interactable = false;

            this.ShareBtn.getComponent(cc.Animation).play();
            this.ShareBtn.getComponent(cc.Button).interactable = false;

            //this.TreasureBoxBtn.getComponent(cc.Animation).play();

        }
        // 游戏处于编辑态
        else if (this.GameState == 1) {
            this.GameState = 0;
            //this.SendWordBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            //this.SendWordBtn.getComponent(cc.Animation).stop();

            if (this.EditCanvas.getComponent('EditBuilding').Building != null) {
                this.EditCanvas.getComponent('EditBuilding').closeEditCanvas();
            }

            //this.RankBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            //this.RankBtn.getComponent(cc.Animation).stop();

            this.HistoryBtn.active = true;
            this.HistoryBtn.getComponent(cc.Button).interactable = true;
            this.HistoryBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.HistoryBtn.getComponent(cc.Animation).stop();

            //this.MuseumBtn.active = true;
            //this.MuseumBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            //this.MuseumBtn.getComponent(cc.Animation).stop();

            this.SettingBtn.active = true;
            this.SettingBtn.getComponent(cc.Button).interactable = true;
            this.SettingBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.SettingBtn.getComponent(cc.Animation).stop();

            this.ShareBtn.active = true;
            this.ShareBtn.getComponent(cc.Button).interactable = true;
            this.ShareBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            this.ShareBtn.getComponent(cc.Animation).stop();
            //this.TreasureBoxBtn.getComponent(cc.Animation).setCurrentTime(0, 'buttonFade');
            //this.TreasureBoxBtn.getComponent(cc.Animation).stop();
        }
    },
    init() {
        // 根据GameGlobalData的数据放置建筑
        let buildingArray = this.GameGlobalData.ExistingBuildingArray;
        for (let i = 0; i < buildingArray.length; ++i) {
            // 检测在不在背包,若在则不生成在场景中
            if (buildingArray[i].isBackpack)
                continue;

            cc.resources.load(this.GameGlobalData.BuildingType[buildingArray[i].typeId].prefabUrl, (err, prefab) => {
                if (err != undefined)
                    cc.log(err);
                let building = cc.instantiate(prefab);

                building.getComponent('BuildingController').init(buildingArray[i].index, buildingArray[i].uniqueId, buildingArray[i].typeId, buildingArray[i].level);
                building.getComponent('BuildingController').putDown(this.GameCanvas, buildingArray[i].posX, buildingArray[i].posY);
            });
            /*switch (buildingArray[i].typeId) {
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
            }*/
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
    initBuilding(event, index, uniqueId, typeId) {
        if (this.EditCanvas.childrenCount >= 3)
            return;

        cc.resources.load(this.GameGlobalData.BuildingType[typeId].prefabUrl, (err, prefab) => {
            if (err != undefined)
                cc.log(err);
            let building = cc.instantiate(prefab);
            building.parent = this.GameCanvas;
            building.setPosition(0, 0);
            building.getComponent('BuildingController').init(index, uniqueId, typeId);
            this.EditCanvas.getComponent('EditBuilding').setBuilding(building, 0);
        });
        /*
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
        }*/
    },
    switchToHistory() {
        if (this.GameGlobalData.soundState) {
            this.btnClip.play();
        }
        cc.game.addPersistRootNode(this.GameGlobalData);
        cc.director.loadScene("selectLevel");
    },
    setBuildingMuseum(event, state) {
        if (state == 'true') {
            if (!this.BuildingMuseum.getComponent('BuildingMuseum').hasInitialized) {
                this.BuildingMuseum.getComponent('BuildingMuseum').init();
            }
            if (this.GameGlobalData.soundState) {
                this.openClip.play();
            }
            this.BuildingMuseum.active = true;
        } else {
            if (this.GameGlobalData.soundState) {
                this.closeClip.play();
            }
            this.BuildingMuseum.active = false;
        }
    },
    /*openBuildingDetail(building){
        this.BuildingDetailCanvas.getComponent("BuildingDetailController").init(building);
    },*/
    switchSettingCanvas() {
        if (this.SettingCanvas.active) {
            if (this.GameGlobalData.soundState) {
                this.closeClip.play();
            }
            this.SettingCanvas.active = false;
        } else {
            if (this.GameGlobalData.soundState) {
                this.openClip.play();
            }
            this.SettingCanvas.active = true;
        }
    },
    switchBGM() {
        if (this.getComponent(cc.AudioSource).isPlaying) {
            this.getComponent(cc.AudioSource).pause();
            this.GameGlobalData.musicState = false;
        }
        else {
            this.getComponent(cc.AudioSource).play();
            this.GameGlobalData.musicState = true;
        }
    },
    switchSound() {
        this.GameGlobalData.soundState = !this.GameGlobalData.soundState;
        if (this.GameGlobalData.soundState) {
            this.btnClip.play();
        }
    },
    switchProducerCanvas() {
        if (this.ProducerCanvas.active) {
            if (this.GameGlobalData.soundState) {
                this.closeClip.play();
            }
            this.ProducerCanvas.active = false;
        }
        else {
            if (this.GameGlobalData.soundState) {
                this.openClip.play();
            }
            this.ProducerCanvas.active = true;
        }
    },
    takePhoto() {
        if (typeof wx === 'undefined') {
            return;
        }

        // 隐藏按钮
        this.HistoryBtn.active = false;
        this.SettingBtn.active = false;
        this.ShareBtn.active = false;
        this.MuseumBtn.active = false;

        wx.authorize({
            scope: 'scope.writePhotosAlbum',   // 需要获取相册权限

            success: (res) => {
                let tempFilePath = cc.game.canvas.toTempFilePathSync({
                    fileType: 'jpg',
                    quality: '1'
                });
                // 将截图保存到相册中
                wx.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success: (res) => {
                        wx.showToast({
                            title: '图片保存成功',
                            icon: 'success',
                            duration: 2000
                        });
                    },
                    fail: (res) => {
                        console.log(res);
                        console.log('图片保存失败');
                        
                    },
                    complete: (res)=>{
                        console.log(res);
                        this.HistoryBtn.active = true;
                        this.SettingBtn.active = true;
                        this.ShareBtn.active = true;
                        this.MuseumBtn.active = true;
                    }
                });
            },

            fail: (res) => {
                console.log('授权失败');
                console.log(res);
                this.HistoryBtn.active = true;
                this.SettingBtn.active = true;
                this.ShareBtn.active = true;
                this.MuseumBtn.active = true;
            },
            
        });

    },
    switchStrategyCanvas(){
        if(this.StrategyCanvas.active){
            this.StrategyCanvas.active = false;
        }
        else{
            this.StrategyCanvas.active = true;
        }
    }
});