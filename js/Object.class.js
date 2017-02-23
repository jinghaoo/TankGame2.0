/**
 * 物体总类  所有的物体都派生自本类
 * createTime: 20:48 2016/08/30
 * create by: jh
 */
/**
 *
 * @param oParent父级对象    即创建对象添加到的目标对象  父级节点的对象
 * @param elem  创建物体的元素键值对 如{name:'tagName',id:'id',className:'className'}必须有name值
 * @param x   物体对象的初始横坐标
 * @param y   物体对象的初始纵坐标
 * @param bgPos  物体对象的背景图位置数组，按L T R B排序
 * @param speed  物体对象的移动速度
 * @param dir   物体对象的移动方向
 * @constructor
 */

function CreateObj(oParent, elem, x, y, bgPos, speed, dir) {
    this.oParent = oParent;
    this.elem = elem;
    this.obj = null; //表示本物体元素对象
    this.x = x;
    this.y = y;
    this.bgPos = bgPos;
    this.speed = speed;
    this.dir = dir;
    this.stop = false; //物体是否处于停止状态  false：不是 true：是
    this.id = randomId();//(new Date()).getTime();  //给每一个物体一个id
}

/**
 * 初始化对象
 */
CreateObj.prototype.init = function () {
    this.obj = this.createElem();  //创建节点
    this.oParent.appendChild(this.obj);//将元素追加到父级节点下

    this.changeBgPos(this.bgPos[0][0], this.bgPos[0][1]);
    this.initLocation();//初始化元素位置
};

/**
 * 初始化元素位置
 */
CreateObj.prototype.initLocation = function () {
    this.obj.style.left = this.x + PX;
    this.obj.style.top = this.y + PX;
};

/**
 * 根据对象的键值对中的name 创建元素（标签）
 */
CreateObj.prototype.createElem = function () {
    var obj = document.createElement(this.elem.name);
    if (this.elem.id) {
        obj.id = this.elem.id;
    }

    if (this.elem.className) {
        obj.className = this.elem.className;
    }
    return obj;
};

/**
 * 修改背景图片的position  （因为改向而造成的）
 * @param left  距离左边位置
 * @param top   距离上边位置
 */
CreateObj.prototype.changeBgPos = function (left, top) {
    this.obj.style.backgroundPosition = left + PX + ' ' + top + PX;
};

/**
 * 碰撞检测（补全）
 * @param obj1 检测的对象
 * @returns {boolean}  true:碰撞了  false:不碰撞
 * 解释说明  以obj1为基准，满足任意一个不等式即可说明，没有碰撞。
 */
CreateObj.prototype.collide = function (obj1) {
    var L1 = this.obj.offsetLeft;
    var T1 = this.obj.offsetTop;
    var W1 = this.obj.offsetWidth + L1;
    var H1 = this.obj.offsetHeight + T1;

    var L2 = obj1.offsetLeft;
    var T2 = obj1.offsetTop;
    var W2 = obj1.offsetWidth + L2;
    var H2 = obj1.offsetHeight+ T2;

    //如果没有碰撞
    if(L2 >= W1 || T2 >= H1 || W2 <= L1 || H2 <= T1){
        return false;
    }
    return true;
};

/**
 * 物体移动
 * @param dir  移动的方向
 */
CreateObj.prototype.move = function (dir) {
    this.clear();
    if (!this.stop) {
        switch (dir) {
            case LEFT:
                return this.moveLeft();
                break;
            case UP:
                return this.moveUp();
                break;
            case RIGHT:
                return this.moveRight();
                break;
            case DOWN:
                return this.moveDown();
                break;
        }
    }
};

/**
 * 向左移动接口
 */
CreateObj.prototype.moveLeft = function () {
};

/**
 * 向上移动接口
 */
CreateObj.prototype.moveUp = function () {
};

/**
 * 向右移动接口
 */
CreateObj.prototype.moveRight = function () {
};

/**
 * 向下移动接口
 */
CreateObj.prototype.moveDown = function () {
};

/**
 * 清除
 */
CreateObj.prototype.clear = function () {

};