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
        NameText: cc.Node,
        StudentIdText: cc.Node,
        HintCanvas: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (typeof wx !== 'undefined') {
            wx.showShareMenu({
                success: (res) => {
                    console.log('开启被动转发成功！');
                },
                fail: (res) => {
                    console.log(res);
                    console.log('开启被动转发失败！');
                }
            });
        }
        cc.find('/Canvas/Background').getComponent(cc.AudioSource).volume = 0.3;
        /*var postTest = new XMLHttpRequest();
        postTest.addEventListener("load", ()=>{
            cc.log("发送成功");
        });
        let url = "https://wxxyx.m0yuqi.cn/wxxyx/postPersonalInformation";
        postTest.open("POST", url);
        var sendData = {
            "personal_information": {
                "id": "3220190920",
                "user_name": "张政"
            },
            "game_data": {
                "score": {
                    "science": 500,
                    "culture": 0,
                    "charm": 1000,
                    "level": 8
                },
                "buildings": [
                ]
            }
        };
        postTest.send(JSON.stringify(sendData));*/
    },

    signIn(){
        this.GameGlobalData = cc.find('GameGlobalData');
        let name = this.NameText.getComponent(cc.EditBox).string;
        let studentId = this.StudentIdText.getComponent(cc.EditBox).string;
        if(name == "" || studentId == ""){
            console.log("姓名学号不能为空");
            this.HintCanvas.active = true;
            return;
        }
        // 先进行判断
        let url="https://wxxyx.m0yuqi.cn/wxxyx/check?id="+studentId+"&name="+name;
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", ()=>{
            let res = JSON.parse(xhr.responseText);
            // 0为老用户，1为新用户
            if(res.check_state != 2){
                // 加载结果
                cc.game.addPersistRootNode(this.GameGlobalData);
                this.GameGlobalData.getComponent('GameGlobalData').init(res);
                cc.director.loadScene('main');
            }
            else{
                this.HintCanvas.active = true;
            }
        });
        xhr.open("GET", url);
        xhr.send();
    },
    closeHintCanvas(){
        this.HintCanvas.active = false;
    }
    // update (dt) {},
});
