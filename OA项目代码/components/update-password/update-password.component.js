/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('updatePassword', {
    bindings: {
        success: '&'
    },
    templateUrl: '../components/update-password/update-password.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'login', 'md5', function ($rootScope, $scope, $stateParams, login, md5) {
        var self = this;
        $scope.showTopError = false;
        //提交修改密码
        $scope.submitUpdatePassword = function () {
            //比较新旧密码是否一样
            if($scope.newPass != $scope.confirmPass) {
                $scope.showTopError = true;
                return;
            }
            //提交修改密码请求
            login.updatePass({
                old_pass: md5.createHash($scope.oldPass),
                new_pass: md5.createHash($scope.newPass)
            }).then(function () {
                //修改成功, 模态消失, 回调成功
                $('#updatePasswordModal').modal('hide');
                self.success();
                //清空数据
                $scope.oldPass = "";
                $scope.newPass = "";
                $scope.confirmPass = "";
            });
        };
        
        //监听密码
        $scope.$watch('newPass', function (value) {
            if(value == $scope.confirmPass) {
                $scope.showTopError = false;
            }
        });

        $scope.$watch('confirmPass', function (value) {
            if(value == $scope.newPass) {
                $scope.showTopError = false;
            }
        });

    }]
});
