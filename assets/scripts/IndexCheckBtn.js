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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    signIn(){
        this.GameGlobalData = cc.find('GameGlobalData');

        // 先进行判断，现在没接api，先不判断
        
        // 加载场景文件
        cc.resources.load('test/sceneData', (err, json)=>{
            cc.game.addPersistRootNode(this.GameGlobalData);
            this.GameGlobalData.getComponent('GameGlobalData').init(json.json);
            cc.director.loadScene('main');
        });
    }
    // update (dt) {},
});
