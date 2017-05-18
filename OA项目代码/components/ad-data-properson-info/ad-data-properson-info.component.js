/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员信息统计组件
 */
angular.module('byComponent').component('adDataPropersonInfo', {
    templateUrl: '../components/ad-data-properson-info/ad-data-properson-info.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {
        //项目人员详情页接口
        queryData.getData('count/manager_details',{sales_id: $stateParams.id}).then(function (data) {
            console.log(data);
            if(data.status == true){
                $scope.user = data.data;
            }else {
                alert(data.message);
            }
        });
        //所有项目经理案件
        queryData.getData('project_list/manager',{status: "所有",manager_id: $stateParams.id}).then(function (data) {
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
        //点击分页
        $scope.pageChanged = function (page) {
            var params = {
                page: page,
                status: "所有",
                manager_id: $stateParams.id
            };
            console.log(params);
            queryData.getData('project_list/manager',params).then(function (data) {
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
    }]
});
