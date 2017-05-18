/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 内部人员基本信息
 */
angular.module('byComponent').component('adUserPersonInfo', {
    templateUrl: '../components/ad-user-person-info/ad-user-person-info.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams','queryData', 'toast',function ($state,$rootScope, $scope, $stateParams,queryData, toast) {
        /**
         * 1.  配置菜单
         */
        $scope.selectedIndex = 0;
        //菜单配置
        $scope.menuOptions = [
            {
                name: '基本信息'
            },
            {
                name: '参与项目'
            }
        ];
        //基本信息
        queryData.getData('user/staff',{user_id:$stateParams.id}).then(function (data) {
            console.log(data);
            if(data.status==true){
                $scope.user = data.data;
                $scope.person = $.extend(true, {}, data.data);
            }else {
                window.location.href = "#/user/person";
            }
        });
        // 单击修改按钮调用数据显示在修改框中
       /*$scope.userInfo = function (name,position,phone,type,status,email) {
            $scope.person.name = name;
            $scope.person.position = position;
            $scope.person.phone = phone;
            $scope.person.type = type;
            $scope.person.status = status;
            $scope.person.email = email;
       };*/
        //修改信息
        $scope.modify = function () {
            var data = $scope.person;
            data.user_id = $stateParams.id;
            delete data.create_time;
            console.log(data);
            //修改内部用户信息
            queryData.putData('user/staff',data).then(function (data) {
                console.log(data);
                if (data.status == true) {
                    $('#analyst').on('hidden.bs.modal', function () {
                        //刷新当前组件
                        $state.reload($state.current.name);
                    });
                    $('#analyst').modal('hide');
                }else {
                    alert(data.message);
                }
            });
        };

        //删除信息
        $scope.delete = function () {
            queryData.getData('user/staff_delete',{staff_id: $stateParams.id}).then(function (data) {
                $('#deleteUser').modal('hide');
                toast.show('删除成功', 2000, function () {
                    //返回到内部用户页面
                    window.location = "#/user/person";
                });
            });
        };

        //重置密码
        $scope.resetPassword = function () {
            queryData.postData('user/reset_pass', {
                user_id: $stateParams.id
            }).then(function (data) {
                $('#resetPassword').modal('hide');
                toast.show('重置密码成功', 2000, function () {
                });
            });
        };

        //重置微信
        $scope.resetWechat = function () {
            queryData.postData('user/reset_wechat', {
                user_id: $stateParams.id
            }).then(function (data) {
                $('#resetWechat').modal('hide');
                toast.show('重置微信成功', 2000, function () {
                    $state.reload($state.current.name);
                });
            });
        };

        //参与项目
        queryData.getData('user/staff_projects',{user_id: $stateParams.id}).then(function (data) {
            $scope.projects = data.data.data;

            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;

            // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
            $scope.maxSize = 5; // 显示最大页数
            $scope.bigTotalItems = $scope.maxItems;
            $scope.bigCurrentPage = 1;
        });
        //点击分页
        $scope.pageChanged = function (page) {
            var params = {
                user_id: $stateParams.id,
                page: page
            };
            //consoleLog(params);
            queryData.getData('user/staff_projects',params).then(function (data) {
                $scope.projects = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });

        };

    }]
});
