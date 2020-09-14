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
        GameGlobalData: cc.Node,
        Hint: cc.Node,
        Label1: cc.Node,
        Label2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.GameGlobalData = cc.find('/GameGlobalData');

        this.btnClip = cc.find('Btn').getComponent(cc.AudioSource);
        this.closeClip = cc.find('Close').getComponent(cc.AudioSource);

        this.Levels = new Array();
        for(let i = 1; i <= 8; ++i){
            this.Levels[i] = this.node.getChildByName("Level" + i);
        }

        let level = this.GameGlobalData.getComponent('GameGlobalData').level;
        for(let i = level + 1; i <= 8; ++i){
            this.Levels[i].getComponent(cc.Button).interactable = false;
            this.Levels[i].getChildByName("Background").color = cc.color(180, 180, 180);
        }


        // 检测是否完成了关卡，完成之后送
        let res = "";
        if(this.GameGlobalData.getComponent('GameGlobalData').completeLevel){
            this.Hint.active = true;
            switch (this.GameGlobalData.getComponent('GameGlobalData').currentLevel) {
                case 1:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第一关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：活动室、工科大楼、体育馆";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[9] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[10] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[20] = true;
                    break;
                case 2:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第二关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：超市、打印店";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[5] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[6] = true;
                    break;
                case 3:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第三关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：书店、小卖部";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[7] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[8] = true;
                    break;
                case 4:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第四关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：实验楼、实验室、丹枫楼";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[13] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[14] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[18] = true;

                    break;
                case 5:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第五关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：教学楼、游泳馆、理科教学楼";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[12] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[22] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[25] = true;
                    break;
                case 6:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第六关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：教室、西山实验室、主楼";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[11] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[15] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[24] = true;
                    break;
                case 7:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第七关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：艺术馆、京工食堂、徐特立图书馆";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[16] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[17] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[21] = true;
                    break;
                case 8:
                    this.Label1.getComponent(cc.Label).string = "恭喜您完成第八关";
                    this.Label2.getComponent(cc.Label).string = "获得建筑：北理工的恶龙、中心教学楼、北理纪念碑";
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[19] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[23] = true;
                    this.GameGlobalData.getComponent('GameGlobalData').ExistingTypeArray[26] = true;
                    break;                  
            }
            this.GameGlobalData.getComponent('GameGlobalData').completeLevel = false;
        }
        this.GameGlobalData.getComponent('GameGlobalData').currentLevel = 0;
    },
    selectLevel(event, level){
        if(this.GameGlobalData.getComponent('GameGlobalData').soundState){
            this.btnClip.play();
        }
        cc.log("load level " + level);
        cc.game.addPersistRootNode(this.GameGlobalData);
        this.GameGlobalData.getComponent('GameGlobalData').currentLevel = parseInt(level);
        cc.director.loadScene("levelScene");
    },
    closeHint(){
        if(this.GameGlobalData.getComponent('GameGlobalData').soundState){
            this.closeClip.play();
        }
        this.Hint.active = false;
    },
    backToMain(){
        if(this.GameGlobalData.getComponent('GameGlobalData').soundState){
            this.btnClip.play();
        }
        cc.director.loadScene("main");
    }
    // update (dt) {},
});
