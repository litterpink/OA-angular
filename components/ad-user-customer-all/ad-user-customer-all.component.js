/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 我的客户
 */
angular.module('byComponent').component('adUserCustomerAll', {
    templateUrl: '../components/ad-user-customer-all/ad-user-customer-all.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', '$http','queryData', '$state', function ($rootScope, $scope, $stateParams, $http,queryData, $state) {
        if($stateParams.id > 0) {
            return;
        }
        //获取登陆者信息
        var userInfo = getUserInfo();
        var userType = userInfo.type;
        var user_id = userInfo.user_id;
        //控制sales端 和 admin端 客户和渠道收藏按钮的显示和隐藏
        if(userType == 90){
            $scope.collectionButton = false;
        }else {
            $scope.collectionButton = false;
        };
        /**
         * 获取当前父路由的href, 跳转到下一个详情页面的规则是 父路由href + id + info
         * 如: 当前href是 user/customer/all 那么点击跳转的详情页是 user/customer/100/info
         */
        $scope.parentHref = $state.href($state.$current.parent.parent);

        // 加载省份
        city($scope, $http);
        
        var provinceMap = sessionStorage.getItem('provinceMap');

        //初始化城市信息
        $scope.province = provinceMap;

        var params = {
            uid: user_id,
            province: provinceMap
        };
        //点击分页
        $scope.pageChanged = function (page,name,province) {
            var params = {
                uid: user_id,

                page: page,
                name: name,
                province: province
            };
            queryData.getData('User_client/clients',params).then(function (data) {
                console.log(data);
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
        //输入姓名查找  ---->获取页面数据也在这里
        $scope.$watch('name', function () {
            var params = {
                uid: user_id,
                name: $scope.name,
                province: $scope.province
            };
            console.log(params);
            queryData.getData('User_client/clients',params).then(function (data) {
                sessionStorage.removeItem("provinceMap");
                console.log(data);
                if(data.status == true){
                    $scope.infos = data.data.data;

                    $scope.maxItems = data.data.maxRows;
                    $scope.maxPage = data.data.maxPage;

                    // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
                    $scope.maxSize = 5; // 显示最大页数
                    $scope.bigTotalItems = $scope.maxItems;
                    $scope.bigCurrentPage = 1;
                }else {
                    alert(data.message);
                }
            });
        });
        //切换省份搜索
        $scope.provinceChange = function (name,province) {
            var params = {
                uid: user_id,

                name: name,
                province: province,
            };
            consoleLog(params);
            queryData.getData('User_client/clients',params).then(function (data) {
                console.log(data);
                if(data.status == true){
                    $scope.infos = data.data.data;

                    $scope.maxItems = data.data.maxRows;
                    $scope.maxPage = data.data.maxPage;

                    // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
                    $scope.maxSize = 5; // 显示最大页数
                    $scope.bigTotalItems = $scope.maxItems;
                    $scope.bigCurrentPage = 1;
                }else {
                    alert(data.message);
                }
            });

        }


    }]
});
