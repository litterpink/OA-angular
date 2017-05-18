/**
 * Created by liuchungui on 16/8/25.
 */

'use strict';

var version = '11.1.3';

angular.module('byComponent').component('projectTodo', {
    templateUrl: '../components/project-todo/project-todo.template.html',
    controller: ['$scope', '$stateParams', 'projectModuleItem', 'Upload', '$timeout', 'fileOperate', 'user', 'projectModule', 'projectOperate', 'toast', function ($scope, $stateParams, projectModuleItem, Upload, $timeout, fileOperate, user, projectModule, projectOperate, toast) {
        /**
         * 1. 初始化默认事件
         */
        var self = this;
        $scope.checked = [];

        //获取当前的模块信息
        $scope.moduleName = sessionStorage.getItem("moduleName");
        self.projectModuleId = sessionStorage.getItem("projectModuleId");
        self.moduleId = sessionStorage.getItem('moduleId');

        //默认上传文件类型
        // $scope.uploadFileType = "1";

        //项目id
        $scope.projectId = $stateParams.id;

        /**
         * 用户数据初始化
         */
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        self.userType = parseInt(userInfo.type);
        self.userId = userInfo.user_id;
        //是否是项目经理角色
        $scope.projectManager = 0;

        /**
         * 分页信息
         */
        // 默认项目状态
        $scope.status = "所有";
        //显示页面的数量
        $scope.maxSize = 5;
        //当前分页
        $scope.currentPage = 1;
        //选择律师索引
        self.selectedLawyerIndex = 0;

        /**
         * 2. 请求数据
         */
        projectModuleItem.query({project_module_id: self.projectModuleId}).then(function (data) {
            console.log(data);
            //项目是否完成
            $scope.is_finished = data.data.is_finished;
            data = data.data.group_items;

            var dataList = [];
            /**
             * 根据身份确定顶部的待办事项标题
             */
            switch (self.userType) {
                //客户
                case 4:
                case 5:
                    //第一项标题和数据
                    dataList.push({
                        title: "我的待办事项",
                        itemList: data.client
                    });
                    dataList.push({
                        title: "律师待办事项",
                        itemList: data.lawyer
                    });
                    dataList.push({
                        title: "项目经理待办事项",
                        itemList: data.manager
                    });
                    break;
                //律师
                case 2:
                case 3:
                    //第一项标题和数据
                    dataList.push({
                        title: "我的待办事项",
                        itemList: data.lawyer
                    });
                    dataList.push({
                        title: "客户待办事项",
                        itemList: data.client
                    });
                    dataList.push({
                        title: "项目经理待办事项",
                        itemList: data.manager
                    });
                    break;
                //项目经理
                case 95:
                case 96:
                    $scope.projectManager = 1;
                    //第一项标题和数据
                    dataList.push({
                        title: "我的待办事项",
                        itemList: data.manager
                    });
                    dataList.push({
                        title: "律师待办事项",
                        itemList: data.lawyer
                    });
                    dataList.push({
                        title: "客户待办事项",
                        itemList: data.client
                    });
                    break;
                //管理员
                case 90:
                    $scope.projectManager = 1;
                    //第一项标题和数据
                    dataList.push({
                        title: "项目经理待办事项",
                        itemList: data.manager
                    });
                    dataList.push({
                        title: "律师待办事项",
                        itemList: data.lawyer
                    });
                    dataList.push({
                        title: "客户待办事项",
                        itemList: data.client
                    });
                    break;
            }
            //给scope
            $scope.dataList = dataList;
        });


        /**
         * 3. 事件处理
         */
        //选择条目事项
        $scope.selectItem = function (itemInfo, index) {
            if(itemInfo.item_status == 2) {
                //已经完成的条目, 永远是checked
                $scope.checked[itemInfo.project_module_item_id] = true;
                return;
            }

            //非管理员, 则只能自己的待办事项
            if(self.userType != 90 && self.userType != 95 && self.userType != 96  && index != 0) {
                toast.show("您只能完成自己的待办事项");
                $scope.checked[itemInfo.project_module_item_id] = false;
                return;
            }

            //默认是取消的
            $scope.checked[itemInfo.project_module_item_id] = false;

            //保存当前的条目信息
            self.itemInfo = itemInfo;
            //根据操作类型进行事件处理
            switch (parseInt(itemInfo.item_operate)) {
                //无额外操作
                case 0:
                    confirm('你确认提交吗?',function (r) {
                        if(r){
                            submitItem();
                        }
                    });
                    break;
                //上传文件, 更新状态
                case 1:
                    $('#uploadFileModal').modal('show');
                    break;
                //填写律师信息, 更新状态
                case 3:
                    $('#selectLawyerModal').modal('show');
                    break;
                default:
                    break;
            }
        };
        
        //提交条目事件
        function submitItem() {
            projectModuleItem.update({
                user_id: self.userId,
                project_module_item_id: self.itemInfo.project_module_item_id
            }).then(function (data) {
                $('#selectLawyerModal').modal('hide');
                $('#uploadFileModal').modal('hide');
                //更新状态, 勾选对应事项完成
                self.itemInfo.item_status = 2;
                $scope.checked[self.itemInfo.project_module_item_id] = true;
                //完成事项成功
                toast.show('完成事项成功');
            }, function (data) {
                consoleLog(data);
            });
        }

        //提交上传文件事件
        $scope.submitUpload = function (uploadFileType, uploadFiles) {
            fileOperate.add({
                file_info: uploadFiles,
                project_file_type: uploadFileType,
                module_id: self.moduleId,
                project_id: $stateParams.id,
                type: 1
            }).then(function (data) {
                //成功之后提交条目事件
                submitItem();
            });
        };

        //指定律师事件
        $scope.assignLawyerComplete = function () {
            //提交条目事件
            submitItem();
        };

        //点击完成
        $scope.completeProject = function () {
            confirm('确认完成吗?',function (r) {
                if(r){
                    projectModule.finish(self.projectModuleId).then(function (data) {
                        $scope.is_finished = 1;
                    });
                }
            });
        };


    }]
});