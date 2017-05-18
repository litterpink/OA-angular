/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 律师-我的收藏
 */
angular.module('byComponent').component('adUserLawyerCollect', {
    templateUrl: '../components/ad-user-lawyer-collect/ad-user-lawyer-collect.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {

        var user_id = JSON.parse(sessionStorage.getItem("userInfo")).user_id;

        var params = {
            user_id: user_id,
            type: 1
        };
        //收藏律师列表
        queryData.getData('collection/collections',params).then(function (data) {
            console.log(data);
            if(data.status == true){
                $scope.infos = data.data.data;

                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;

                // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
                $scope.maxSize = 5; // 显示最大页数
                $scope.bigTotalItems = $scope.maxItems;
                $scope.bigCurrentPage = 1;
            }else{
                alert(data.message);
            }
        });
        //点击分页
        $scope.pageChanged = function (page) {
            var params = {
                page: page,
                user_id: user_id,
                type: 1
            };
            consoleLog(params);
            queryData.getData('collection/collections',params).then(function (data) {
                console.log(data);
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
        
    }]
});
