/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('adDataProperson', {
    templateUrl: '../components/ad-data-properson/ad-data-properson.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {
        //项目人员列表
        queryData.getData('Count/manager').then(function (data) {
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
                page: page
            };
            consoleLog(params);
            queryData.getData('Count/manager',params).then(function (data) {
                $scope.users = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
    }]
});
