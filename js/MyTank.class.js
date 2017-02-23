/**
 * 英雄坦克构造函数
 * createTime 2016/9/7 19:13
 * createBy jh
 */

/**
 * 创建Tank构造函数
 * @param oParent父级对象    即创建坦克添加到的目标对象  父级节点的对象
 * @param elem  创建坦克的元素键值对 如{name:'tagName',id:'id',className:'className'}必须有name值
 * @param x   坦克对象的初始横坐标
 * @param y   坦克对象的初始纵坐标
 * @param bgPos  坦克对象的背景图位置数组，按L T R B排序
 * @param speed  坦克对象的移动速度
 * @param dir   坦克对象的移动方向
 * @param type  坦克的类型
 * @param blood  坦克的血量
 * @param interval  坦克的射击间隔
 * @param name    坦克的名称
 * @constructor
 */
function MyTank(oParent, elem, x, y, bgPos, speed, dir, type, blood, interval, name, game) {

    Tank.apply(this, arguments);
}

/**
 * 继承Tank
 * @type {Tank}
 */
MyTank.prototype = new Tank();


/**
 * 重写射击方法
 */
MyTank.prototype.shoot = function () {

    if (!this.shot) {  //射击音乐
        this.game.oMusic.playMusic(M_ATTACK);
    }
    //调用父级被覆盖的方法
    Tank.prototype.shoot.call(this);
};

/**
 * 重写更新射击
 */
MyTank.prototype.updateShoot = function () {

    Tank.prototype.updateShoot.call(this);

    if (this.isHaveBullet()) {
        this.shot = true;
    } else {
        this.shot = false;
    }

};

/**
 * 属于自己的子弹是否还存在  返回true  还存在  返回false 不存在
 */
MyTank.prototype.isHaveBullet = function () {

    for (var i = 0; i < this.game.bullets.length; i++) {

        if (this.name == this.game.bullets[i].name) {
            return true;
        }
    }

    this.timing = 0;
    return false;
};

/**
 * 重写坦克被击中方法
 */
MyTank.prototype.isHited = function () {

    for (var i = 0; i < this.game.bullets.length; i++) {
        if (this.name != this.game.bullets[i].name && this.collide(this.game.bullets[i].obj)) {
            this.game.bullets[i].die = true;

            if (!this.isFlick()) {
                this.blood--;

                if (this.blood <= 0) {

                    this.game.updatePlayersLifeNum(this.name, SUB);
                    this.bomb(true);
                }
            }
        }
    }
};


/**
 * 重写自由移动方法
 */
MyTank.prototype.moveFree = function () {
};


/**
 * 是否有闪烁即无敌
 */
MyTank.prototype.isFlick = function () {
    for (var i = 0; i < this.game.flicks.length; i++) {

        if (this.game.flicks[i].name == this.name) {
            return true;
        }
    }
    return false;
}