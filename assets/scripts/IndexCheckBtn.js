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
                {
                    "unique_id": "1598267019",
                    "type_id": 0,
                    "level": 1,
                    "position_x": -300,
                    "position_y": 0,
                    "is_rotate": false,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267020",
                    "type_id": 1,
                    "level": 1,
                    "position_x": 150,
                    "position_y": -375,
                    "is_rotate": false,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267021",
                    "type_id": 2,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
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
                    "unique_id": "1598267023",
                    "type_id": 4,
                    "level": 1,
                    "position_x": -300,
                    "position_y": 0,
                    "is_rotate": false,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267024",
                    "type_id": 5,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267025",
                    "type_id": 6,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267026",
                    "type_id": 7,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267027",
                    "type_id": 8,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267028",
                    "type_id": 9,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267029",
                    "type_id": 10,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267030",
                    "type_id": 11,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267031",
                    "type_id": 12,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267032",
                    "type_id": 13,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267033",
                    "type_id": 14,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267034",
                    "type_id": 15,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267035",
                    "type_id": 16,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267036",
                    "type_id": 17,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267037",
                    "type_id": 18,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267038",
                    "type_id": 19,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },
                {
                    "unique_id": "1598267039",
                    "type_id": 20,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },{
                    "unique_id": "1598267040",
                    "type_id": 21,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },{
                    "unique_id": "1598267041",
                    "type_id": 22,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                },{
                    "unique_id": "1598267042",
                    "type_id": 23,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                }
                ,{
                    "unique_id": "1598267043",
                    "type_id": 24,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                }
                ,{
                    "unique_id": "1598267044",
                    "type_id": 25,
                    "level": 1,
                    "position_x": -600,
                    "position_y": 100,
                    "is_rotate": true,
                    "is_backpack": true,
                    "last_produce": "1598267030"
                }
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
        });
        xhr.open("GET", url);
        xhr.send();
    }
    // update (dt) {},
});
