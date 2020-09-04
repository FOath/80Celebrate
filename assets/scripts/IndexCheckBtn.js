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
        StudentIdText: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        /*var postTest = new XMLHttpRequest();
        postTest.addEventListener("load", ()=>{
            cc.log("发送成功");
        });
        let url = "http://49.233.54.160:8000/postPersonalInformation";
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
                    "charm": 1000
                },
                "buildings": [
                {
                    "unique_id": "1598267019",
                    "type_id": 0,
                    "level": 1,
                    "position_x": -300,
                    "position_y": 0,
                    "is_rotate": false,
                    "is_backpack": false,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267020",
                    "type_id": 3,
                    "level": 1,
                    "position_x": 150,
                    "position_y": -375,
                    "is_rotate": false,
                    "is_backpack": false,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267021",
                    "type_id": 6,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": false,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267022",
                    "type_id": 3,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267013",
                    "type_id": 0,
                    "level": 1,
                    "position_x": -300,
                    "position_y": 0,
                    "is_rotate": false,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                }]
            }
        };
        postTest.send(JSON.stringify(sendData));*/
    },

    signIn(){
        this.GameGlobalData = cc.find('GameGlobalData');
        let name = this.NameText.getComponent(cc.EditBox).string;
        let studentId = this.StudentIdText.getComponent(cc.EditBox).string;
        if(name == "" || studentId == ""){
            cc.log("姓名学号不能为空");
            return;
        }
        // 先进行判断
        let url="http://49.233.54.160:8000/check?id="+studentId+"&name="+name;
        cc.log(url);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", ()=>{
            let res = JSON.parse(xhr.responseText);
            cc.log(res);
            // 0为老用户，1为新用户
            if(res.check_state != 2){
                // 加载结果
                cc.game.addPersistRootNode(this.GameGlobalData);
                this.GameGlobalData.getComponent('GameGlobalData').init(res);
                cc.director.loadScene('main');
            }
        });
        xhr.open("GET", url);
        xhr.send();
    }
    // update (dt) {},
});
