/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 渠道收藏
 */
angular.module('byComponent').component('collectMiddle', {
    templateUrl: '../components/collect-middle/collect-middle.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'queryData', '$state', function ($rootScope, $scope, $stateParams, queryData, $state) {
        /**
         * 获取当前父路由的href, 跳转到下一个详情页面的规则是 父路由href + id + info
         * 如: 当前href是 user/customer/all 那么点击跳转的详情页是 user/channel/100/info
         */
        $scope.parentHref = $state.href($state.$current.parent);

        var user_id = getUserInfo().user_id;
        //获取参数
        var params = {
            user_id: user_id,
            type: 3
        };
        console.log(params);
        //所有收藏
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
            }else {
                alert(data.message);
            }
        });
        //点击分页
        $scope.pageChanged = function (page) {
            var params = {
                user_id: user_id,
                page: page,
                type: 3
            };
            console.log(params);
            queryData.getData('collection/collections',params).then(function (data) {
                console.log(data);

                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };
    }]
});
