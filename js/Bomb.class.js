/**
 * 爆炸对象的构造函数
 * CreatedTime on 2016/9/8 15:28
 * createBy jh
 */
/**
 * 爆炸对象的构造函数
 * @param interVal  爆炸持续时间
 * @param game   //游戏对象
 * @constructor
 */
function Bomb(oParent, elem, x, y, bgPos, interVal, game) {
    CreateObj.call(this, oParent, elem, x, y, bgPos);

    this.timing = 0;
    this.game = game;   //游戏对象
}

/**
 * 继承CreateObj
 * @type {CreateObj}
 */
Bomb.prototype = new CreateObj();

/**
 * 重写切换背景图位置的方法
 */
Bomb.prototype.changeBgPos = function () {

    //子弹爆炸
    if (this.bgPos.length == 2) {
        if (this.timing == 0) {
            this.obj.style.backgroundPosition =
                this.bgPos[0][0] + ' ' + this.bgPos[0][1] + PX;
        }
        else if (this.timing == 3) {
            this.obj.style.backgroundPosition =
                this.bgPos[1][0] + ' ' + this.bgPos[1][1] + PX;

            for (var i = 0; i < this.game.bomb.length; i++) {
                if (this.id == this.game.bomb[i].id) {
                    this.game.bomb.splice(i, 1);
                    break;
                }
            }
            this.oParent.removeChild(this.obj);
        }
    } else {  //坦克爆炸



        if (this.timing == 0) {
            this.game.oMusic.playMusic(M_BOMB0);

            this.obj.style.backgroundPosition =
                this.bgPos[0][0] + ' ' + this.bgPos[0][1] + PX;
        } else if (this.timing == 3) {

            this.obj.style.backgroundPosition =
                this.bgPos[1][0] + ' ' + this.bgPos[1][1] + PX;
        } else if (this.timing == 6) {

            this.obj.style.backgroundPosition =
                this.bgPos[2][0] + ' ' + this.bgPos[2][1] + PX;
        } else if (this.timing == 9) {

            this.obj.style.backgroundPosition =
                this.bgPos[3][0] + ' ' + this.bgPos[3][1] + PX;
        } else if (this.timing == 12) {


            this.oParent.removeChild(this.obj);
            for (var i = 0; i < this.game.bomb.length; i++) {

                if (this.id == this.game.bomb[i].id) {

                    this.game.bomb.splice(i, 1);
                    break;
                }
            }
        }
    }
    this.timing++;
};