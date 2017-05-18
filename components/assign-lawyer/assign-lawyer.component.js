/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('assignLawyer', {
    bindings: {
        //指定完成后调用的事件
        complete: '&',
        // lawyerId: '='
    },
    templateUrl: '../components/assign-lawyer/assign-lawyer.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'user', 'projectOperate', 'toast', function ($rootScope, $scope, $stateParams, user, projectOperate, toast) {
        var self = this;
        //设置默认值
        self.type = 0;

        //查询律师信息
        function queryLawyers() {
            user.usersInfo({
                page: $scope.currentPage,
                user_type: 'lawyer',
                name: $scope.lawyerName
            }).then(function (data) {
                consoleLog(data);
                $scope.lawyerList = data.data.data;
                $scope.totalItems = data.data.maxRows;
                //默认选中律师
                self.selectedLawyer = $scope.lawyerList[self.selectedLawyerIndex];
            }, function (error) {
                consoleLog(error)
            });
        }

        //切换选择律师或填写律师信息事件, 0选择律师, 1填写律师
        $scope.selectTabEvent = function (type) {
            self.type = type;
        };

        //选择律师事件
        $scope.selectLawyer = function (index) {
            consoleLog(index);
            self.selectedLawyerIndex = index;
            self.selectedLawyer = $scope.lawyerList[self.selectedLawyerIndex];
        };

        //监听律师的姓名变化,从而实时请求接口
        $scope.$watch('lawyerName', function (name) {
            queryLawyers();
        });

        //翻页
        $scope.pageChanged = function () {
            queryLawyers();
        };

        //提交选中律师
        $scope.submitSelectLawyer = function () {
            if(!self.selectedLawyer || !self.selectedLawyer.user_id) {
                toast.show('请选择律师');
                return;
            }
            //填写律师
            if(self.type) {
                alert("弹出这个,说明出问题了");
            }
            //选择律师
            else {
                //提交律师信息给案件
                projectOperate.assignLawyer(self.selectedLawyer.user_id, $stateParams.id).then(function (data) {
                    self.complete();
                    // //延时10毫秒调用,否则lawyerId还未同步成功就调用方法,会造成同步未成功的问题
                    // setTimeout(function () {
                    //     self.complete();
                    // }, 10);
                });
            }
        };

        //添加律师中的取消提交
        $scope.cancelSubmit = function () {
            $('#selectLawyerModal').modal('hide');
        };

        //添加律师成功的回调
        $scope.addLawyerComplete = function (lawyerId) {
            console.log("添加律师的id: "+lawyerId);
            self.complete();
            // //延时10毫秒调用,否则lawyerId还未同步成功就调用方法,会造成同步未成功的问题
            // setTimeout(function () {
            //     self.complete();
            // }, 10);
        };
    }]
});
