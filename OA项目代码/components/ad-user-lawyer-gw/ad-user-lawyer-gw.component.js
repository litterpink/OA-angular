/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 全部律师
 */
angular.module('byComponent').component('adUserLawyerGw', {
    templateUrl: '../components/ad-user-lawyer-gw/ad-user-lawyer-gw.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity','queryData','$http', function ($rootScope, $scope, $stateParams, provinceCity,queryData,$http) {
        //查询全部信息
        var user_id= JSON.parse(sessionStorage.getItem('userInfo')).user_id;


        var params = {
            uid: user_id,
            input_mode: 3

        };
        console.log(params);
        queryData.getData('User_lawyer/lawyers',params).then(function (data) {
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
                uid: user_id,
                page: page,
                input_mode: 3
            };
            console.log(params);
            queryData.getData('User_lawyer/lawyers',params).then(function (data) {
                console.log(data);
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });

        };
    }]
});
