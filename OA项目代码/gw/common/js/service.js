var myapp = angular.module("myapp", ["ngFileUpload", "angular-md5", "ngDialog","w5c.validator","angularTrix"], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
/* 创建获取数据的服务factory模式, $q, deferd, resolve, reject, then使用 开始 */
myapp.factory("queryData", function ($http, $q, ngDialog) {
    var resultData = {};
    /* get方法获取数据 */
    resultData.getData = function (urlParams, params, state) {
        var deferred = $q.defer();
        /* get方法获取数据 */
        $http.get(ServerURL + urlParams, {params: params}, {cache: state}).success(function (data) {
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(data);
            if(status == 401 || status == -1) {
                toast.show('您的登录信息已经过期，请重新登录。',2000,function () {
                    window.location.href = "login.html";
                });
            }
            else {
                alert(status + " 错误");
            }
            return false;
        });
        return deferred.promise;
    };
    /* post方法获取数据 */
    resultData.postData = function (urlParams, data,toast) {
        var deferred = $q.defer();
        /* post方法获取数据 */
        $http.post(ServerURL + urlParams, data).success(function (data) {
            //console.log(data);
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(data);
            if(status == 401 || status == -1) {
                toast.show('您的登录信息已经过期，请重新登录。',2000,function () {
                    window.location.href = "login.html";
                })
            }
            else {
                alert(status + " 错误");
            }
            return false;
        });
        return deferred.promise;
    };
        return resultData;
    })
    //吐丝
    .factory("toast", function (ngDialog) {
        return {
            /**
             * 吐丝
             * @param message 消息
             * @param completed 完成回调
             */
            show: function (message, duration, completed) {
                if(duration == undefined) {
                    duration = 1000;
                }
                //toast
                var dialog = ngDialog.open({
                    template: '<p class="text-center" style="margin-top: 10px">' + message + '</p>',
                    plain: true
                });
                //自动关闭
                setTimeout(function () {
                    dialog.close();
                    if (completed == undefined) {
                        return;
                    }
                    completed();
                }, duration);
            }
        }
    })
    /* 创建获取数据的服务 结束 */
    // 省市联动服务
    .factory("provinceCity", function (queryData, $http, $q) {
        var provinceCity = {};
        provinceCity.province = function () {
            var defered = $q.defer();
            $http.get("../common/json/city.json", {
                ignoreLoadingBar: true
            }).success(function (data) {
                defered.resolve(data);
            }).error(function (data) {
                defered.reject(data);
            });
            return defered.promise;
        };
        return provinceCity;
    });