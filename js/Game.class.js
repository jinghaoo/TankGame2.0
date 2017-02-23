/**
 * 游戏类
 * createTime 21:44 2016/8/30
 * createBy jh
 */
/**
 * 游戏对象
 * @param oParent
 * @param oRight
 * @param players  游戏成员个数
 * @constructor
 */
function Game(oParent, oRight, oAudio, players) {
    this.oParent = oParent;
    this.oRight = oRight;
    this.oAudio = oAudio;
    this.players = players;

    this.key = {};                    //键盘按键对象
    this.time = null;                 //存储定时器

    this.isPause = false;             //初始化坦克是否被定住
    this.pauseTiming = 0;             //初始化坦克定时的计时器
    this.pauseTime = 200;            //初始化坦克定时的时间

    this.isShovel = false;             //初始化老巢是否被铁保护
    this.shovelTiming = 0;             //初始化老巢是否被铁保护的计时器
    this.shovelTime = 400;            //初始化老巢是否被铁保护的时间
    this.shovelFlag = true;           //交替闪烁时的状态

    this.playerLifeCnt = 0;           //玩家一的生命值
    this.playerDieCnt = 0;            //玩家一的死亡数
    this.player2LifeCnt = 0;          //玩家二的生命值
    this.player2DieCnt = 0;           //玩家二的死亡数
    this.oPlay = null;                //玩家一对象
    this.oPlay2 = null;                //玩家二对象

    this.localNum = 0;               // 定义敌方坦克出现的位置 0：中间 1：左边 2：右边
    this.enemyShowInterval = 50;     //定义敌方坦克出现的时间间隔
    this.enemyShowTiming = -50;        //初始化距离敌方坦克出现的时间
    this.enemyDieCnt = 0;             //定义敌方坦克死亡的次数

    this.oMusic = null;              //游戏中音乐对象
    this.tanks = [];                 //游戏中的坦克对象
    this.maps = null;                //存储地图对象
    this.bullets = [];               //存储游戏中的子弹对象
    this.bomb = [];                  //存储游戏中的爆炸对象
    this.flicks = [];                  //存储游戏中的闪烁对象
    this.props = [];                //存储游戏中的道具对象

    this.level = 1;                  //游戏等级
    this.isBeggining = false;        //是否已经初始化玩家的生命数

    this.isOver = false;             // 游戏是否结束 true：是 false：否
}

/**
 * 开始游戏
 */
Game.prototype.startGame = function () {

    this.oMusic = new Music(this.oAudio);
    this.oMusic.init();
    this.oMusic.playMusic(M_START);

    //开场动画
    var oLevel = $(GAMELEVEL);
    this.oRight.style.backgroundColor = '#000';
    oLevel.getElementsByTagName(SPAN)[0].innerHTML = this.level;

    var This = this;
    startMoveTime(oLevel,
        {width: 496, height: 216, paddingTop: 200, left: 0, top: 0},
        2000,
        'linear',
        function () {
            startMoveTime(oLevel,
                {width: 0, height: 0, paddingTop: 0, left: 248, top: 208},
                2000,
                'linear',
                function () {
                    setTimeout(function () {
                        This.init();  //初始化游戏
                    }, 200);
                });
        });
};


/**
 *初始化游戏
 */
Game.prototype.init = function () {
    this.initMap();//初始化地图
    this.initPlayersLifeNum();//初始化玩家的生命值
    this.initGameInfo();//初始化右侧信息栏
    this.initEnemy();//初始化敌方的坦克数据
    this.initPlayers();     //初始化玩家
    this.ctrlPlayers();

    //修改右侧信息栏的背景色
    this.oRight.style.backgroundColor = '#7f7f7f';
    this.oFlagLifeNum.style.backgroundPosition =
        NUM_BGPOS[this.level][0] + PX + ' ' + NUM_BGPOS[this.level][1] + PX;

    var This = this;
    clearInterval(this.time);
    this.time = setInterval(function () {
        This.updateGame();  //进行玩家控制
    }, 32);
};

/**
 * 初始化地图
 */
Game.prototype.initMap = function () {

    this.maps = new Map(this.oParent, this.oRight, this.level);
    this.maps.initMap();
};

/**
 * 游戏信息(右侧信息栏)
 */
Game.prototype.initGameInfo = function () {
    //创建包围敌方坦克的DIV
    var oEnemyCount = this.createElem(DIV, ENEMY_COUNT, ENEMY_COUNT);

    //
    var oFrag = document.createDocumentFragment();
    var enemyCount = this.maps.mapEnemyType.length;//敌方坦克的数目

    //根据敌方坦克的数目以及类别创建右侧信息栏中的坦克头像
    for (var i = 0; i < enemyCount; i++) {
        var oEnemy = this.createElem(DIV, ENEMY_LIFE_STR);
        oEnemy.type = this.maps.mapEnemyType[i];
        oFrag.appendChild(oEnemy);
    }
    oEnemyCount.appendChild(oFrag);

    //玩家一，二的 IP IIP
    var oPlayLife = this.createElem(DIV, PLAY_LIFE_STR);
    var oPlay2Life = this.createElem(DIV, PLAY2_LIFE_STR);
    //旗帜
    var oFlag = this.createElem(DIV, FLAG);
    //玩家一，二的生命值  将属性关联到对象中方便以后的修改
    this.oPlayLifeNum = this.createElem(DIV, LIFE_NUM_STR, PLAY + LIFE_NUM);
    this.oPlay2LifeNum = this.createElem(DIV, LIFE_NUM_STR, PLAY2 + LIFE_NUM);
    //旗帜下的关卡等级
    this.oFlagLifeNum = this.createElem(DIV, LIFE_NUM_STR, FLAG_NUM);
    oPlayLife.appendChild(this.oPlayLifeNum);
    oPlay2Life.appendChild(this.oPlay2LifeNum);
    oFlag.appendChild(this.oFlagLifeNum);

    this.oRight.appendChild(oEnemyCount);
    this.oRight.appendChild(oPlayLife);
    this.oRight.appendChild(oPlay2Life);
    this.oRight.appendChild(oFlag);
};

/**
 * 初始化敌方坦克数据
 */
Game.prototype.initEnemy = function () {

    //3中坦克   普通的   速度快的  体型大的
    var enemyIdArr = [ENEMY, FAST, BIG];
    //获取右侧信息中包含坦克的DIV
    var oEnemyCount = $(ENEMY_COUNT);
    //包含坦克的DIV的最后一个子节点
    var oEnemyCountLast = oEnemyCount.lastElementChild || oEnemyCount.lastChild;

    if (oEnemyCountLast) {           // 仍然有坦克
        var lastType = oEnemyCountLast.type;//获取当前坦克的类型
        var enemyCnt = 0;

        for (var cnt = 0; cnt < this.tanks.length; cnt++) {
            if (this.tanks[cnt].type == 0) {
                enemyCnt++;
            }
        }


        if (enemyCnt < 4 && oEnemyCount.children.length != 0) {


            var flick = new Flick(this.oParent,
                {name: DIV, className: ENEMY_IMG},
                ENEMY_INIT_LOCAL[this.localNum][0],
                ENEMY_INIT_LOCAL[this.localNum][1],
                ENEMY_IMG_BGPOS,
                true,
                enemyIdArr[lastType],
                enemyIdArr[lastType],
                this
            );
            flick.init();
            this.flicks.push(flick);
            this.localNum++;
            if (this.localNum > 2) {
                this.localNum = 0;
            }
        }
    }
};

/**
 * 初始化玩家的生命值  并初始化玩家
 */
Game.prototype.initPlayersLifeNum = function () {

    if (!this.isBeggining) {
        if (this.players == 1) {
            this.playerLifeCnt = PLAY_LIFE;
        }
        else if (this.players == 2) {
            this.playerLifeCnt = PLAY_LIFE;
            this.player2LifeCnt = PLAY2_LIFE;
        }
        this.isBeggining = true;
    }
};

/**
 * 初始化玩家
 */
Game.prototype.initPlayers = function () {
    if (this.players == 1) {
        this.initPlayerOne();
    } else if (this.players == 2) {
        this.initPlayersTwo();
    }
};

/**
 * 初始化一个玩家
 */
Game.prototype.initPlayerOne = function () {
    //获取现在玩家一的剩余生命值
    var nowLife = this.playerLifeCnt - this.playerDieCnt;
    nowLife = nowLife < 0 ? 0 : nowLife;

    //修改精灵图的偏移值
    this.oPlayLifeNum.style.backgroundPosition =
        NUM_BGPOS[nowLife][0] + PX + ' ' + NUM_BGPOS[nowLife][1] + PX;

    this.updatePlayerOne();
};

/**
 * 初始化两个玩家
 */
Game.prototype.initPlayersTwo = function () {
    this.initPlayerOne();//初始化玩家一

    //获取现在玩家二的生命值
    var nowLife = this.player2LifeCnt - this.player2DieCnt;
    nowLife = nowLife < 0 ? 0 : nowLife;

    this.oPlay2LifeNum.style.backgroundPosition =
        NUM_BGPOS[nowLife][0] + PX + ' ' + NUM_BGPOS[nowLife][1] + PX;

    this.updatePlayerTwo();
};


/**
 * 检测是否已经存在玩家一
 * 返回true  表示存在玩家一
 */
Game.prototype.isHavePlayer = function () {

    for (var i = 0; i < this.tanks.length; i++) {

        if (this.tanks[i].name == PLAY) {
            return true;
        }
    }
    return false;
};

/**
 * 检测是否已经存在玩家二
 * 返回true  表示存在玩家二
 */
Game.prototype.isHavePlayer2 = function () {

    for (var i = 0; i < this.tanks.length; i++) {

        if (this.tanks[i].name == PLAY2) {
            return true;
        }
    }
    return false;
};

/**
 * 更新玩家一  创建坦克一
 */
Game.prototype.updatePlayerOne = function () {

    if (!this.isHavePlayer() && (this.playerLifeCnt >= this.playerDieCnt)) {

        var flick = new Flick(this.oParent,
            {name: DIV, className: PLAY_IMG},
            MY_INIT_LOCAL[0][0],
            MY_INIT_LOCAL[0][1],
            MY_IMG_BGPOS,
            false,
            PLAY,
            PLAY,
            this
        );
        flick.init();
        this.flicks.push(flick);

        //创建英雄坦克对象
        this.oPlay = new MyTank(this.oParent, {
                name: DIV,
                className: PLAY,
                id: PLAY
            },
            MY_INIT_LOCAL[0][0],
            MY_INIT_LOCAL[0][1],
            MY_ONE_BGPOS,
            PLAY_SPEED,
            UP,
            TYPE_PLAY,
            PLAY_BLOOD,
            SHOOT_INTERVAL,
            PLAY,
            this
        );

        this.tanks.push(this.oPlay);
        this.oPlay.init();//初始化坦克位置
    }
};

/**
 * 更新玩家二  创建坦克二
 */
Game.prototype.updatePlayerTwo = function () {

    if (!this.isHavePlayer2() && (this.player2LifeCnt >= this.player2DieCnt)) {

        var flick = new Flick(this.oParent,
            {name: DIV, className: PLAY_IMG},
            MY_INIT_LOCAL[1][0],
            MY_INIT_LOCAL[1][1],
            MY_IMG_BGPOS,
            false,
            PLAY2,
            PLAY2,
            this
        );
        flick.init();
        this.flicks.push(flick);

        //创建英雄坦克对象
        this.oPlay2 = new MyTank(this.oParent, {
                name: DIV,
                className: PLAY2,
                id: PLAY2
            },
            MY_INIT_LOCAL[1][0],
            MY_INIT_LOCAL[1][1],
            MY_TWO_BGPOS,
            PLAY_SPEED,
            UP,
            TYPE_PLAY,
            PLAY_BLOOD,
            SHOOT_INTERVAL,
            PLAY2,
            this
        );

        this.tanks.push(this.oPlay2);
        this.oPlay2.init();//初始化坦克位置
    }
}


/**
 * 更新玩家的生命值
 */
Game.prototype.updatePlayersLifeNum = function (playerName, type) {

    if (playerName == PLAY) {
        if (type == ADD) {
            this.playerLifeCnt++;
        } else if (type == SUB) {
            this.playerDieCnt++;
        }
        var nowLife = this.playerLifeCnt - this.playerDieCnt;

    } else if (playerName == PLAY2) {

        if (type == ADD) {
            this.player2LifeCnt++;
        } else if (type == SUB) {
            this.player2DieCnt++;
        }
        var nowLife = this.player2LifeCnt - this.player2DieCnt;
    }

    var oPlayLife = $(playerName + LIFE_NUM);

    nowLife = nowLife < 0 ? 0 : nowLife;

    if (nowLife <= 9) {
        oPlayLife.style.backgroundPosition =
            NUM_BGPOS[nowLife][0] + PX + ' ' + NUM_BGPOS[nowLife][1] + PX;
    } else {
        oPlayLife.style.backgroundPosition =
            NUM_BGPOS[9][0] + PX + ' ' + NUM_BGPOS[9][1] + PX;
    }

    if (this.playerLifeCnt - this.playerDieCnt < 0 && this.player2LifeCnt - this.player2DieCnt < 0) {
        this.isOver = true;
    }
}
/**
 * 键盘按下
 */
Game.prototype.keyDown = function () {
    var This = this;
    document.getElementsByTagName('body')[0].onkeydown = function (event) {
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        This.key[event.keyCode] = true;
    };
};

/**
 * 键盘抬起
 */
Game.prototype.keyUp = function () {

    var This = this;
    document.getElementsByTagName('body')[0].onkeyup = function (event) {
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        This.key[event.keyCode] = false;
    };
};
/**
 * 控制玩家
 */
Game.prototype.ctrlPlayers = function () {

    //键盘点击
    this.keyDown();
    this.keyUp();
    if (this.players == 1) {
        this.ctrlPlayerOne();
    } else if (this.players == 2) {
        this.ctrlPlayerOne();
        this.ctrlPlayerTwo();
    }
};

/**
 * 玩家一控制
 */
Game.prototype.ctrlPlayerOne = function () {

    if (this.key[P_K_LEFT]) {
        this.oPlay.move(LEFT);
    } else if (this.key[P_K_RIGHT]) {
        this.oPlay.move(RIGHT);
    } else if (this.key[P_K_UP]) {
        this.oPlay.move(UP);
    } else if (this.key[P_K_DOWN]) {
        this.oPlay.move(DOWN);
    }

    if (this.key[P_K_J]) {
        this.oPlay.shoot();
    }
};

/**
 * 玩家二控制
 */
Game.prototype.ctrlPlayerTwo = function () {

    if (this.key[P__K_LEFT]) {
        this.oPlay2.move(LEFT);
    } else if (this.key[P__K_RIGHT]) {
        this.oPlay2.move(RIGHT);
    } else if (this.key[P__K_UP]) {
        this.oPlay2.move(UP);
    } else if (this.key[P__K_DOWN]) {
        this.oPlay2.move(DOWN);
    }

    if (this.key[P__K_SPACE]) {
        this.oPlay2.shoot();
    }
};


/**
 * 更新整个游戏中的子弹对象
 */
Game.prototype.updateBullets = function () {

    for (var i = 0; i < this.bullets.length; i++) {
        var oIair = $(LAIR);

        if (this.bullets[i].collide(oIair)) {
            oIair.style.backgroundPosition = '-288px 0';
            this.isOver = true;
        }
        this.bullets[i].move(this.bullets[i].dir);
    }
}

/**
 * 更新整个游戏中的所有爆炸对象
 */
Game.prototype.updateBombs = function () {

    for (var i = 0; i < this.bomb.length; i++) {
        this.bomb[i].changeBgPos();
    }
};

/**
 * 更新整个游戏中的所有坦克
 */
Game.prototype.updateTanks = function () {

    for (var i = 0; i < this.tanks.length; i++) {
        this.tanks[i].updateShoot();//更新射击
        this.tanks[i].moveFree();//自由移动
        this.tanks[i].isHited();//是否被击中
    }
};

/**
 * 更新整个游戏中的所有闪烁对象
 */
Game.prototype.updateFlicks = function () {

    for (var i = 0; i < this.flicks.length; i++) {
        this.flicks[i].show();
    }
};


/**
 * 更新整个游戏中的道具对象
 */
Game.prototype.updateProps = function () {

    for (var i = 0; i < this.props.length; i++) {
        if (this.props[i].isHited() || this.props[i].timeOut()) {
            this.props.splice(i, 1);
            i--;
        }
    }
};

/**
 * 更新暂停
 */
Game.prototype.updatePAUSE = function () {
    if (this.isPause) {
        this.pauseTiming++;

        if (this.pauseTiming > this.pauseTime) {
            for (var i = 0; i < this.tanks.length; i++) {
                this.tanks[i].stop = false;
            }
            this.isPause = false;
            this.pauseTiming = 0;
        }
    }

};

/**
 * 更新老巢是否被铁包围
 */
Game.prototype.uodateShovel = function () {

    if (this.isShovel) {
        this.shovelTiming++;

        if (this.shovelTiming > this.shovelTime) {

            for (var i = 0; i < this.maps.obstacle.length; i++) {
                if (this.maps.obstacle[i].material == 7) {

                    this.oParent.removeChild(this.maps.obstacle[i]);
                    var oWall = this.maps.createElem(DIV, WALL);
                    oWall.style.position = POSITION;
                    oWall.material = 7;//用以分辨类型
                    oWall.style.left = this.maps.obstacle[i].style.left;
                    oWall.style.top = this.maps.obstacle[i].style.top;

                    this.maps.obstacle[i] = oWall;
                    this.oParent.appendChild(oWall);
                }

            }
            this.shovelTiming = 0;
            this.isShovel = false;
        } else {
            //时间快到了时候  墙和铁（石头)  交替闪烁用以提醒
            if (this.shovelTime - this.shovelTiming < 100) {

                if((this.shovelTime - this.shovelTiming) % 4 == 0){
                    this.shovelFlag = !this.shovelFlag;
                }

                if (this.shovelFlag) {

                    for (var i = 0; i < this.maps.obstacle.length; i++) {
                        if (this.maps.obstacle[i].material == 7) {
                            this.oParent.removeChild(this.maps.obstacle[i]);
                            this.maps.obstacle.splice(i,1);
                            i--;
                        }
                    }

                    for(var i = 0;i < this.maps.lairEnclosure.length; i++){
                        var oIron = this.maps.createElem(DIV, IRON);
                        oIron.style.position = POSITION;
                        oIron.material = 7;//用以分辨类型
                        oIron.style.left = this.maps.lairEnclosure[i].style.left;
                        oIron.style.top = this.maps.lairEnclosure[i].style.top;

                        this.maps.obstacle.push(oIron);
                        this.oParent.appendChild(oIron);
                    }
                } else {
                    for (var i = 0; i < this.maps.obstacle.length; i++) {
                        if (this.maps.obstacle[i].material == 7) {
                            this.oParent.removeChild(this.maps.obstacle[i]);
                            this.maps.obstacle.splice(i,1);
                            i--;
                        }
                    }

                    for(var i = 0;i < this.maps.lairEnclosure.length; i++){
                        var oWall = this.maps.createElem(DIV, WALL);
                        oWall.style.position = POSITION;
                        oWall.material = 7;//用以分辨类型
                        oWall.style.left = this.maps.lairEnclosure[i].style.left;
                        oWall.style.top = this.maps.lairEnclosure[i].style.top;

                        this.maps.obstacle.push(oWall);
                        this.oParent.appendChild(oWall);
                    }
                }
            }
        }
    }
};

/**
 * 更新游戏中的所有元素
 */
Game.prototype.updateGame = function () {
    this.ctrlPlayers();//玩家控制
    this.updateBullets(); //更新游戏中的所有子弹对象的位置
    this.updateBombs();   //更新游戏中的所有爆炸对象
    this.updateTanks();   //更新游戏中的所有坦克
    this.updateFlicks();  //更新游戏中的所有闪烁对象
    this.updateProps();   //更新游戏中的所有道具对象

    this.updatePAUSE();   //更新暂停
    this.uodateShovel();  //更新老巢是否被铁包围

    this.initPlayers();   //英雄坦克是否需要复活

    this.enemyShowTiming++;      //敌方坦克是否需要进入战场
    if (this.enemyShowTiming > this.enemyShowInterval) {
        this.initEnemy();
        this.enemyShowTiming = -50;
    }

    this.nextLevel();         //是否进入下一关

    if (this.isOver) {        //游戏是否结束
        clearInterval(this.time);
        this.gameOver();
    }
};

/**
 * 清除本关涉及到的对象
 */
Game.prototype.clearAllObj = function () {

    this.tanks.length = 0;
    this.bullets.length = 0;
    this.bomb.length = 0;
    this.flicks.length = 0;
    this.props.length = 0;
    this.maps = null;
};

/**
 * 游戏是否进入下一关
 */
Game.prototype.nextLevel = function () {
    if (this.enemyDieCnt >= ENEMY_LIFE) {

        clearInterval(this.time);

        this.clearAllObj();

        this.enemyDieCnt = 0;
        this.localNum = 0;
        this.level++;
        this.oParent.innerHTML = '<div id="gameLevel">第&nbsp;&nbsp;<span>一</span>&nbsp;&nbsp;关</div>';
        this.oRight.innerHTML = '';
        this.startGame();
    }
};

/**
 * 游戏结束
 */
Game.prototype.gameOver = function () {

    document.onkeydown = null;
    var over = this.createElem(DIV, OVER);
    this.oParent.appendChild(over);
    startMoveTime(over, {top: 176}, 2000, 'linear');
};

/**
 * 封装创建元素
 * @param{sElem} 创建元素的tag名
 * @param{sClass} 创建元素的class名
 * @param{sId} 创建元素的id名
 * return{oElem} 返回创建的对象
 */
Game.prototype.createElem = function (sElem, sClass, sId) { // 封装创建元素
    var oElem = document.createElement(sElem);
    if (sClass) {
        oElem.className = sClass;
    }
    if (sId) {
        oElem.id = sId;
    }
    return oElem;
}