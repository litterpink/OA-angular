/* ui-route 路由器, 文件上传依赖 ngFileUpload
 *
 *  使用说明:
 *  get 方法
 *  接口: api
 *  参数: params 对象
 *  queryData.getData("api", params).then(function(data) {
 *       console.log(data);
 *  }
 *
 *  p  ost请求同理
 *
 */
angular.module("mix.service", ["ngDialog"])
    .factory("queryData", function ($http, $q, ngDialog) {
        //显示错误信息
        function showErrorMessageDialog(message) {
            var dialog = ngDialog.open({
                template: '<p class="text-center" style="margin-top: 10px">' + message + '</p>',
                plain: true
            });
            //自动关闭
            setTimeout(function () {
                dialog.close()
            }, 2000);
        }
        var resultData = {};
        /**
         * get方法获取数据
         * @param urlParams url参数
         * @param params 业务参数
         * @param state 是否缓存, true缓存, false不缓存
         * @param ignoreLoadingBar 是否忽略加载的loadingBar
         * @param ignoreToast 当请求返回状态码为false时,是否忽略toast提醒
         * @returns {Promise}
         */
        resultData.getData = function (urlParams, params, state, ignoreLoadingBar, ignoreToast) {
            var deferred = $q.defer();
            /* get方法获取数据 */
            $http.get(ServerURL + urlParams, {params: params, ignoreLoadingBar: ignoreLoadingBar}, {cache: state}).success(function (data) {
                if(data.status) {
                    deferred.resolve(data);
                }
                else {
                    deferred.reject(data);
                    if(!ignoreToast) {
                        //显示错误信息
                        showErrorMessageDialog(data.message);
                    }
                }
            }).error(function (data, status) {
                deferred.reject(data);
                if (status == 401 || status == -1) {
                    window.location.href = "../gw/login.html"
                }else if(status == 500){
                    alert("服务器错误,请联系管理员");
                }
                else {
                    alert(status + " 错误, 请联系管理员");
                }
                return false;
            });
            return deferred.promise;
        };
        /* post方法获取数据 */
        resultData.postData = function (urlParams, data) {
            var deferred = $q.defer();
            /* post方法获取数据 */
            $http.post(ServerURL + urlParams, data).success(function (data) {
                if(data.status) {
                    deferred.resolve(data);
                }
                else {
                    deferred.reject(data);
                    //显示错误信息
                    showErrorMessageDialog(data.message);
                }
            }).error(function (data, status) {
                deferred.reject(data);
                if (status == 401 || status == -1) {
                    window.location.href = "../gw/login.html"
                }else if(status == 500){
                    alert("服务器错误,请联系管理员");
                }
                else {
                    alert(status + " 错误, 请联系管理员");
                }
                return false;
            });
            return deferred.promise;
        };
        /* put方法获取数据 */
        resultData.putData = function (urlParams, data) {
            var deferred = $q.defer();
            /* put方法获取数据 */
            $http.put(ServerURL + urlParams, data).success(function (data) {
                if(data.status) {
                    deferred.resolve(data);
                }
                else {
                    deferred.reject(data);
                    //显示错误信息
                    showErrorMessageDialog(data.message);
                }
            }).error(function (data, status) {
                deferred.reject(data);
                if (status == 401 || status == -1) {
                    window.location.href = "../gw/login.html"
                }
                else if(status == 500){
                    alert("服务器错误,请联系管理员");
                }
                else {
                    alert(status + " 错误, 请联系管理员");
                }
                return false;
            });
            return deferred.promise;
        };
        return resultData;
    });
    

