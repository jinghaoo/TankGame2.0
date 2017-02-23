# 以前写的小项目，一直放在别的库里..
相信大家对坦克大战都不陌生，并且网上也有很多用java实现的小程序，最近用了几天时间将其使用javaScript语言通过面向对象的方式实现，在实现的过程中吸收了很多新的知识，现在趁着程序即将完成之际将其记录下来。

废话不多说，先上程序源码：[https://github.com/jinghaoo/TankGame2.0](https://github.com/jinghaoo/TankGame2.0)

### 项目需求

　　在写程序之前，我们需要先大体的了解一下项目的一些需求和注意事项，方便以后的开发。

　　程序在运行之前会有从下到上的开场动画，然后鼠标点击选择游戏的人数，游戏在进入每一个关卡之前会有第几关的提示，进入游戏后，玩家通过键盘操纵坦克移动，转弯，射击，与敌人交战，直到消灭所有的敌人就算过关。

### 开发过程

#### HTML

　　因为本程序的HTML结构比较简单，所以在此就不多加赘述，只是在引入js文件的时候，需要注意一下引入的顺序即可。

#### CSS

　　在css中需要根据精灵图来分配每个小型单位的样式，需要注意的是因为有些图片的缺失使用了一部分css3做出了动画效果来表现为特殊坦克。

#### javaScript

　　本程序以javaScript为主，下面我将以在本程序开发中javaScript的编写顺序来讲述一下大体的思路。 

　　在程序中我们会有一个游戏控制构造函数来进行游戏的总体控制，它在其中重要的是使用定时器来控制游戏的更新，也就是我们所做的所有活动都需要定时器来更新。

　　我们需要define文件保存一些常用的数据，有兴趣的可以自己重新测量一遍，但我感觉没有必要，因为我感觉写一个或者学习一个程序还是以逻辑为主，很多无必要的工作能不做就不做。而mapData中则保存的是我们的地图数据，我们可以对其进行自由的拓展。在core中我们主要保存了一些常用的方法，方便在其他的js调用。

　　根据我的设计思路是首先将地图构造函数即Map.class.js设计出来,再设计物体构造函数Object.class.js，而其他的所有的对象都会派生自物体构造函数，所以这就需要我们对其他的对象进行一下公有属性和公有方法的提取，再依次设计其他对象的具体构造函数，后面再依次介绍。

　　首先我们们讲一下地图构造函数的大致思路：

```js
function Map(oParent, oRight, level) {
   this.oParent = oParent;
   this.oRight = oRight;
   this.level = level;

   this.eMapLevel = [];     //地图数组
   this.eMapLength = 0;     //地图数组的长度
   this.mapEnemyType = [];  // 保存敌方坦克的出场顺序
   this.lairEnclosure = []; //保存老巢的围墙
   this.obstacle = [];      //保存所有障碍物
}
```
　　因为我们需要对DOM进行操作，所以我们需要写一个创建节点的方法，如下
```js
   Map.prototype.createElem = function (sElem, sClass, sId) {
        var oElem = document.createElement(sElem);
        if (sClass) {
        oElem.className = sClass;
        }
        if (sId) {
        oElem.id = sId;
        }
        return oElem;
    }
```
　　当我们要对地图初始化时，需要调用initMap方法
```js
    Map.prototype.initMap = function () {

       this.initLevel();
       this.initLeftMap();
    };
```

　　它需要获取地图数据，并保存到相关的变量中，提前获取地图数组的长度，可以在遍历数组的时候不再重复的获取消耗时间。我只写了3关，如果有兴趣可自行在mapDate.js中添加

```js
    Map.prototype.initLevel = function () {
        switch (this.level) {
            case 1:
                this.eMapLevel = eMap.level_1.obstacles;
                this.eMapLength = eMap.level_1.obstacles.length;
                this.mapEnemyType = eMap.level_1.enemyType;
                break;
            case 2:
                this.eMapLevel = eMap.level_2.obstacles;
                this.eMapLength = eMap.level_2.obstacles.length;
                this.mapEnemyType = eMap.level_2.enemyType;
                break;
            case 3:
                this.eMapLevel = eMap.level_3.obstacles;
                this.eMapLength = eMap.level_3.obstacles.length;
                this.mapEnemyType = eMap.level_3.enemyType;
                break;
            default :
                this.eMapLevel = eMap.level_1.obstacles;
                this.eMapLength = eMap.level_1.obstacles.length;
                this.mapEnemyType = eMap.level_1.enemyType;
                break;
        }
    };
```
    
　　最后一步是我们需要对左侧的地图进行初始化，值得一提的是我们对其的做法，因为我们这个程序主要是侧重于对DOM的操作，所以我们首先对每一个节点div都不设置绝对定位，当我们将地图全部加载完毕后再，将它们转化为绝对定位，这样方便以后在我们的操作中修改和判断。

```js
Map.prototype.initLeftMap = function () {
    var oFrag = document.createDocumentFragment();

    for (var i = 0; i < this.eMapLength; i++) {
        for (var j = 0; j < this.eMapLevel[i].length; j++) {

            switch (this.eMapLevel[i][j]) {
                case 0://道路
                    var oBare = this.createElem(DIV, BARE);
                    oBare.material = 0;//用以分辨类型
                    oFrag.appendChild(oBare);
                    break;

                case 1://墙
                    var oWall = this.createElem(DIV, WALL);
                    oWall.material = 1;//用以分辨类型
                    oFrag.appendChild(oWall);
                    break;

                case 2://铁（石头）
                    var oIron = this.createElem(DIV, IRON);
                    oIron.material = 2;//用以分辨类型
                    oFrag.appendChild(oIron);
                    break;

                case 3://花
                    var oFlower = this.createElem(DIV, FLOWER);
                    oFlower.material = 3;//用以分辨类型
                    oFrag.appendChild(oFlower);
                    break;

                case 7://墙(老巢周围的墙)
                    var oWall = this.createElem(DIV, WALL);
                    oWall.material = 7;//用以分辨类型
                    oFrag.appendChild(oWall);
                    break;

                case 9://老巢
                    var oBare = this.createElem(DIV, BARE);
                    oBare.material = 0;
                    oFrag.appendChild(oBare);

                    var oLair = this.createElem(DIV, LAIR, LAIR);
                    //这个时候设置老巢为绝对定位，使其不在原来的位置不影响div的排列
                    oLair.style.position = POSITION;
                    oLair.material = 9;
                    oFrag.appendChild(oLair);
                    break;

                default :
                    break;
            }
        }
    }

    this.oParent.appendChild(oFrag);

    var oElem = this.oParent.getElementsByTagName(DIV);
    var iElemLen = oElem.length;
    var index = 0;

    //需要对每一个方块进行绝对定位，
    // 所以要计算每一个相对于左上角的偏移量就是每一个div的offsetLeft
    for (var i = 0; i < iElemLen; i++) {
        if (oElem[i].id !== LAIR) {//不是老巢
            oElem[i].style.left = oElem[i].offsetLeft + PX;
            oElem[i].style.top = oElem[i].offsetTop + PX;
        }
    }

    //给每一个元素进行绝对定位
    for (var i = 0; i < iElemLen; i++) {
        if (oElem[i].id != LAIR) {//不是老巢
            oElem[i].style.position = POSITION;
            if (oElem[i].material == 7) {  //老巢周围的墙
                oElem[i].id = index++;
                this.lairEnclosure.push(oElem[i]);
                this.obstacle.push(oElem[i]);
            } else if (oElem[i].material == 1 || oElem[i].material == 2) {
                //如果是墙或者是铁（石头），保存到障碍物数组中
                this.obstacle.push(oElem[i]);
            }
        }
    }

    //获取老巢节点
    var oLair = $(LAIR);
    //设置老巢节点的偏移量与和它上一个同级的的位置相同
    oLair.style.top = oLair.previousSibling.offsetTop + PX;
    oLair.style.left = oLair.previousSibling.offsetLeft + PX;
    oLair.style.zIndex = 6;
};

```
好了，今天先暂且写到这里吧，下一次将把物体的构造思路和坦克的构造思路写一下，感觉还是比较有新意的。小弟初识javaScript面向对象设计，如有错误之处，望批评指正。
