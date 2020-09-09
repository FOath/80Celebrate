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
        isAutoPlay: false,
        isSpeedUp: false,
        isComplete: true,
        scriptIndex: 0, // 记录脚本当前动作下标
        maxScriptIndex: 0, // 记录脚本总动作数
        // 背景节点
        BackgroundL: cc.Node,
        BackgroundR: cc.Node,
        spriteL: cc.spriteFrame,
        spriteR: cc.spriteFrame,
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
        // 四个选项
        AnswerCanvas: cc.Node,
        Answer1: cc.Node,
        Answer2: cc.Node,
        Answer3: cc.Node,
        Answer4: cc.Node,
        correntAnswer: -1,
        // 自动播放按钮
        AutoPlay: cc.Node,
        APSprite: cc.SpriteFrame,
        APSpritePressed: cc.SpriteFrame,
        // 加速按钮
        SpeedUp: cc.Node,
        SUSprite: cc.SpriteFrame,
        SUSpritePressed: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化变量
        this.isComplete = false; // 刚开始无动作。
        this.playSpeed = 0.05;

        // 打字机效果
        this.typeWriter = (str) => {
            this.DialogLabel.getComponent(cc.Label).string = str.substr(0, this.linesIndex);
            ++this.linesIndex;
            if (this.linesIndex > str.length) {
                this.linesIndex = 0;
                this.isSpeaking = false;
                if (!this.isAutoPlay) {
                    this.isComplete = true;
                }
                else {
                    this.scheduleOnce(() => {
                        this.playScirpt();
                    }, 0.5);
                }
            }
        };
        this.Answer1.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (this.correntAnswer >= 0 && this.correntAnswer == 1) {
                this.playScirpt();
            }
            else {
                ++this.scriptIndex;
                this.playScirpt();
            }
            this.AnswerCanvas.active = false;
        }, this);
        this.Answer2.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (this.correntAnswer >= 0 && this.correntAnswer == 2) {
                this.playScirpt();
            }
            else {
                ++this.scriptIndex;
                this.playScirpt();
            }
            this.AnswerCanvas.active = false;
        }, this);
        this.Answer3.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (this.correntAnswer >= 0 && this.correntAnswer == 3) {
                this.playScirpt();
            }
            else {
                ++this.scriptIndex;
                this.playScirpt();
            }
            this.AnswerCanvas.active = false;
        }, this);
        this.Answer4.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (this.correntAnswer >= 0 && this.correntAnswer == 4) {
                this.playScirpt();
            }
            else {
                ++this.scriptIndex;
                this.playScirpt();
            }
            this.AnswerCanvas.active = false;
        }, this);
        // 点击进行下一个动作
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (this.isComplete) {
                this.playScirpt();
            }
        });
    },

    start() {
        this.GameGlobalData = cc.find('/GameGlobalData');

        this.btnClip = cc.find('/Btn').getComponent(cc.AudioSource);

        cc.resources.load('plays/level' + this.GameGlobalData.getComponent('GameGlobalData').currentLevel, (err, json) => {
            this.playJson = json.json;
            this.scriptIndex = 0;
            this.maxScriptIndex = this.playJson.script.length;
            // 设置背景音乐
            cc.resources.load("/bgm/" + this.playJson.bgm, cc.AudioClip, (err, clip) => {
                if (err != undefined)
                    console.log(err);
                this.getComponent(cc.AudioSource).clip = clip;
                this.getComponent(cc.AudioSource).play();
                this.getComponent(cc.AudioSource).volume = 0.3;
                this.getComponent(cc.AudioSource).loop = true;
            });
            this.playScirpt();
        });
    },
    setAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        if(this.GameGlobalData.soundState){
            this.btnClip.play();
        }
        // 自动播放未开启
        if (!this.isAutoPlay) {
            this.AutoPlay.getComponent(cc.Button).normalSprite = this.APSprite;
            this.AutoPlay.getComponent(cc.Button).pressedSprite = this.APSpritePressed;
            this.AutoPlay.getComponent(cc.Button).hoverSprite = this.APSprite;
        }
        else {
            this.AutoPlay.getComponent(cc.Button).normalSprite = this.APSpritePressed;
            this.AutoPlay.getComponent(cc.Button).pressedSprite = this.APSprite;
            this.AutoPlay.getComponent(cc.Button).hoverSprite = this.APSpritePressed;
        }

    },
    setSpeedUp() {
        if(this.GameGlobalData.soundState){
            this.btnClip.play();
        }
        this.isSpeedUp = !this.isSpeedUp;
        if (!this.isSpeedUp) {
            this.playSpeed = 0.05;
            this.SpeedUp.getComponent(cc.Button).normalSprite = this.SUSprite;
            this.SpeedUp.getComponent(cc.Button).pressedSprite = this.SUSpritePressed;
            this.SpeedUp.getComponent(cc.Button).hoverSprite = this.SUSprite;
        }
        else {
            this.playSpeed = 0.02;
            this.SpeedUp.getComponent(cc.Button).normalSprite = this.SUSpritePressed;
            this.SpeedUp.getComponent(cc.Button).pressedSprite = this.SUSprite;
            this.SpeedUp.getComponent(cc.Button).hoverSprite = this.SUSpritePressed;
        }
    },
    backToMain() {
        if(this.GameGlobalData.soundState){
            this.btnClip.play();
        }
        cc.director.loadScene("selectLevel");
    },
    playScirpt() {
        if (this.scriptIndex >= this.playJson.script.length)
            return;
        let item = this.playJson.script[this.scriptIndex];
        let action = null;
        switch (item.op) {
            case "speak":
                this.isSpeaking = true;
                this.isComplete = false;
                this.linesIndex = 0;
                let content = this.playJson.script[this.scriptIndex].content.lines;
                this.schedule(this.typeWriter.bind(this, content), this.playSpeed, content.length);
                if (item.content.skip)
                    ++this.scriptIndex;
                break;
            case "question":
                this.AnswerCanvas.active = true;
                this.Answer1.getComponent(cc.Label).string = item.content.answer1;
                this.Answer2.getComponent(cc.Label).string = item.content.answer2;
                if (item.content.answer3) {
                    this.Answer3.active = true;
                    this.Answer3.getComponent(cc.Label).string = item.content.answer3;
                }
                else {
                    this.Answer3.active = false;
                    this.Answer3.getComponent(cc.Label).string = item.content.answer3;
                }
                if (item.content.answer4) {
                    this.Answer4.active = true;
                    this.Answer4.getComponent(cc.Label).string = item.content.answer4;
                }
                else {
                    this.Answer4.active = false;
                }
                this.correntAnswer = item.content.corrent_answer;
                break;
            case "backgroundl-switch":
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite) => {
                    if (err !== undefined)
                        cc.log(err);
                    this.spriteL = sprite;
                    this.playScirpt();
                });
                break;
            case "backgroundr-switch":
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite) => {
                    if (err !== undefined)
                        cc.log(err);
                    this.BackgroundL.getComponent(cc.Sprite).spriteFrame = this.spriteL;
                    this.BackgroundR.getComponent(cc.Sprite).spriteFrame = sprite;
                    this.scheduleOnce(() => {
                        this.playScirpt();
                    }, item.content.delay);
                });
                break;
            case "dialog-switch":
                this.isComplete = false;
                action = new Promise((resolve, reject) => {
                    this.Dialog.active = item.content.state;
                    this.AutoPlay.active = item.content.state;
                    this.SpeedUp.active = item.content.state;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                });
                break;
            case "actor1-appear":
                this.isComplete = false;
                this.Actor1.setPosition(item.content.posX, item.content.posY);
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite) => {
                    if (err !== undefined)
                        cc.log(err);
                    this.Actor1.getComponent(cc.Sprite).spriteFrame = sprite;
                    this.playScirpt();
                });
                break;
            case "actor2-appear":
                this.isComplete = false;
                this.Actor2.setPosition(item.content.posX, item.content.posY);
                cc.resources.load(item.content.url, cc.SpriteFrame, (err, sprite) => {
                    if (err !== undefined)
                        cc.log(err);
                    this.Actor2.getComponent(cc.Sprite).spriteFrame = sprite;
                    this.playScirpt();
                });
                break;
            case "actor1-front":
                action = new Promise((resolve, reject) => {
                    this.Actor1.color = this.frontColor;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                })
                break;
            case "actor2-front":
                action = new Promise((resolve, reject) => {
                    this.Actor2.color = this.frontColor;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                })
                break;
            case "actor1-back":
                action = new Promise((resolve, reject) => {
                    this.Actor1.color = this.backColor;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                })
                break;
            case "actor2-back":
                action = new Promise((resolve, reject) => {
                    this.Actor2.color = this.backColor;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                })
                break;
            case "actor1-disappear":
                action = new Promise((resolve, reject) => {
                    this.Actor1.getComponent(cc.Sprite).spriteFrame = null;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                })
                break;
            case "actor2-disappear":
                action = new Promise((resolve, reject) => {
                    this.Actor2.getComponent(cc.Sprite).spriteFrame = null;
                    resolve();
                });
                action.then(() => {
                    this.playScirpt();
                })
                break;
            case "end":
                if (this.GameGlobalData.getComponent('GameGlobalData').level < (this.GameGlobalData.getComponent('GameGlobalData').currentLevel + 1)) {
                    this.GameGlobalData.getComponent('GameGlobalData').completeLevel = true;
                    this.GameGlobalData.getComponent('GameGlobalData').level = this.GameGlobalData.getComponent('GameGlobalData').currentLevel + 1;

                    // 发送结果到服务器
                    let url = "https://wxxyx.m0yuqi.cn/wxxyx/updateLevel?id=" +  this.GameGlobalData.getComponent('GameGlobalData').userId + "&level=" +  this.GameGlobalData.getComponent('GameGlobalData').level;
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener("load", () => {
                        console.log(xhr.responseText);
                    });
                    xhr.open("GET", url);
                    xhr.send();

                }
                console.log(this.GameGlobalData.getComponent('GameGlobalData').level);
                cc.game.addPersistRootNode(this.GameGlobalData);
                cc.director.loadScene('selectLevel');
        }
        ++this.scriptIndex;
    }
    // update (dt) {},
});
