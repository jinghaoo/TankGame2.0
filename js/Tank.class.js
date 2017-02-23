/**
 * 创建Tank构造函数
 * createTime 2016/9/7 19:18
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
function Tank(oParent, elem, x, y, bgPos, speed, dir, type, blood, interval, name, game, score) {

    CreateObj.call(this, oParent, elem, x, y, bgPos, speed, dir);
    this.type = type;          //坦克类型
    this.blood = blood;        //
    this.shotInterval = interval;  //射击间隔时间
    this.name = name;          //坦克name  区别英雄坦克
    this.game = game;    //游戏对象

    this.timing = 0;     //坦克射出子弹的时间
    this.prevDir = DOWN; //初始化上次方向
    this.shot = false;   //是否已发射子弹
    this.stop = false;   //是否停止

    this.score = score;
}

/**
 * 继承Objece
 */
Tank.prototype = new CreateObj();

/**
 * 初始化坦克位置
 */
Tank.prototype.init = function () {
    this.obj = this.createElem();
    this.oParent.appendChild(this.obj);
    this.initLocation();
    this.obj.id = this.name;
};

/**
 * 向左移动
 */
Tank.prototype.moveLeft = function () {

    if (this.obj.offsetLeft <= 0) {  //如果到达左边界，

        this.obj.style.left = 0 + PX;
        return true;               // 不能移动就需要转变方向
    } else {

        this.obj.style.left = (this.obj.offsetLeft - this.speed) + PX;
        if (this.isCollide(LEFT, this.bgPos[0][0], this.bgPos[0][1])) {
            this.obj.style.left = (this.obj.offsetLeft + this.speed) + PX;
            return true;
        }
        return false;
    }
};

/**
 * 向右移动
 */
Tank.prototype.moveRight = function () {

    if (this.obj.offsetLeft >= (this.oParent.offsetWidth - this.obj.offsetWidth)) {

        this.obj.style.left = this.oParent.offsetWidth - this.obj.offsetWidth + PX;
        return true;
    } else {

        this.obj.style.left = (this.obj.offsetLeft + this.speed) + PX;
        if (this.isCollide(RIGHT, this.bgPos[2][0], this.bgPos[2][1])) {
            this.obj.style.left = (this.obj.offsetLeft - this.speed) + PX;
            return true;
        }
        return false;
    }
};

/**
 * 向上移动
 */
Tank.prototype.moveUp = function () {

    if (this.obj.offsetTop <= 0) {
        this.obj.style.top = 0 + PX;
        return true;
    } else {

        this.obj.style.top = this.obj.offsetTop - this.speed + PX;
        //如果碰撞了，返回原来的位置
        if (this.isCollide(UP, this.bgPos[1][0], this.bgPos[1][1])) {
            this.obj.style.top = this.obj.offsetTop + this.speed + PX;
            return true;
        }
        return false;
    }
};

/**
 * 向下移动
 */
Tank.prototype.moveDown = function () {

    if (this.obj.offsetTop >= this.oParent.offsetHeight - this.obj.offsetHeight) {
        this.obj.style.top = this.oParent.offsetHeight - this.obj.offsetHeight + PX;
        return true;
    } else {

        this.obj.style.top = this.obj.offsetTop + this.speed + PX;
        if (this.isCollide(DOWN, this.bgPos[3][0], this.bgPos[3][1])) {
            this.obj.style.top = this.obj.offsetTop - this.speed + PX;
            return true;
        }
        return false;
    }
};

/**
 * 移动时是否碰撞
 * 碰撞返回true
 */
Tank.prototype.isCollide = function (dir, bgPosLeft, bgPosTop) {

    this.changeBgPos(bgPosLeft, bgPosTop);
    this.dir = dir;
    this.resetPosition();
    var collAll = this.getCollideElem();
    var collLength = collAll.length;
    //碰撞检测
    for (var i = 0; i < collLength; i++) {
        if (this.collide(collAll[i])) {  //如果有碰撞
            return true;
        }
    }
    return false;
};

/**
 * 当转弯90度后，因为移动而产生了坐标的改变，这样会产生无法转弯的bug
 * 由左右转到上下的时候，改变left值保证它的left值是16的倍数，从而转向后可以上下自由，不会因为碰撞而停止移动
 比如转向后left是126, 它只有是128的时候才能正常向上向下移动. （126 + 8）/16 = 8.375 再取整得8
 8 * 16 == 128 正好是它能自由上下移动的值
 */
Tank.prototype.resetPosition = function () {

    if ((this.dir % 2 == 0 && this.prevDir % 2 == 1) || (this.dir % 2 == 1 && this.prevDir % 2 == 0)) {

        if (this.dir == LEFT || this.dir == RIGHT) {

            if (this.obj.offsetTop % 16 != 0) {
                var iTop = parseInt((this.obj.offsetTop + 8) / 16);
                iTop = iTop * 16;
                this.obj.style.top = iTop + PX;
            }
        }
        else if (this.dir == UP || this.dir == DOWN) {

            if (parseInt(this.obj.style.left) % 16 != 0) {

                var iLeft = parseInt((this.obj.offsetLeft + 8) / 16);
                iLeft = iLeft * 16;
                this.obj.style.left = iLeft + PX;
            }
        }
    }
    this.prevDir = this.dir;
};

/**
 * 获取所有的碰撞元素
 */
Tank.prototype.getCollideElem = function () {

    var tanks = [];
    tanks.length = 0;

    for (var i = 0; i < this.game.tanks.length; i++) {
        if (this.name != this.game.tanks[i].name) {
            tanks.push(this.game.tanks[i].obj);
        }
    }

    var oMapObs = this.game.maps.obstacle;
    var collAll = tanks.concat(oMapObs);
    return collAll;
};


/**
 * 射击方法
 */
Tank.prototype.shoot = function () {

    if (!this.shot) {
        this.shot = true;
        var oBullet = new Bullet(this.oParent,
            {name: DIV, className: BULLET},
            this.obj.offsetLeft,
            this.obj.offsetTop,
            BULLET_BGPOS,
            this.speed + 2,
            this.type,
            this.dir,
            this.name,
            this.game
        );

        oBullet.init();
        this.game.bullets.push(oBullet);
    }
};

/**
 * 更新射击
 */
Tank.prototype.updateShoot = function () {

    if (this.shot) {
        this.timing++;
        if (this.timing >= this.shotInterval) {
            this.timing = 0;
            this.shot = false;
        }
    }
};


/**
 * 自由移动
 */
Tank.prototype.moveFree = function () {

    if (!this.stop) {
        this.shoot();
        this.obj.x = this.obj.offsetLeft;
        this.obj.y = this.obj.offsetTop;

        if (this.move(this.dir)) {

            var i = Math.floor(Math.random() * 4);
            var dir = this.dir;
            if (dir == LEFT && i == RIGHT && Math.floor(Math.random() * 4) != 3) {
                this.dir == LEFT;
            } else if (dir == UP && i == DOWN && Math.floor(Math.random() * 4) != 3) {
                this.dir = UP;
            } else if (dir == RIGHT && i == DOWN && Math.floor(Math.random() * 4) != 3) {
                this.dir = RIGHT;
            } else if (dir == DOWN && i == UP && Math.floor(Math.random() * 4) != 3) {
                this.dir = DOWN
            } else {
                this.dir = i;
            }
        }
    }
};

/**
 * 是否被击中
 */
Tank.prototype.isHited = function () {

    //遍历所有的子弹
    for (var i = 0; i < this.game.bullets.length; i++) {
        //有重复区域并且不是自己的子弹
        if (this.collide(this.game.bullets[i].obj) && this.name != this.game.bullets[i].name) {

            this.game.bullets[i].die = true;
            this.blood--;

            if (this.blood <= 0 && this.type == TYPE_ENEMY) {
                //如果是敌方坦克   敌方坦克的死亡个数+1
                this.game.enemyDieCnt++;

                this.bomb(true);
                if (this.obj.className.indexOf(FLICKER) >= 0) {
                    var type = Math.floor(Math.random() * 6);
                    var randomX = Math.floor(Math.random() * 386);
                    var randomY = Math.floor(Math.random() * 386);

                    var prop = new Props(this.oParent,
                        {name:DIV,id:ANNEX,className:ANNEX+FLICKER},
                        randomX,
                        randomY,
                        ANNEX_BGPOS[type],
                        ANNEX_TYPE[type],
                        this.game
                    );

                    prop.init();
                    this.game.props.push(prop);
                }
            } else if (this.blood == 2) {
                this.bgPos = B_ENEMY_BGPOS_2;
            } else if (this.blood == 1) {
                this.bgPos = B_ENEMY_BGPOS_1;
            }
        }
    }
}
;

/**
 *坦克爆炸
 */
Tank.prototype.bomb = function (isBomb) {

    
    if (isBomb) {
        var bomb = new Bomb(
            this.oParent,
            {name: DIV, className: BOMB},
            this.obj.offsetLeft - 16,
            this.obj.offsetTop - 16,
            BOMB_4,
            12,
            this.game
        );

        bomb.init();
        this.game.bomb.push(bomb);

        for (var i = 0; i < this.game.tanks.length; i++) {
            if (this.id == this.game.tanks[i].id && this.name == this.game.tanks[i].name) {
                this.game.tanks.splice(i, 1);
                break;
            }
        }
        this.oParent.removeChild(this.obj);
    }
};