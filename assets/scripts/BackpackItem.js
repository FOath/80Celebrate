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
        GameAdmin: cc.Node,

        //index: 0,
        //uniqueId: "1598267019",
        typeId: {
            get(){
                return this._typeId;
            },
            set(value){
                // 剔除无效的id
                this._typeId = value;
                // 缩略图
                cc.resources.load(this.GameGlobalData.BuildingType[value].imageUrl, cc.SpriteFrame, (err, sprite)=>{
                    if(err != undefined)
                        cc.log(err);
                    let originSize = sprite.getOriginalSize();
                    let scale1 = 130 / originSize.height;
                    let scale2 = 155 / originSize.width;
                    let minScale = Math.min(scale1, scale2);
                    this.Thumbnail.scale = minScale;
                    this.Thumbnail.getComponent(cc.Sprite).spriteFrame = sprite;
                });
                // 科技 文化 魅力
                /*if(this.GameGlobalData.BuildingType[value].epicType != 0){
                    let science = this.GameGlobalData.BuildingType[value].science * 100;
                    let culture = this.GameGlobalData.BuildingType[value].culture;
                    let charm = this.GameGlobalData.BuildingType[value].charm * 100;
                    this.Science.getComponent(cc.Label).string = "科技加成：" + science + "%";
                    this.Culture.getComponent(cc.Label).string = "文化：" + culture;
                    this.Charm.getComponent(cc.Label).string   = "金币加成：" + charm + "%";
                }
                else{
                    this.Science.getComponent(cc.Label).string = "科技：" + this.GameGlobalData.BuildingType[value].science;
                    this.Culture.getComponent(cc.Label).string = "文化：" + this.GameGlobalData.BuildingType[value].culture;
                    this.Charm.getComponent(cc.Label).string   = "金币：" + this.GameGlobalData.BuildingType[value].charm;
                }*/
                
            }
        },
        /*level: {
            get(){
                return this._level;
            },
            set(value){
                this._level = value;
                if(this.GameGlobalData.BuildingType[this.typeId].epicType != 0){
                    this.Level.destroy();
                }
                else{
                    this.Level.getComponent(cc.Label).string = "等级："+ value;
                }
            }
        },*/
        //Level: cc.Node,
        //Science: cc.Node,
        //Culture: cc.Node,
        //Charm: cc.Node,
        Thumbnail: cc.Node,
        PutdownBtn: cc.Node,
        Description: cc.Node,
        ChangeLayoutBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {
        
    //},

    start () {
        this.GameAdmin = cc.find('/GameAdmin').getComponent('GameAdmin');
        this.ChangeLayoutBtn = cc.find('/Canvas/GameCanvas/ChangeLayoutBtn');
        this.PutdownBtn.on(cc.Node.EventType.TOUCH_END, (event)=>{
            if(this.GameAdmin.GameState != 1)
                this.ChangeLayoutBtn.getComponent('ChangeLayoutBtn').onClick();
            this.GameAdmin.setBuildingMuseum(event, false);

            let building = new this.GameGlobalData.ExistingBuildingTemplate().init(
                this.GameGlobalData.ExistingBuildingArray.length, // index
                new Date().valueOf(), // uniqueId
                this.typeId, // typeId
                1, // level
                false, // isRotate
                true, // isBackpack
                0, // posX
                0, // posY
                new Date().valueOf(), // lastProduce
            );
            this.GameGlobalData.ExistingBuildingArray.push(building);
            this.GameAdmin.initBuilding(event, building.index, building.uniqueId, building.typeId);
        })
    },
    init(/*index, uniqueId,*/ typeId/*, level*/){
        this.GameGlobalData = cc.find('/GameGlobalData').getComponent('GameGlobalData');
        //this.index = index;
        //this.uniqueId = uniqueId;
        this.typeId = typeId;
        this.Description.getComponent(cc.Label).string = this.GameGlobalData.BuildingType[this.typeId].name;
        //this.level = level;
    }
    // update (dt) {},
});
