/**
 * Created by beyondwin on 16/9/28.
 */
/* 自定义指令(输入法院模糊查找) */
angular.module("mix.directive", [])
    .directive('selectCourt', function ($http, $timeout, queryData) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.errorInfo = false;
                element.on("keyup", function () {
                    queryData.getData("Court/court_search", {name: encodeURI(element.val())}, true, true).then(function (data) {
                        if (data.status == true) {
                            scope.searchData = data.data;
                            if(data.data.length != 0){
                                scope.errorInfo = true;
                                sessionStorage.setItem("province",data.data[0].province);
                            }else {
                                scope.errorInfo = false;
                            }
                        }
                        console.log(data);
                    });
                });

                /*element.on("blur", function () {
                    console.log(element.val());
                    queryData.getData("Court/court_search", {name: encodeURI(element.val())}, true, true).then(function (data) {
                        if (data.status == true) {
                            scope.searchData = data.data;
                            if(data.data.length != 0){
                                sessionStorage.setItem("province",data.data[0].province);
                            }
                            else {
                                scope.errorInfo = "没有查找到法院,请重新输入";
                                scope.searchData = "";
                                element.context.value = '';
                            }
                        }
                        console.log(data);
                    });
                })*/
            }
        }
    })
    /* 自定义获取年份的指令 */
    .directive("getYear", function ($http) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $http.get("../common/json/year.json").success(function (data) {
                    scope.yearList = data;
                });
            }
        }
    })

    /* 自定义获取出生年份的指令 */
    .directive("getBirthYear", function ($http) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $http.get("../common/json/birthYear.json").success(function (data) {
                    scope.birthYearList = data;
                })
            }
        }
    })
    /* 自定义手机验证的指令 */
    .directive("checkPhone", function ($http, queryData) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                console.log(element);
                element.on("change", function () {
                    queryData.getData("User/check_phone", {phone: element.val()}).then(function (data) {
                        scope.message = data;
                        if (data.status == false) {
                            scope.phoneMessage = data.message;
                            scope.phone = "";
                            return false;
                        }
                        else {
                            scope.phoneMessage = data.message;
                        }
                    });
                })
            }
        }
    })

    /* 封装jquery进度百分比的插件指令 */
    .directive("radialDirective", function () {
        return {
            restrict: 'EA',
            scope: {},
            //template: '<div class="prg-cont rad-prg" id="indicatorContainer"></div>',
            link: function (scope, element, attrs) {
                var num = attrs.id * 3.6;
                if (num <= 180) {
                    element.parent().parent().find('.right_circle').css('transform', "rotate(" + num + "deg)");
                }
                else {
                    element.parent().parent().find('.right_circle').css('transform', "rotate(180deg)");
                    element.parent().parent().find('.left_circle').css('transform', "rotate(" + (num - 180) + "deg)");
                }
            }
        }
    })
    /* 单击收藏, 单击取消收藏 指令 */
    .directive("cancelcollectionOrCollection", function ($state,$location, queryData) {
        return {
            restrict: "AE",
            link: function (scope, element, attrs) {
                // 基本信息中后台返回一个,是否收藏的参数,判断星星的颜色,然后根据参数判断是收藏还是取消收藏.

                element.on("click", function () {
                    //改变五角星颜色
                    if (element.attr("class") == "fa fa-star-o") {
                        element.attr("class", "fa fa-star").css("color", "#ffb70a");
                    }
                    else {
                        element.attr("class", "fa fa-star-o").css("color", "#333");
                    };
                    if (attrs.collection == 0) {
                        var data = {
                            collector_id: JSON.parse(sessionStorage.getItem("userInfo")).user_id,
                            collected_id: attrs.id,
                            type: attrs.accordion
                        };
                        queryData.postData("collection/collection", data).then(function (data) {
                            $state.reload($state.current.name);
                        });
                    }
                    else {
                        data = {
                            collector_id: JSON.parse(sessionStorage.getItem("userInfo")).user_id,
                            collected_id: attrs.id
                        };
                        queryData.getData("collection/collection_delete", data).then(function (data) {
                            $state.reload($state.current.name);
                        });
                    }
                });

            }
        }
    })
    /*/!*改变admin-user的颜色*!/
    //手风琴菜单选择指令
    .directive("accordionMenuSelect", function () {
        return {
            restrict: "AEC",
            link: function (scope, element, attrs) {
                //初始化以前颜色
                var menuSelectIndex = sessionStorage.getItem('accordionMenuSelectIndex');
                if(menuSelectIndex != undefined) {
                    var elementIndex = element.parent().parent().find('div').index(element);
                    if(elementIndex == menuSelectIndex) {
                        element.children().addClass("text-primary");
                    }
                }
                element.on("click", function () {
                    element.children().addClass("text-primary");
                    element.parent().siblings().children().find("a").removeClass("text-primary");
                    menuSelectIndex = element.parent().parent().find('div').index(element);
                    sessionStorage.setItem('accordionMenuSelectIndex', menuSelectIndex);
                })
            }
        }
    })
    //手风琴子菜单选择指令
    .directive("accordionSubMenuSelect", function () {
        return {
            restrict: "AEC",
            link: function (scope, element, attrs) {
                //初始化以前颜色
                var menuSelectedIndex = sessionStorage.getItem('accordionMenuSelectIndex');
                var subMenuSelectedIndex = sessionStorage.getItem('accordionSubMenuSelectIndex');
                if(menuSelectedIndex != undefined && subMenuSelectedIndex != undefined) {
                    //获取父元素的索引位置
                    var divElement = element.parent().parent().parent().find("div").eq(0);
                    var menuIndex = element.parent().parent().parent().parent().find("div").index(divElement);
                    //获取子元素索引位置
                    var subMenuIndex = element.parent().parent().find('a').index(element);
                    if(menuSelectedIndex == menuIndex && subMenuIndex == subMenuSelectedIndex) {
                        element.addClass("text-primary");
                        element.parent().parent().parent().find("div").find("a").addClass("text-primary");
                    }
                }
                element.on("click", function () {
                    var e2 = element.parent().parent().parent();
                    element.parent().parent().parent().parent().find("a").removeClass("text-primary");
                    element.parent().parent().parent().parent().find("div").removeClass("text-primary");
                    element.addClass("text-primary");
                    element.parent().parent().parent().find("div").find("a").addClass("text-primary");

                    //获取子菜单选择的索引并存储
                    subMenuSelectedIndex = element.parent().parent().find('a').index(element);
                    sessionStorage.setItem('accordionSubMenuSelectIndex', subMenuSelectedIndex);
                    //获取父菜单的索引并存储
                    var divElement = element.parent().parent().parent().find("div").eq(0);
                    menuSelectedIndex = element.parent().parent().parent().parent().find("div").index(divElement);
                    sessionStorage.setItem('accordionMenuSelectIndex', menuSelectedIndex);
                })
            }
        }
    })*/
    .directive("clickChangeAll", function () {
        return {
            restrict: "AEC",
            link: function (scope, element, attrs) {
                element.on("click", function () {
                    element.addClass("text-primary");
                    element.parent().siblings().children().removeClass("text-primary");
                })
            }
        }
    })
    //菜单选择指令
    .directive("navSelectItem", function () {
        return {
            restrict: "AEC",
            link: function (scope, element, attrs) {
                //获取曾经选择的导航栏
                var selectedIndex = sessionStorage.getItem("navSelectedItemIndex");
                if(selectedIndex == undefined) {
                    selectedIndex = 0;
                }
                //查看当前元素的索引
                element.parent().parent().find("a").eq(selectedIndex).addClass("navSelected");
                element.on("click", function () {
                    var allAElement = element.parent().parent().find("a");
                    allAElement.removeClass("navSelected");
                    element.addClass("navSelected");
                    //获取位置, 存储索引
                    selectedIndex = allAElement.index(element);
                    sessionStorage.setItem("navSelectedItemIndex", selectedIndex);
                });
            }
        }
    })
    .directive('alwaysChecked', function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.on("click", function() {
                    if(element.prop("checked") == true) {
                        element.prop("checked", true);
                    }
                    else {
                        element.prop("checked", true);
                    }
                })
            }
        }
    })
    //富文本编辑器字数限制 可在标签内改变字数长度
    .directive('countNum', function (toast) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var maxNum = attrs.countNum;
                attrs.title = attrs.placeholder;
               /* (element.parent().children())[2].title = attrs.placeholder;*/
                if(maxNum == '' || maxNum == undefined){
                    maxNum = 1000;
                }
                element.on("keyup", function() {
                    console.log((element.parent().children())[2]);
                    var ele = element.context.innerText.length;
                    if(ele > 1000){
                        element.context.innerText = element.context.innerText.substring(0,maxNum);
                        toast.show('超出限制长度', maxNum);
                    }
                });
            }
        }
    })
    //手机号限制11位
    .directive('phoneLimit', function (queryData) {
        return {
            restrict: "A",
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element, attrs, ctrl) {
                // console.log(element)
                //添加一个错误提示元素
                function appendErrorTip() {
                    var msg = "<span class='error-tip'></span>";
                    $(element).after(msg);
                }

                //输入限制
                function inputLimit() {
                    var value = String(element.context.value);
                    //截取到哪一个字符位置
                    var findIndex = -1;
                    for(var i = 0; i < value.length; i++) {
                        if(value[i] < '0' || value[i] > '9') {
                            findIndex = i;
                            break;
                        }
                        if(i >= 11) {
                            findIndex = i;
                            break;
                        }
                    }

                    //查找到了, 则截取
                    if(findIndex != -1) {
                        element.context.value = value.substr(0, findIndex);
                        scope.model = element.context.value;
                    }
                }
                
                //绑定输入事件
                element.on('input', inputLimit);
                //绑定输入事件, IE专属
                element.on('propertychange', inputLimit);
                //添加错误提示元素
                appendErrorTip();


                element.on("blur", function () {
                    queryData.getData("User/check_phone", {phone: element.val()}, false, true, true).then(function (data) {
                        $(element).next().html("");
                    }, function (data) {
                        //验证失败, 在当前元素后面加上错误提示
                        element.addClass("error");
                        //给错误元素赋值
                        $(element).next().html(data.message);

                    });
                })
            }
        }
    })
    .directive('cachePage', function ($state) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                console.log($state);
                scope.$watch('currentPage', function (value) {
                    console.log(value);
                });
            }
        }
    });
 