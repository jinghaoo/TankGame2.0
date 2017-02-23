/**
 * 道具构造函数
 * Created by jh on 2016/9/9 21:22
 */
function Props(oParent, elem, x, y, bgPos, type, game) {

    CreateObj.call(this, oParent, elem, x, y, bgPos);
    this.timing = 0;
    this.interVal = 300;
    this.type = type;
    this.game = game;
}

/**
 * 继承 CreateObj
 * @type {CreateObj}
 */
Props.prototype = new CreateObj();

/**
 * 是否被撞击（被吃掉）
 */
Props.prototype.isHited = function () {

    for (var j = 0; j < this.game.tanks.length; j++) {

        if (this.collide(this.game.tanks[j].obj)) {

            if (this.game.tanks[j].name == PLAY || this.game.tanks[j].name == PLAY2) {

                this.game.oMusic.playMusic(M_ANNEX);
                var playName = this.game.tanks[j].name;

                switch (this.type) {

                    case TANK_TYPE://坦克  增加生命数

                        this.game.updatePlayersLifeNum(playName, ADD);
                        break;
                    case PAUSE_TYPE://暂停  现存的敌方坦克停止移动

                        this.game.pauseTiming = 0;  //重置计时器为0
                        this.game.isPause = true;  //设置成暂停状态
                        for (var i = 0; i < this.game.tanks.length; i++) {

                            if (this.game.tanks[i].name != PLAY && this.game.tanks[i].name != PLAY2) {
                                this.game.tanks[i].stop = true;
                            }
                        }
                        break;
                    case SHOVEL_TYPE://铲子   老巢周围变为铁（石头）

                        this.game.shovelTiming = 0;
                        this.game.isShovel = true;

                        for (var i = 0; i < this.game.maps.obstacle.length; i++) {
                            if(this.game.maps.obstacle[i].material == 7){
                                this.oParent.removeChild(this.game.maps.obstacle[i]);
                                this.game.maps.obstacle.splice(i,1);
                                i--;
                            }
                        }

                        for(var i = 0;i < this.game.maps.lairEnclosure.length; i++){
                            var oIron = this.game.maps.createElem(DIV, IRON);
                            oIron.style.position = POSITION;
                            oIron.material = 7;//用以分辨类型
                            oIron.style.left = this.game.maps.lairEnclosure[i].style.left;
                            oIron.style.top = this.game.maps.lairEnclosure[i].style.top;

                            this.game.maps.obstacle.push(oIron);
                            this.oParent.appendChild(oIron);
                        }
                        break;
                    case BOMB_TYPE://拳头  现存敌方坦克的全部爆炸

                        for (var i = 0; i < this.game.tanks.length; i++) {

                            if (this.game.tanks[i].name != PLAY && this.game.tanks[i].name != PLAY2) {
                                this.game.tanks[i].bomb(true);
                                this.game.enemyDieCnt++;
                                i--;
                            }
                        }
                        break;
                    case STAR_TYPE://星星   坦克加强

                        this.game.tanks[i].speed += 2;
                        break;
                    case HAT_TYPE: //帽子  无敌

                        //移除以前的无敌状态  重新计算
                        for(var i = 0;i < this.game.flicks.length; i++){
                            if(this.game.flicks[i].name == playName){
                                console.log(this.game.flicks[i].obj);
                                this.oParent.removeChild(this.game.flicks[i].obj);
                                this.game.flicks.splice(i,1);
                                break;
                            }
                        }
                        // 产生无敌状态
                        var flick = new Flick(this.oParent,
                            {name: DIV, className: PLAY_IMG},
                            this.game.tanks[j].obj.offsetLeft,
                            this.game.tanks[j].obj.offsetTop,
                            MY_IMG_BGPOS,
                            false,
                            playName,
                            playName,
                            this.game
                        );
                        flick.interVal = 300;
                        flick.init();
                        this.game.flicks.push(flick);
                        break;
                    default:
                        break;
                }

                this.oParent.removeChild(this.obj);
                return true;
            }
        }
    }
    return false;
};

/**
 * 超时清除
 */
Props.prototype.timeOut = function () {
    this.timing++;
    if (this.timing > this.interVal) {
        this.timing = 0;
        this.oParent.removeChild(this.obj);
        return true;
    }

    return false;
}
