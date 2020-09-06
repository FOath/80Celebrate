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
        GameGlobalData: cc.Component,

        building: cc.Component,
        Thumbnail: cc.Node,
        scienceLabel: cc.Node,
        cultureLabel: cc.Node,
        moneyLabel: cc.Node,
        levelLabel: cc.Node,
        priceLabel: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    init(building) {
        this.GameGlobalData = cc.find('GameGlobalData').getComponent('GameGlobalData');

        this.node.active = true;

        this.building = building;
        let typeId = this.building.typeId;

        // 加载建筑图片
        cc.resources.load(this.building.imageUrl, cc.SpriteFrame, (err, sprite) => {
            if (err != undefined)
                cc.log(err);
            this.Thumbnail.getComponent(cc.Sprite).spriteFrame = sprite;
        });
        let level = this.building.level;
        if (typeId >= 6) {
            // 史诗建筑不需要升级
            this.scienceLabel.getComponent(cc.Label).string = (this.building.science * 100) + "%";
            this.cultureLabel.getComponent(cc.Label).string = this.building.culture;
            this.moneyLabel.getComponent(cc.Label).string = (this.building.money * 100) + "%";
            this.levelLabel.getComponent(cc.Label).string = level;
            this.priceLabel.getComponent(cc.Label).string = "不可升级";
        }
        else {
            // 初始化等级
            this.levelLabel.getComponent(cc.Label).string = level + "→" + (level + 1);
            // 初始化科技值
            let oriScience = this.calculateLevelData(level, this.building.science, this.GameGlobalData.BuildingLevelArray[typeId].scienceState, this.GameGlobalData.BuildingLevelArray[typeId].science);
            let desScience = this.calculateLevelData(level + 1, this.building.science, this.GameGlobalData.BuildingLevelArray[typeId].scienceState, this.GameGlobalData.BuildingLevelArray[typeId].science);
            this.scienceLabel.getComponent(cc.Label).string = oriScience + "/分钟→" + desScience + "/分钟";
            // 初始化文化值
            let oriCulture = this.calculateLevelData(level, this.building.culture, this.GameGlobalData.BuildingLevelArray[typeId].cultureState, this.GameGlobalData.BuildingLevelArray[typeId].culture);
            let desCulture = this.calculateLevelData(level + 1, this.building.culture, this.GameGlobalData.BuildingLevelArray[typeId].cultureState, this.GameGlobalData.BuildingLevelArray[typeId].culture);
            this.cultureLabel.getComponent(cc.Label).string = oriCulture + "→" + desCulture;
            // 初始化金钱
            let oriMoney = this.calculateLevelData(level, this.building.money, this.GameGlobalData.BuildingLevelArray[typeId].moneyState, this.GameGlobalData.BuildingLevelArray[typeId].money);
            let desMoney = this.calculateLevelData(level + 1, this.building.money, this.GameGlobalData.BuildingLevelArray[typeId].moneyState, this.GameGlobalData.BuildingLevelArray[typeId].money);
            this.moneyLabel.getComponent(cc.Label).string = oriMoney + "/分钟→" + desMoney + "/分钟";
            // 初始化花费
            this.priceLabel.getComponent(cc.Label).string = this.GameGlobalData.BuildingLevelArray[typeId].price;
        }

    },

    close() {
        this.building = null;
        this.node.active = false;
    },
    calculateLevelData(level, source, state, coe) {
        if (state) {
            return source * Math.pow(coe + 1, level - 1);
        }
        else {
            return source + (level - 1) * coe;
        }
    }
    // update (dt) {},
});
