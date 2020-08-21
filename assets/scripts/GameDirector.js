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

        // 资源数组
        resArray: [],
        // 标志动作是否完成
        isSpeaking: false,
        isComplete: true,
        scriptIndex: 0, // 记录脚本当前动作下标
        maxScriptIndex: 0, // 记录脚本总动作数
        // 背景节点
        Background: cc.Node,
        // 两个人物
        Actor1: cc.Node,
        Actor2: cc.Node,
        // 对话框相关
        Dialog: cc.Node,
        DialogLabel: cc.Node,
        playSpeed: 0.1,
        linesIndex: 0,
        backColor: new cc.Color(125, 125, 125),
        frontColor: new cc.Color(255, 255, 255),
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 初始化变量
        this.isComplete = true; // 刚开始无动作。
        this.isSpeaking = false;
        this.resArray = new Array();
        cc.resources.load('plays/play', (err, json)=>{
            this.playJson = json.json;
            this.scriptIndex = 0;
            this.maxScriptIndex = this.playJson.script.length;
            this.playScirpt();
        });
        // 打字机效果
        this.typeWriter = (str)=>{
            this.DialogLabel.getComponent(cc.Label).string = str.substr(0, this.linesIndex);
            ++this.linesIndex;
            if(this.linesIndex > str.length){
                this.isComplete = true;
                this.linesIndex = 0;
            }
        };
        // 点击进行下一个动作
        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            if(this.isComplete){
                this.playScirpt();
            }
        });
    },
    playScirpt(){
        let item = this.playJson.script[this.scriptIndex];
        let action = null;
        switch(item.op){
            case "speak":
                this.isComplete = false;
                this.isSpeaking = true;
                this.linesIndex = 0;
                let content = this.playJson.script[this.scriptIndex].content.lines;
                this.schedule(this.typeWriter.bind(this, content), this.playSpeed, content.length);
                break;
            case "background-switch":
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite)=>{
                    if(err !== undefined)
                        cc.log(err);
                    this.Background.getComponent(cc.Sprite).spriteFrame = sprite;
                });
                this.scheduleOnce(()=>{
                    this.isComplete = true;
                }, item.content.delay);
                break;
            case "dialog-switch":
                this.isComplete = false;
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite)=>{
                    if(err !== undefined)
                        cc.log(err);
                    this.Dialog.getComponent(cc.Sprite).spriteFrame = sprite;
                    this.playScirpt();
                });
                break;
            case "actor1-appear":
                this.isComplete = false;
                this.Actor1.setPosition(item.content.posX, item.content.posY);
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite)=>{
                    if(err !== undefined)
                        cc.log(err);
                    this.Actor1.getComponent(cc.Sprite).spriteFrame = sprite;
                    this.playScirpt();
                });
                break;
            case "actor2-appear":
                this.isComplete = false;
                this.Actor2.setPosition(item.content.posX, item.content.posY);
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite)=>{
                    if(err !== undefined)
                        cc.log(err);
                    this.Actor2.getComponent(cc.Sprite).spriteFrame = sprite;
                    this.playScirpt();
                });
                break;
            case "actor1-front":
                action = new Promise((resolve, reject)=>{
                    this.Actor1.color = this.frontColor;
                    resolve();
                });
                action.then(()=>{
                    this.playScirpt();
                })
                break;
            case "actor2-front":
                action = new Promise((resolve, reject)=>{
                    this.Actor2.color = this.frontColor;
                    resolve();
                });
                action.then(()=>{
                    this.playScirpt();
                })
                break;
            case "actor1-back":
                action = new Promise((resolve, reject)=>{
                    this.Actor1.color = this.backColor;
                    resolve();
                });
                action.then(()=>{
                    this.playScirpt();
                })
                break;
            case "actor2-back":
                action = new Promise((resolve, reject)=>{
                    this.Actor2.color = this.backColor;
                    resolve();
                });
                action.then(()=>{
                    this.playScirpt();
                })
                break;
        }
        ++this.scriptIndex;
    }
    // update (dt) {},
});
