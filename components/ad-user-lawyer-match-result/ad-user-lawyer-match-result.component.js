/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 律师匹配结果
 */
angular.module('byComponent').component('adUserLawyerMatchResult', {
    templateUrl: '../components/ad-user-lawyer-match-result/ad-user-lawyer-match-result.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {
        //获取参数
        var area = sessionStorage.getItem('area');
        var court = sessionStorage.getItem('court');
        var province = sessionStorage.getItem("province");
        var uid = JSON.parse(sessionStorage.getItem("userInfo")).user_id;

        var data = {
            uid: uid,
            area: area,
            court: court,
            province: province
        };
        console.log(data);
        //获取匹配数据
        queryData.getData("User_lawyer_match/match",data).then(function (data) {
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
                uid: uid,
                area: area,
                court: court,
                province: province,

                page: page
            };
            //consoleLog(params);
            queryData.getData('User_lawyer/match',params).then(function (data) {
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });

        };
    }]
});
