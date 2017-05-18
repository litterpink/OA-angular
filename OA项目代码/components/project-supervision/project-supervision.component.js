/**
 * Created by liuchungui on 16/8/25.
 */
'use strict';

angular.module('byComponent').component('projectSupervision', {
    templateUrl: '../components/project-supervision/project-supervision.template.html',
    controller: ['$scope', '$stateParams', 'projectModule', 'comment', 'toast', function ($scope, $stateParams, projectModule, comment, toast) {
        var self = this;
        //获取用户信息
        var userInfo = getUserInfo();
        self.userId = userInfo.user_id;
        /**
         * 注:
         * 1. commentType是评论类型, 1: 客户对律师  2: 对律师 3: 客户对项目经理 4: 律师对项目经理
         */
        switch (parseInt(userInfo.type)) {
            //管理员
            case 90:
                //只有管理员拥有删除模块的权限
                $scope.canRemoveModule = true;
                self.commentType = 2;
                $scope.canEvaluateLawyer = true;
                //添加模块
                $scope.canAddModule = true;
                break;
            //项目经理和项目总监
            case 96:
            case 95:
                self.commentType = 2;
                $scope.canEvaluateLawyer = true;
                $scope.canAddModule = true;
                break;
            //律师
            case 2:
            case 3:
                $scope.canEvaluateLawyer = false;
                $scope.canAddModule = false;
                break;
            //客户
            case 4:
            case 5:
                self.commentType = 1;
                $scope.canEvaluateLawyer = true;
                $scope.canAddModule = false;
                break;
            default:
                $scope.canEvaluateLawyer = false;
                $scope.canAddModule = false;
                break;
        }

        //保存项目id
        $scope.projectId = $stateParams.id;

        // 请求项目模块
        projectModule.query({
            project_id: $stateParams.id,
            user_id: self.userId
        }).then(function (data) {
            console.log(data);
            //此处使用self不行,必须使用scope, self不会刷新数据
            $scope.moduleArray = data.data.project_modules;
            //保存律师信息
            self.lawyer = data.data.lawyer;
        });

        //保存项目模块
        $scope.saveModule = function (info, index) {
            self.selectModule = info;
            self.selectedIndex = index;
            sessionStorage.setItem('moduleName', info.module_name);
            sessionStorage.setItem('moduleId', info.module_id);
            sessionStorage.setItem('projectModuleId', info.id);
        };

        //评分
        $scope.evaluateLawyer = function () {
            if($scope.evaluateStar == 0 || $scope.evaluateStar == undefined) {
                toast.show("请给律师评分");
                return;
            }
            if(!$scope.evaluateContent || $scope.evaluateContent.length < 50) {
                toast.show("请给于律师不少于50字的评论");
                return;
            }
            var params = {
                type: self.commentType,
                star_level: $scope.evaluateStar,
                content: $scope.evaluateContent,
                module_id: self.selectModule.module_id,
                project_id: self.selectModule.project_id,
                project_module_id: self.selectModule.id,
                commenter_id: self.userId,
                commented_id: self.lawyer.lawyer_id
            };
            console.log(params);
            //通过用户类型来判断评论类型
            comment.add(params).then(function (data) {
                //评论成功, 将其设置为已经评论
                $scope.moduleArray[self.selectedIndex].is_commented = 1;
                toast.show(data.message);
            });
            // 模态消失
            $('#lawyerEvaluateModal').modal('hide');
        };
        
        //选中删除的模块index
        $scope.selectRemoveModule = function (index) {
            self.removeIndex = index;
        };

        //删除模块事件
        $scope.removeModule = function () {
            var module = $scope.moduleArray[self.removeIndex];
            projectModule.deleteModule(module.id).then(function (data) {
                // consoleLog(data);
                //删除
                $scope.moduleArray.splice(self.removeIndex, 1);
                $('#removeModuleModal').modal('hide');
            });
        };
    }]
});