/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 用户所有渠道
 */
angular.module('byComponent').component('adUserChannelAll', {
    templateUrl: '../components/ad-user-channel-all/ad-user-channel-all.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity','queryData','$http', '$state', function ($rootScope, $scope, $stateParams, provinceCity,queryData,$http, $state) {
        /**
         * 获取当前父路由的href, 跳转到下一个详情页面的规则是 父路由href + id + info
         * 如: 当前href是 user/customer/all 那么点击跳转的详情页是 user/channel/100/info
         */
        $scope.parentHref = $state.href($state.$current.parent.parent);

        //获取登陆者信息
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        var userType = userInfo.type;
        var user_id = userInfo.user_id;
        //控制sales端 和 admin端 客户和渠道收藏按钮的显示和隐藏
        if(userType == 90){
            $scope.collectionButton = false;
        }else {
            $scope.collectionButton = false;
        };
        // 调取所有省份函数
        city($scope, $http);
        var provinceMap = sessionStorage.getItem('provinceMap');
        var params = {
            uid: user_id,
            province: provinceMap
        };
        $scope.province = provinceMap;
        //输入姓名查找  ---->获取页面数据也在这里
        $scope.$watch('name', function () {
            var params = {
                uid: user_id,
                name: $scope.name,
                page_size: 9
            };
            console.log(params);
            queryData.getData('User_middle/middles',params).then(function (data) {
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
        //点击分页
        $scope.pageChanged = function (page,name,type) {
            var params = {
                uid: user_id,
                page: page,
                name: name,
                type: type,
                province: $scope.province,
                page_size: 9
            };
            consoleLog(params);
            queryData.getData('User_middle/middles',params).then(function (data) {
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
        //点击搜索
        $scope.searchMiddle = function (name,type,province) {
            //获取参数
            var params = {
                uid: user_id,
                name: name,
                type: type,
                province: province,
                page_size: 9
            };
            console.log(params);
            queryData.getData('User_middle/middles',params).then(function (data) {
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
