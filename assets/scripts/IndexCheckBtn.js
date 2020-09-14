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
        HintCanvas: cc.Node,
        HintLabel: cc.Node,
        LoadingCanvas: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
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

    signIn() {

        this.GameGlobalData = cc.find('GameGlobalData');
        let name = this.NameText.getComponent(cc.EditBox).string;
        let studentId = this.StudentIdText.getComponent(cc.EditBox).string;
        if (name == "" || studentId == "") {
            console.log("姓名学号不能为空");
            this.HintLabel.getComponent(cc.Label).string = "姓名工号不能为空";
            this.HintCanvas.active = true;
            return;
        }
        // 显示加载框
        this.LoadingCanvas.active = true;
        this.LoadingCanvas.getChildByName('Fishes').getComponent(cc.Animation).play();


        // 游戏服务器的逻辑判断

        var xhrGame = new XMLHttpRequest();
        xhrGame.addEventListener("load", () => {
            this.LoadingCanvas.active = false;
            if (xhrGame.readyState == 4 && (xhrGame.status >= 200 && xhrGame.status < 400)) {
                let res = JSON.parse(xhrGame.responseText);
                // 0为老用户，1为新用户
                if (res.check_state != 2) {
                    // 加载结果
                    cc.game.addPersistRootNode(this.GameGlobalData);

                    // 设置玩家类型
                    this.GameGlobalData.getComponent('GameGlobalData').userType = res.check_state;

                    this.GameGlobalData.getComponent('GameGlobalData').init(res);
                    cc.director.loadScene('main');
                }
                else {
                    this.HintLabel.getComponent(cc.Label).string = "姓名工号不匹配";
                    this.HintCanvas.active = true;
                }
            }
            else {
                this.HintLabel.getComponent(cc.Label).string = "网络连接超时";
                this.HintCanvas.active = true;
            }
        });
        xhrGame.addEventListener("timeout", () => {
            cc.log("游戏服务器超时");

            this.LoadingCanvas.active = false;

            this.HintLabel.getComponent(cc.Label).string = "网络连接超时";
            this.HintCanvas.active = true;

        });
        xhrGame.addEventListener("error", () => {
            this.LoadingCanvas.active = false;

            this.HintLabel.getComponent(cc.Label).string = "网络连接错误";
            this.HintCanvas.active = true;
        });
        let urlGame = "https://wxxyx.m0yuqi.cn/wxxyx/check?id=" + studentId + "&name=" + name;
        xhrGame.open("GET", urlGame);
        xhrGame.send();

        // 先进行学校的数据库判断是否是本校人员
        /*let urlUniversity = "https://api.info.bit.edu.cn/pub/registeredPerson/v1/checkUserInfo?bn=" + studentId + "&fullname=" + name;
        var xhrUniversity = new XMLHttpRequest();
        xhrUniversity.addEventListener("load", () => {
            
            //{"errcode":0,"data":{"代码":"3220190920","姓名":"张政","性别码":"1"}}
            
            if (xhrUniversity.readyState == 4 && (xhrUniversity.status >= 200 && xhrUniversity.status < 400)) {
                let res = JSON.parse(xhrUniversity.responseText);
                // errcode为0表明验证通过，1表示验证不通过
                if (res.errcode == 0) {
                    // 向游戏服务器请求数据
                    cc.log("向游戏服务器发送数据");
                    let urlGame = "https://wxxyx.m0yuqi.cn/wxxyx/check?id=" + studentId + "&name=" + name;
                    xhrGame.open("GET", urlGame);
                    xhrGame.send();
                }
                else {
                    this.LoadingCanvas.active = false;

                    this.HintLabel.getComponent(cc.Label).string = "姓名工号不匹配";
                    this.HintCanvas.active = true;
                }
            }
        });
        xhrUniversity.addEventListener("timeout", () => {
            this.LoadingCanvas.active = false;

            this.HintLabel.getComponent(cc.Label).string = "验证网络连接超时";
            this.HintCanvas.active = true;
        });
        xhrUniversity.addEventListener("error", () => {
            this.LoadingCanvas.active = false;

            this.HintLabel.getComponent(cc.Label).string = "验证网络连接错误";
            this.HintCanvas.active = true;
        });
        xhrUniversity.open("GET", urlUniversity);
        xhrUniversity.setRequestHeader("apikey", "tkEV2bqFMjAVmQzHd6ugV3pAZR8C5Z69");
        xhrUniversity.send();*/

    },
    closeHintCanvas() {
        this.HintCanvas.active = false;
    }
    // update (dt) {},
});
