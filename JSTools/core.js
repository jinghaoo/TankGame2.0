/**
 * 常用工具核心类
 * createTime ：19:30  2016/8/30
 *
 * by:jh
 *
 */
//根据id获取元素对象
function $(id) {
    return document.getElementById(id);
}
//获取当前时间
function nowTime() {
    return (new Date()).getTime();
}
//获取样式
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    return getComputedStyle(obj, null)[attr];
}

//根据运动的类型 返回每次要运动到的距离
/**
 * t:花费的时间占了总时间的多少
 * b:运动属性的初始值
 * c:要运动的距离   目标值-初始值
 * d:运动时间
 * return：这次要运动到的距离
 */
var Tween = {
    linear: function (t, b, c, d) {  //匀速
        return c * t / d + b;
    },
    easeIn: function (t, b, c, d) {  //慢到快
        return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) {  //快到慢
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function (t, b, c, d) {  //慢快慢
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2 ) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) {
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function (t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}

/**
 * 指定的时间内运动
 * obj：运动对象
 * json：要进行的运动属性以及目标值键值对
 * times：运动的时间
 * fx：运动的形式
 * fn：回调函数
 */
function startMoveTime(obj, json, times, fx, fn) {

    var iCur = {};//存储在运动初时的属性值

//对参数进行容错操作  如果只传了两个参数，设置times和fx的默认值
    if (typeof times == 'undefined') {
        times = 400;
        fx = 'linear';
    }
//对参数进行容错操作  如果没有传times，而传了fx和fn时，调节参数位置 设置默认值
    if (typeof times == 'string') {
        if (typeof fx == 'function') {
            fn = fx;
        }
        fx = times;
        times = 400;
    }
    else if (typeof times == 'function') {
        fn = times;
        times = 400;
        fx = 'linear';
    }
    else if (typeof times == 'number') {
        if (typeof fx == 'function') {
            fn = fx;
            fx = 'linear';
        }
        else if (typeof fx == 'undefined') {
            fx = 'linear';
        }
    }

    //获取并记录运动开始时的时间
    var startTime = nowTime();

    //获取并记录运动开始时 运动对象要运动的属性的初始值
    for (var attr in json) {
        iCur[attr] = 0;

        if (attr == 'opacity') {
            iCur[attr] = Math.round(getStyle(obj, attr) * 100);
        }
        else {
            iCur[attr] = parseInt(getStyle(obj, attr));
        }

    }

    //清除同一运动对象的其他计时器
    clearInterval(obj.timer);
    //定义计时器
    obj.timer = setInterval(function () {

        var changeTime = nowTime(); //计时器运行时的时间

        var scale = 1 - Math.max(0, startTime + times - changeTime) / times;
        //第一次：1- (0 +2000 -13)/2000= 13/2000
        //第二次  1- (0 +2000 -26)/2000= 26/2000
        //第三次  1- (0 +2000 -39)/2000= 39/2000
        //其实就是保存已经花费的时间占了总时间的多少

        for (var attr in json) {

            var value = Tween[fx](scale * times, iCur[attr], json[attr] - iCur[attr], times);

            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity=' + value + ')';
                obj.style.opacity = value / 100;
            }
            else {
                obj.style[attr] = value + 'px';
            }
        }
        if (scale == 1) {//如果花费的时间为0了
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    }, 13);
}

/**
 * 随机产生id
 * @param len
 * @returns {string}
 */
function randomId(len) {
    len = len||32;
    var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
    var  tmp="";
    var timestamp = nowTime();
    for(var  i=0;i<  len;i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }

    return  timestamp+tmp;
}