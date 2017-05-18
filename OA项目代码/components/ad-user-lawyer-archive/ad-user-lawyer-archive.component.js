/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 大律师档案
 */
angular.module('byComponent').component('adUserLawyerArchive', {
    templateUrl: '../components/ad-user-lawyer-archive/ad-user-lawyer-archive.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','provinceCity','queryData','$http', function ($rootScope, $scope, $stateParams,provinceCity,queryData,$http) {
        var user_id = getUserInfo().user_id;
        var provinceMap = sessionStorage.getItem('provinceMap');
        // 调取所有省份函数
        city($scope, $http);
        $scope.lawyer = {};
        $scope.lawyer.province = provinceMap;
        //获取全部大律师信息
        $scope.$watch('lawyer',function () {
            var params = $scope.lawyer;
            params.uid = user_id;
            params.judicial_type = '1';
            queryData.getData('User_lawyer/lawyers',params).then(function (data) {
                console.log(data);
                sessionStorage.removeItem('provinceMap');
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
        },true);
        //点击分页
        $scope.pageChanged = function (page) {
            var params = $scope.lawyer;
            params.uid = user_id;
            params.judicial_type = '1';
            params.page = page;

            consoleLog(params);
            queryData.getData('User_lawyer/lawyers',params).then(function (data) {
                console.log(data);
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
    }]
});
