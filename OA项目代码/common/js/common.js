// 服务器接口地址
//const ServerURL = "http://www.beyondwinlaw.com/api/mix_api/index.php/"; //线上
// const ServerURL = "http://www.beyondwinlaw.com/api/test/mix_api/index.php/"; //线上测试环境
 const ServerURL = "http://localhost/mix_api/index.php/"; //本地

//七牛的地址
const QiNiuURL = "http://o7gu49l3u.bkt.clouddn.com/"; //dev
// const QiNiuURL = "http://7xsxof.com1.z0.glb.clouddn.com/"; //线上

//官网web的baseURL
const WebBaseURL = "http://www.beyondwinlaw.com/test/mix/"; //线上测试环境
// const WebBaseURL = "http://www.beyondwinlaw.com/mix/";

// //阻止所有console.log
// if(window.console){
//     window.console = {log : function(){}};
// }

// 1. 判断是否登录
function checkLogin(userId) {
    // 如果没有登录直接访问界面,就跳转到登录界面
    if (userId == null || userId == undefined || userId == "") {
        alert("登陆过期, 单击确定跳转到登陆界面");
        window.location.href = "../index.html";
    }
}
// 2. 修改密码
function editPass($scope, md5, queryData) {
    $scope.old_pass = "";
    $scope.new_pass = "";
    $scope.second_new_pass = "";
    $scope.editPass = function () {
        var data = {uid: uid, old_pass: md5.createHash($scope.old_pass), new_pass: md5.createHash($scope.new_pass)};
        if ($scope.new_pass != $scope.second_new_pass) {
            alert("两次输入密码不一致");
        }
        else {
            queryData.postData("user/pass_update", data).then(function (data) {
                alert(data.message);
                console.log(data);
            });
        }
    };
}
//手风琴效果
function accordion() {
    $(function() {
        var Accordion = function(el, multiple) {
            this.el = el || {};
            this.multiple = multiple || false;

            // Variables privadas
            var links = this.el.find('.link');
            // Evento
            links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
        };

        Accordion.prototype.dropdown = function(e) {
            var $el = e.data.el;
            //仅仅赋值
            $this = $(this),
                //寻找下一个元素ul
                $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            //找到点击对应的索引
            var index = $this.parent().parent().children().find('div').index($this);
            sessionStorage.setItem('accordionSelectedOpenIndex', index);

            if (!e.data.multiple) {
                $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
            }
        };

        // var accordionEelement = $("#accordion");
        
        var accordionSelectedIndex = sessionStorage.getItem('accordionSelectedOpenIndex');
        if(accordionSelectedIndex == undefined) {
            accordionSelectedIndex = 0;
        }
        var accordion = new Accordion($('#accordion', false));
        var element = $("#accordion");
        var dropDownElement = element.children().eq(accordionSelectedIndex);
        dropDownElement.className = "open";
        if(accordionSelectedIndex != 0) {
            //操作元素
            dropDownElement.children().get(1).style.display = 'block';
        }
    });
}

// 3 城市联动
function city($scope, $http) {
    $http.get("../common/json/city.json").success(function (data) {
        $scope.provinceData = data;
    });
}

// 4. console.log()公用
function consoleLog(data) {
    console.log(data);
}

//5 获取年份
function getYear($scope, $http) {
    $http.get("../common/json/year.json").success(function (data) {
        $scope.yearList = data;
    });
}

//调整元素right的高度
function rightHeight() {
    // var bodyHeight = $('.mainContent').height();
    // $(".right").css("height", bodyHeight);

}

/**
 * 重新计算高度
 */
function resizeHeight() {
    consoleLog("重新计算高度");
    /**
     * 获取window的高度 左边高度 右边高度 主体高度
     */
    var windowHeight = $(window).height();
    var leftHeight = $(".left").height();
    var rightHeight = $(".right").height();
    var mainHeight = $(".mainContent").height();
    // consoleLog(windowHeight);
    // consoleLog(leftHeight);
    // consoleLog(rightHeight);
    // consoleLog("mainHeight: " + mainHeight);
    //比较出最大的高度
    // var maxHeight = windowHeight;
    // if(maxHeight < leftHeight) {
    //     maxHeight = leftHeight;
    // }
    // if(maxHeight < rightHeight) {
    //     maxHeight = rightHeight;
    // }
    // 将高度设置
    //$(".left").css("height", maxHeight);
    $(".right").css("height", mainHeight);
    //$(".mainContent").css("height", rightHeight);
}
resizeHeight();
$(window).resize(function(){
    resizeHeight();
});



/**
 * 获取用户信息
 */
function getUserInfo() {
    //获取用户信息
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    return userInfo;
}

/**
 * 配置angular-loading-bar
 */
function configuredLoadingBar(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 0;
    cfpLoadingBarProvider.spinnerTemplate = '<div></div>';
    // cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner" style="position: absolute; width: 100%; height: 100%; left: 0;top: 0; background: rgba(255, 255, 255, 0.6);">' +
    //     '<img style="position: relative; top: 47%; left: 47%; width: 6%" src="../common/images/loading.svg">' +
    //     '</div>';
}

/**
 * 时间字符串转成date格式
 * @param timeStr 时间字符串
 * @returns {Date}
 */
function timeStringToDate(timeStr) {
    if(timeStr == undefined || timeStr == "") {
        return null;
    }
    return new Date(Date.parse(timeStr.replace(/-/g, "/")));
}

/**
 * 文件后缀
 */
function getFileExtension(fileName) {
    var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    return fileExtension;
}

/**
 * 文件除去后缀的名称
 */
function getFilePrefixExceptExtension(fileName) {
    var filePrefix = fileName.substring(0, fileName.lastIndexOf('.'));
    return filePrefix;
}

/**
 * 获取当前本地时间, 格式为: 2016-06-09 10:11:23
 * @returns {string}
 */
function getLocalTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
}

/**
 * 隐藏模态,并且隐藏完之后回调
 * @param modalId 模态的id
 * @param callBack 回调
 */
function hideModal(modalId, callBack) {
    $('#' + modalId).on('hidden.bs.modal', function () {
        //回调
        if(callBack) {
            callBack();
        }
    });
    //隐藏模态
    $('#' + modalId).modal('hide');
}

/**
 * 保存对象的一些常量
 */
//保存客户信息的key
const SaveClientInfoKey = "SaveClientInfoKey";
//保存客户id的key值
const SaveNewProjectClientIdKey = "SaveNewProjectClientIdKey";
//保存创建项目时,选择客户来源类型的key: 0: 录入客户信息  1: 从数据库选择
const SaveNewProjectClientSourceTypeKey = "SaveNewProjectClientSourceTypeKey";

//保存渠道信息的key
const SaveMiddleInfoKey = "SaveMiddleInfoKey";
//保存渠道id的key值
const SaveNewProjectMiddleIdKey = "SaveNewProjectMiddleIdKey";
//保存创建项目时,选择客户来源类型的key: 0 录入渠道信息   1 从数据库选择   2 跳过
const SaveNewProjectMiddleSourceTypeKey = "SaveNewProjectMiddleSourceTypeKey";

//案件信息
const SaveCaseInfoKey = "SaveCaseInfoKey";

//选择的项目名称
const SelectProjectName = "SelectProjectName";
//选择的项目状态
const SelectProjectStatus = "CurrentProjectStatus";

/**
 * 将对象转成字符串,并保存在session当中
 */
function saveObjectToSessionStorage(key, object) {
    if(typeof(object) != 'object') {
        console.log('不是object对象');
        return;
    }
    sessionStorage.setItem(key, JSON.stringify(object));
}

/**
 * 获取session保存对象, 在内部进行json解析
 * @param key
 */
function getObjectFromSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

/**
 * 用户类型, 数字转字符串
 */
function userTypeStringFromNumber(type) {
    switch (parseInt(type)) {
        case 4:
            return '个人客户';
        case 5:
            return '机构客户';
        case 6:
            return '个人渠道';
        case 7:
            return '机构渠道';
        case 8:
            return '律师渠道';
    }
    return '';
}
/**
 * 项目获取line-height和是否显示 搁置原因
 */
function listHeight(showShelve,height,$scope) {
    $scope.showShelve = showShelve;
    $scope.checkLast = function($last){
        if($last){
            var listEle = $('.listHover');
            listEle.css({lineHeight: height});
        }
    };
}

/**
 * 性别中数字转字符串
 */
function sexStringFromNumber(type) {
    switch (parseInt(type)) {
        case 1: return "男";
        case 2: return "女";
        default: return "";
    }
}

/**
 * 客户级别来源
 */
function levelStringFromNumber(level) {
    switch (parseInt(level)) {
        case 1: return "普通客户";
        case 2: return "重点客户";
        case 3: return "核心客户";
        default: return "";
    }

}

//alert confirm窗口美化
(function($) {

    $.alerts = {
        alert: function( message, callback) {
            //if( title == null ) title = 'Alert';
            $.alerts._show(message, null, 'alert', function(result) {
                if( callback ) callback(result);
            });
        },

        confirm: function( message, callback) {
            //if( title == null ) title = 'Confirm';
            $.alerts._show( message, null, 'confirm', function(result) {
                if( callback ) callback(result);
            });
        },


        _show: function( msg, value, type, callback) {

            var _html = "";

            _html += '<div id="mb_box"></div><div id="mb_con"><h4 id="mb_tit">' + msg + '</h4><div id="mb_btnbox">';
            // _html += '<div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';
            if (type == "alert") {
                _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            }
            if (type == "confirm") {
                _html += '<input id="mb_btn_no" type="button" value="取消" />';
                _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            }
            _html += '</div></div>';

            //必须先将_html添加到body，再设置Css样式  
            $("body").append(_html); GenerateCss();

            switch( type ) {
                case 'alert':

                    $("#mb_btn_ok").click( function() {
                        $.alerts._hide();
                        callback(true);
                    });
                    $("#mb_btn_ok").focus().keypress( function(e) {
                        if( e.keyCode == 13 || e.keyCode == 27 ) $("#mb_btn_ok").trigger('click');
                    });
                    break;
                case 'confirm':

                    $("#mb_btn_ok").click( function() {
                        $.alerts._hide();
                        if( callback ) callback(true);
                    });
                    $("#mb_btn_no").click( function() {
                        $.alerts._hide();
                        if( callback ) callback(false);
                    });
                    $("#mb_btn_no").focus();
                    $("#mb_btn_ok, #mb_btn_no").keypress( function(e) {
                        if( e.keyCode == 13 ) $("#mb_btn_ok").trigger('click');
                        if( e.keyCode == 27 ) $("#mb_btn_no").trigger('click');
                    });
                    break;


            }
        },
        _hide: function() {
            $("#mb_box,#mb_con").remove();
        }
    };
    // Shortuct functions zdalert
    window.alert = function( message, callback) {
        $.alerts.alert( message, callback);
    };

    window.confirm = function( message, callback) {
        $.alerts.confirm( message, callback);
    };




    //生成Css  
    var GenerateCss = function () {

        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'
        });

        $("#mb_con").css({ zIndex: '999999', width: '50%', position: 'fixed',
            backgroundColor: 'White',
            borderRadius: '7px'
        });

        $("#mb_tit").css({ display: 'block', color: '#444', padding: '10px 15px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #ccc', fontWeight: 'bold',
            textAlign: 'left'
        });

        $("#mb_msg").css({ padding: '15px', lineHeight: '20px',
            borderBottom: '1px solid #ccc', fontSize: '16px',
            textAlign: 'left'
        });

        $("#mb_ico").css({ display: 'block', position: 'absolute', right: '10px', top: '9px',
            border: '1px solid Gray', width: '18px', height: '18px', textAlign: 'center',
            lineHeight: '16px', cursor: 'pointer', fontFamily: '微软雅黑'
        });

        $("#mb_btnbox").css({ margin: '15px 0 10px 0', textAlign: 'right' });
        $("#mb_btn_ok,#mb_btn_no").css({ width: '60px', height: '30px', color: 'white', border: 'none' });
        $("#mb_btn_ok").css({ backgroundColor: '#2673bf',marginRight: '20px' });
        $("#mb_btn_no").css({ backgroundColor: '#fff', color: 'black',marginRight: '10px',border: '1px solid #ccc'});


        //右上角关闭按钮hover样式  
        $("#mb_ico").hover(function () {
            $(this).css({ backgroundColor: 'Red', color: 'White' });
        }, function () {
            $(this).css({ backgroundColor: '#DDD', color: 'black' });
        });

        var _widht = document.documentElement.clientWidth; //屏幕宽  
        var _height = document.documentElement.clientHeight; //屏幕高  

        var boxWidth = $("#mb_con").width();
        var boxHeight = $("#mb_con").height();

        //让提示框居中  
        $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
    }


})(jQuery);



