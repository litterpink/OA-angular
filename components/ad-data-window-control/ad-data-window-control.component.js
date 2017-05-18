/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 风控人员统计
 */
angular.module('byComponent').component('adDataWindowControl', {
    templateUrl: '../components/ad-data-window-control/ad-data-window-control.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {
        //存储类型
        $scope.userType = function (type) {
            sessionStorage.setItem('countUserType',type);
        };
        //sessionStorage.setItem('countUserType','type');
        //风控人员列表
        queryData.getData('count/wind_control').then(function (data) {
            console.log(data);
            if(data.status == true){
                $scope.users = data.data.data;
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
        //点击分页
        $scope.pageChanged = function (page) {
            var params = {
                user_type: "sale",
                page: page
            };
            consoleLog(params);
            queryData.getData('user/users',params).then(function (data) {
                $scope.users = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
    }]
});
