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

        // 游戏管理员
        GameAdmin: cc.Component,

        // 设置界面
        Setting: cc.Node,
        SettingClose: cc.Node,
        SettingRotate: cc.Node,
        SettingCheck: cc.Node,
        // 建筑
        beforePos: cc.v2(0, 0),
        BuildingName: '',
        BuildingSize: {
            get(){
                return this._BuildSize;
            },
            set(value){
                this._BuildSize = value;
            }
        },
        canPutDown:{
            get(){
                return this._canPutDown;
            },
            set(value){
                this._canPutDown = value;
            }
        },
        // 编辑网格
        EditGrid: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 游戏管理员
        this.GameAdmin = cc.find('/GameAdmin').getComponent('GameAdmin');
        // 设置界面
        this.Setting = this.node.getChildByName('Setting');
        this.SettingClose = this.Setting.getChildByName('Close');
        this.SettingRotate = this.Setting.getChildByName('Rotate');
        this.SettingCheck = this.Setting.getChildByName('Check');
        // 建筑

    },
    // 旋转建筑
    rotateBuilding(){
        let building = this.node.getChildByName('')
    }
    // update (dt) {},
});
