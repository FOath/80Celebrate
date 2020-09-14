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
        GameAdmin: cc.Component,
        Hint: cc.Node,
        HintLabel: cc.Node,
        sprite0: cc.SpriteFrame,
        sprite1: cc.SpriteFrame,
        LabelArray: [],
    },
    start() {
        this.GameAdmin = cc.find('GameAdmin').getComponent('GameAdmin');
        this.GameGlobalData = cc.find('GameGlobalData').getComponent('GameGlobalData');
        this.LabelArray = [
            "这片地嗯...是片宝地",
            "人就要吃苦耐劳",
            "上网不涉密，涉密不上网",
            "点我换换新布局吧",
            "没事干？点点北边的石碑看看"
        ]
        this.timer = 0;
    },
    update(dt) {
        if (this.GameAdmin.GameState == 0) {
            this.timer += dt;
            if (this.timer > 4) {
                let rand = Math.floor(Math.random() * 5);
                this.HintLabel.getComponent(cc.Label).string = this.LabelArray[rand];
                this.timer = 0;
            }
        }
    },
    onClick() {
        this.GameAdmin.switchGameState();
        if (this.GameAdmin.GameState == 0) {
            this.HintLabel.getComponent(cc.Label).string = "修的还挺漂亮";
            this.getComponent(cc.Button).normalSprite = this.sprite0;
            this.getComponent(cc.Button).pressedSprite = this.sprite0;
            this.getComponent(cc.Button).hoverSprite = this.sprite0;
            this.getComponent(cc.Button).disabledSprite = this.sprite0;

            // 发送摆放结果到服务器
            let buildings = [];
            for (let i = 0; i < this.GameGlobalData.ExistingBuildingArray.length; ++i) {
                buildings.push({
                    "unique_id": this.GameGlobalData.ExistingBuildingArray[i].uniqueId,
                    "type_id": this.GameGlobalData.ExistingBuildingArray[i].typeId,
                    "level": this.GameGlobalData.ExistingBuildingArray[i].level,
                    "position_x": this.GameGlobalData.ExistingBuildingArray[i].posX,
                    "position_y": this.GameGlobalData.ExistingBuildingArray[i].posY,
                    "is_rotate": this.GameGlobalData.ExistingBuildingArray[i].isRotate,
                    "is_backpack": this.GameGlobalData.ExistingBuildingArray[i].isBackpack,
                    "last_produce": this.GameGlobalData.ExistingBuildingArray[i].lastProduce
                })
            }

            var postTest = new XMLHttpRequest();
            postTest.addEventListener("load", () => {
                cc.log("发送成功");
            });
            let url = "https://wxxyx.m0yuqi.cn/wxxyx/postPersonalInformation";
            postTest.open("POST", url);
            var sendData = {
                "personal_information": {
                    "id": this.GameGlobalData.userId,
                    "user_name": this.GameGlobalData.userName
                },
                "game_data": {
                    "score": {
                        "science": 0,
                        "culture": 0,
                        "charm": 0,
                        "level": this.GameGlobalData.level
                    },
                    "buildings": buildings
                }
            };
            console.log(sendData);
            postTest.send(JSON.stringify(sendData));
        }
        else if (this.GameAdmin.GameState == 1) {
            this.HintLabel.getComponent(cc.Label).string = "摆完记得点我";
            this.timer = 0;
            this.getComponent(cc.Button).normalSprite = this.sprite1;
            this.getComponent(cc.Button).pressedSprite = this.sprite1;
            this.getComponent(cc.Button).hoverSprite = this.sprite1;
            this.getComponent(cc.Button).disabledSprite = this.sprite1;
        }
    }
});
