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

        // 记录两指移动时的触点距离
        touchDistance: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
            let touches = event.getTouches();
            if(touches.length == 1){
                // 单指触碰表示移动
                let screenSize = cc.winSize;
                let offset = event.getDelta();
                let des = cc.v2(this.node.x + offset.x, this.node.y + offset.y);
                let x = this.clamp(des.x, -(this.node.width * this.node.scale - screenSize.width) / 2, (this.node.width * this.node.scale - screenSize.width) / 2);
                let y = this.clamp(des.y, -(this.node.height * this.node.scale - screenSize.height) / 2 + 40 * this.node.scale, (this.node.height * this.node.scale - screenSize.height) / 2 + 40 * this.node.scale);
                this.node.setPosition(x, y);
            }
            else if(touches.length == 2){
                // 双指触碰表示缩放
                let touch0 = touches[0];
                let touch1 = touches[1];
                let dis = touch0.getLocation().sub(touch1.getLocation()).magSqr();
                cc.log(dis);
                if(dis > this.touchDistance){
                    this.node.scale = Math.min(this.node.scale + 0.1, 3);
                    
                }
                else if(dis < this.touchDistance){
                    this.node.scale = Math.max(this.node.scale - 0.1, 0.5);
                    // 防止缩小时露出边界
                    let screenSize = cc.winSize;
                    let x = this.clamp(this.node.x, -(this.node.width * this.node.scale - screenSize.width) / 2, (this.node.width * this.node.scale - screenSize.width) / 2);
                    let y = this.clamp(this.node.y, -(this.node.height * this.node.scale - screenSize.height) / 2 + 40 * this.node.scale, (this.node.height * this.node.scale - screenSize.height) / 2 + 40 * this.node.scale);
                    this.node.setPosition(x, y);
                }
                this.touchDistance = dis;
            }
        }, this);

        this.node.on(cc.Node.EventType.MOUSE_WHEEL,(event)=>{
            if(event.getScrollY() > 0){
                this.node.scale = Math.min(this.node.scale + 0.1, 3);
            }
            else{
                this.node.scale = Math.max(this.node.scale - 0.1, 0.5);
                // 防止缩小时露出边界
                let screenSize = cc.winSize;
                let x = this.clamp(this.node.x, -(this.node.width * this.node.scale - screenSize.width) / 2, (this.node.width * this.node.scale - screenSize.width) / 2);
                let y = this.clamp(this.node.y, -(this.node.height * this.node.scale - screenSize.height) / 2 + 40 * this.node.scale, (this.node.height * this.node.scale - screenSize.height) / 2 + 40 * this.node.scale);
                this.node.setPosition(x, y);
            }
        }, this);
    },

    start () {

    },
    clamp(num, min, max){
        if(num < min){
            return min;
        }
        else if(num > max){
            return max;
        }
        else 
            return num;
    },
    // update (dt) {},
});