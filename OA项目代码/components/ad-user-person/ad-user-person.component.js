/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 内部人员
 */
angular.module('byComponent').component('adUserPerson', {
    templateUrl: '../components/ad-user-person/ad-user-person.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams','queryData','toast', function ($state,$rootScope, $scope, $stateParams, queryData,toast) {
        $scope.selectedIndex = 0;
        //菜单配置
        $scope.menuOptions = [
            {
                name: '所有用户'
            },
            {
                name: '添加用户'
            }
        ];

        //配置菜单选中事件
        $scope.selectIndex = function (index) {
            console.log(index);
        };
        //用户列表
        queryData.getData('user/users',{user_type: "staff"}).then(function (data) {
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
        //输入姓名进行查找
        $scope.$watch('selectname',function (result) {
            var data = {
                user_type: "staff",
                name: $scope.selectname
            };
            console.log(data);
            queryData.getData('user/users',data).then(function (data) {
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
        });
        //点击分页
        $scope.pageChanged = function (page) {
            var params = {
                user_type: "staff",
                page: page
            };
            consoleLog(params);
            queryData.getData('user/users',params).then(function (data) {
                $scope.users = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });
        };

        //添加内部人员
        $scope.addNew = function (user) {
            queryData.postData('user/staff',user).then(function (data) {
                toast.show('添加新用户成功', 2000);
                //刷新当前组件 
                $state.reload($state.current.name);
            });
        };

    }]
});
