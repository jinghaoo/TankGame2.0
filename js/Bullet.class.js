/**
 *  子弹构造方法
 *  CreateTime   2016/9/8  13:16
 *  CreateBy   jh
 */
function Bullet(oParent, elem, x, y, bgPos, speed, type, dir, name, game) {

    CreateObj.call(this, oParent, elem, x, y, bgPos, speed);
    this.dir = dir;     // 方向
    this.type = type;   // 子弹类型
    this.name = name;  //出自哪一个坦克
    this.game = game;  //游戏对象

    this.die = false;  //子弹是否死亡   ture ：死亡  false ：没有死亡
    this.prevDir = '';  //子弹之前的方向

}

/**
 * 继承CreateObj
 */
Bullet.prototype = new CreateObj();

/**
 * 重写子弹初始化方法
 */
Bullet.prototype.initLocation = function () {

    switch (this.dir) {
        case LEFT:

            this.obj.style.left = this.x + PX;
            this.obj.style.top = this.y + 13 + PX;
            if (this.prevDir != this.dir) {
                this.changeBgPos(this.bgPos[0][0], this.bgPos[0][1]);
            }
            this.prevDir = this.dir;
            break;
        case UP:

            this.obj.style.left = this.x + 13 + PX;
            this.obj.style.top = this.y + PX;
            if (this.prevDir != this.dir) {
                this.changeBgPos(this.bgPos[1][0], this.bgPos[1][1]);
            }
            this.prevDir = this.dir;
            break;
        case RIGHT:

            this.obj.style.left = this.x + 32 + PX;
            this.obj.style.top = this.y + 13 + PX;
            if (this.prevDir != this.dir) {
                this.changeBgPos(this.bgPos[2][0], this.bgPos[2][1]);
            }
            this.prevDir = this.dir;
            break;
        case DOWN:

            this.obj.style.left = this.x + 13 + PX;
            this.obj.style.top = this.y + 32 + PX;
            if (this.prevDir != this.dir) {
                this.changeBgPos(this.bgPos[3][0], this.bgPos[3][1]);
            }
            this.prevDir = this.dir;
            break;
    }
};

/**
 * 子弹向左移动
 */
Bullet.prototype.moveLeft = function () {

    this.obj.style.left = this.obj.offsetLeft - this.speed + PX;

    this.shotHit();//是否发生碰撞
    if (this.obj.offsetLeft <= 0) {
        this.die = true;
    }
};

/**
 * 子弹向上移动
 */
Bullet.prototype.moveUp = function () {
    this.obj.style.top = this.obj.offsetTop - this.speed + PX;

    this.shotHit();//是否发生碰撞
    if (this.obj.offsetTop <= 0) {
        this.die = true;
    }
};

/**
 * 子弹向右移动
 */
Bullet.prototype.moveRight = function () {
    this.obj.style.left = this.obj.offsetLeft + this.speed + PX;

    this.shotHit();//是否发生碰撞
    if (this.obj.offsetLeft >= this.oParent.offsetWidth - this.obj.offsetWidth) {
        this.die = true;
    }
};

/**
 * 子弹向下移动
 */
Bullet.prototype.moveDown = function () {
    this.obj.style.top = this.obj.offsetTop + this.speed + PX;

    this.shotHit();//是否发生碰撞
    if (this.obj.offsetTop >= this.oParent.offsetHeight - this.obj.offsetHeight) {
        this.die = true;
    }
};

/**
 * 子弹发生撞击
 */
Bullet.prototype.shotHit = function () {

    this.hitWall();//撞墙
    this.hitOtherBullets();//撞上其他子弹
};

/**
 * 撞墙  墙和子弹都消失
 */
Bullet.prototype.hitWall = function () {

    var obstacleLen = this.game.maps.obstacle.length;

    for (var i = 0; i < obstacleLen; i++) {

        if (this.collide(this.game.maps.obstacle[i])) {
            if (this.game.maps.obstacle[i].className == WALL) {//如果撞上墙  都消失

                this.oParent.removeChild(this.game.maps.obstacle[i]);
                this.game.maps.obstacle.splice(i, 1);
            }//如果没有撞上墙 撞上的是铁（石头）  子弹也死亡
            this.die = true;
            break;
        }
    }
};

/**
 * 撞到别的子弹上  都消失
 */
Bullet.prototype.hitOtherBullets = function () {

    var bulletsLen = this.game.bullets.length;
    for (var i = 0; i < bulletsLen; i++) {
        if (this.id != this.game.bullets[i].id) {
            if (this.collide(this.game.bullets[i].obj)) {
                this.die = true;
                this.game.bullets[i].die = true;
                break;
            }
        }
    }
}

/**
 * 重写清除方法
 */
Bullet.prototype.clear = function () {

    if (this.die) {
        //创建子弹爆炸对象
        var bomb = new Bomb(
            this.oParent,
            {name: DIV, className: BOMB},
            this.obj.offsetLeft - 28,
            this.obj.offsetTop - 28,
            BOMB_2,
            12,
            this.game
        );

        bomb.init();
        this.game.bomb.push(bomb);

        this.oParent.removeChild(this.obj);
        //var bulletsLen = this.game.bullets.length;
        for (var i = 0; i < this.game.bullets.length; i++) {

            if (this.id == this.game.bullets[i].id) {
                this.game.bullets.splice(i, 1);
                break;
            }
        }
    }
};