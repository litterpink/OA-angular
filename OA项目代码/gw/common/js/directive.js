/* 自定义指令(输入法院模糊查找) */
myapp.directive('selectCourt', function ($http, $timeout, queryData) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on("keyup", function () {
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
            })
        }
    }
});
/* 自定义获取年份的指令 */
myapp.directive("getYear", function ($http) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.on("click", function () {
                $http.get("common/json/year.json").success(function (data) {
                    scope.yearList = data;
                });
            })
        }
    }
});

/* 自定义获取出生年份的指令 */
myapp.directive("getBirthYear", function ($http) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $http.get("common/json/birthYear.json").success(function (data) {
                scope.birthYearList = data;
            })
        }
    }
});

/* 自定义手机验证的指令 */
myapp.directive("checkPhone", function ($http, queryData) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.on("change", function () {
                queryData.getData("User_lawyer/check_phone", {phone: element.val()}).then(function (data) {
                    scope.message = data;
                    consoleLog(element.val());
                    consoleLog(data);
                    if (data.status == true) {
                        scope.angularShowInfo = true;
                        scope.phoneMessage = "";
                    }
                    else {
                        scope.phoneMessage = data.message;
                        scope.angularShowInfo = false;
                        return false;
                    }
                });
            })
        }
    }
});

myapp.directive('ngFocus', [function() {
    var FOCUS_CLASS = "ng-focused";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function() {ctrl.$focused = true;});
            }).bind('blur', function(evt) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function() {ctrl.$focused = false;});
            });
        }
    }
}]);