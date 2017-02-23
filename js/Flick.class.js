/**
 * 创建坦克时出现的闪烁对象
 * createTime  2016/9/8 16:55
 * createBy   jh
 */

/**
 * 创建坦克时出现的闪烁对象的构造函数
 * @param oParent父级对象    即创建坦克添加到的目标对象  父级节点的对象
 * @param elem  创建闪烁的元素键值对 如{name:'tagName',id:'id',className:'className'}必须有name值
 * @param x   闪烁对象的初始横坐标
 * @param y   闪烁对象的初始纵坐标
 * @param bgPos  闪烁对象的背景图位置数组，按L T R B排序
 * @param sync   true：先出闪烁图再出坦克即创建敌方坦克，false：闪烁图和坦克同时出现即创建我方坦克
 * @param id       用以判断创建坦克的id
 * @param name     闪烁图名称，用以判断是谁在闪烁
 * @constructor
 */
function Flick(oParent, elem, x, y, bgPos, sync, id, name, game) {

    CreateObj.call(this, oParent, elem, x, y, bgPos);

    this.sync = sync;
    this.id = id;
    this.name = name
    this.game = game;

    this.timing = 0;
    this.interVal = 60;
}

/**
 * 继承CreateObj
 * @type {CreateObj}
 */
Flick.prototype = new CreateObj();

/**
 * 显示在画面上
 */
Flick.prototype.show = function () {

    this.move();
    if (this.timing < this.interVal) {
        var cnt = this.timing % this.bgPos.length;
        this.changeBgPos(this.bgPos[cnt][0], this.bgPos[cnt][1]);
    } else {

        this.oParent.removeChild(this.obj);
        this.timing = 0;

        for (var i = 0; i < this.game.flicks.length; i++) {
            if (this.id == this.game.flicks[i].id) {
                this.game.flicks.splice(i, 1);
                if (this.sync) {
                    this.createEnemyTank(this.oParent, this.x, this.y, this.id);
                }
                break;
            }
        }
    }
    this.timing++;
};

/**
 * 移动
 */
Flick.prototype.move = function () {
    if (!this.sync) {
        for (var i = 0; i < this.game.tanks.length; i++) {
            if (this.game.tanks[i].name == this.name) {
                this.obj.style.left = this.game.tanks[i].obj.offsetLeft + PX;
                this.obj.style.top = this.game.tanks[i].obj.offsetTop + PX;
            }
        }
    }
};

/**
 * 创建敌方坦克
 * @param oParent
 * @param x
 * @param y
 * @param id
 */
Flick.prototype.createEnemyTank = function (oParent, x, y, id) {

    var flicker = Math.random()<0.25 ?FLICKER:'';

    var tank = null;
    switch (id) {
        case FAST:
            tank = new Tank(oParent,
                {name: DIV, className: ENEMY_FAST+flicker},
                x,
                y,
                F_ENEMY_BGPOS,
                ENEMY_FAST_SPEED,
                DOWN,
                TYPE_ENEMY,
                ENEMY_FAST_BLOOD,
                ENEMY_FAST_SHOOT_INTERVAL,
                ENEMY,
                this.game,
                ENEMY_FAST_SCORE
            );
            break;
        case ENEMY:

            tank = new Tank(
                oParent,
                {name: DIV, className: ENEMY_FAST+flicker},
                x,
                y,
                G_ENEMY_BGPOS,
                ENEMY_SPEED,
                DOWN,
                TYPE_ENEMY,
                ENEMY_BLOOD,
                ENEMY_SHOOT_INTERVAL,
                ENEMY,
                this.game,
                ENEMY_SCORE
            );
            break;
        case BIG:

            tank = new Tank(
                oParent,
                {name: DIV, className: ENEMY_FAST+flicker},
                x,
                y,
                B_ENEMY_BGPOS_3,
                ENEMY_BIG_SPEED,
                DOWN,
                TYPE_ENEMY,
                ENEMY_BIG_BLOOD,
                ENEMY_BIG_SHOOT_INTERVAL,
                ENEMY,
                this.game,
                ENEMY_FAST_SCORE
            );
            break;

    }

    this.game.tanks.push(tank);
    tank.init();

    var oEnemyCnt = $(ENEMY_COUNT);
    var lastNode = oEnemyCnt.lastElementChild || oEnemyCnt.lastChild;
    oEnemyCnt.removeChild(lastNode);
}