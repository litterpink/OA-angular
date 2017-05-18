/**
 * Created by liuchungui on 16/8/25.
 */
'use strict';

//项目参与人员
angular.module('byComponent').component('projectPerson', {
    templateUrl: '../components/project-person/project-person.template.html',
    controller: ['$stateParams','$scope', 'project', 'user', 'toast', '$state', function ($stateParams, $scope, project, user, toast, $state) {
        var self = this;
        $scope.maxSize = 5;

        project.project_users($stateParams.id).then(function (data) {
            console.log(data);
            /**
             * 通过用户类型判断是否可以更换人员
             */
            var userInfo = getUserInfo();
            if(userInfo.type == 90) {
                $scope.canChangePerson = true;
            }
            else {
                $scope.canChangePerson = false;
            }

            //是否存在的方法
            function personExist (data) {
                if(data == undefined || data == "" || data.length == 0) {
                    return false;
                }
                return true;
            }
            data = data.data;
            //项目状态
            var projectStatus = data.status;
            //组装成数组信息
            var personInfoArray = [];
            if(personExist(data.sales)) {
                data.sales.role = "销售";
                data.sales.roleType = "sales";
                //状态为9/13/15/16/17/18不可以更换销售, 因为销售的工作已经完成
                if(projectStatus != '9' && projectStatus != '13' && projectStatus != '15' && projectStatus != '16' &&
                    projectStatus != '17' && projectStatus != '18' ) {
                    data.sales.canChange = true;
                }
                personInfoArray.push(data.sales);
            }
            if(personExist(data.client)) {
                data.client.role = "客户";
                data.client.roleType = "client";
                //状态为9/13/15/16/17/18不可以更换客户,因为案件已签约或结束
                if(projectStatus != '9' && projectStatus != '13' && projectStatus != '15' && projectStatus != '16' &&
                    projectStatus != '17' && projectStatus != '18' ) {
                    data.client.canChange = true;
                }
                personInfoArray.push(data.client);
            }
            if(personExist(data.middle)) {
                data.middle.role = "渠道";
                data.middle.roleType = "middle";
                //状态为9/13/15/16/17/18不可以更换渠道,因为案件已经签约或结束
                if(projectStatus != '9' && projectStatus != '13' && projectStatus != '15' && projectStatus != '16' &&
                    projectStatus != '17' && projectStatus != '18' ) {
                    data.middle.canChange = true;
                }
                personInfoArray.push(data.middle);
            }
            if(personExist(data.analyst)) {
                data.analyst.role = "市场分析师";
                data.analyst.roleType = "analyst";
                //状态为2可以更换分析师
                if(projectStatus == '2') {
                    data.analyst.canChange = true;
                }
                personInfoArray.push(data.analyst);
            }
            if(personExist(data.manager)) {
                data.manager.role = "项目经理";
                data.manager.roleType = "manager";
                //状态为17可以更换项目经理
                if(projectStatus == '17') {
                    data.manager.canChange = true;
                }
                personInfoArray.push(data.manager);
            }
            if(personExist(data.controller)) {
                data.controller.role = "风控经理";
                data.controller.roleType = "controller";
                //状态为4/20可以更换项目经理
                if(projectStatus == '4' || projectStatus == '20') {
                    data.controller.canChange = true;
                }
                personInfoArray.push(data.controller);
            }
            if(personExist(data.lawyer)) {
                data.lawyer.role = "律师";
                data.lawyer.roleType = "lawyer";
                //状态为17(督办中)可以更换项目经理
                if(projectStatus == '17') {
                    data.lawyer.canChange = true;
                }
                personInfoArray.push(data.lawyer);
            }
            if(personExist(data.cd)) {
                data.cd.role = "风控总监";
                data.cd.roleType = "cd";
                //状态为3/4/5/6/7/8/9/10/11/12/13/20/21可以更换风控总监
                if(projectStatus == '3' || projectStatus == '4' || projectStatus == '5' || projectStatus == '6' ||
                    projectStatus == '7' || projectStatus == '8' || projectStatus == '9' || projectStatus == '10' ||
                    projectStatus == '11' || projectStatus == '12' || projectStatus == '13' || projectStatus == '20' ||
                    projectStatus == '21') {
                    data.lawyer.canChange = true;
                }
                personInfoArray.push(data.cd);
            }
            $scope.personInfoArray = personInfoArray;

        });

        //查询用户信息
        function queryLawyers() {
            user.usersInfo({
                page: $scope.currentPage,
                user_type: $scope.changeRoleType,
                name: $scope.searchName
            }).then(function (data) {
                consoleLog(data);
                $scope.personList = data.data.data;
                $scope.totalItems = data.data.maxRows;
            }, function (error) {
                consoleLog(error)
            });
        }

        /**
         * 更换人员事件
         */
        $scope.changePerson = function (person) {
            console.log(person);
            //发生改变, 则重置选中
            if(person.roleType != $scope.changeRoleType) {
                self.selectedPersonIndex = undefined;
                self.selectedPerson = undefined;
            }

            //更换的角色名
            $scope.changeRole = person.role;
            //更换的角色类型
            $scope.changeRoleType = person.roleType;
            //查询用户信息
            queryLawyers();
            $('#changePersonModal').modal('show');
        };

        //选择更换人员信息
        $scope.selectPerson = function (index) {
            console.log(index);
            self.selectedPersonIndex = index;
            self.selectedPerson = $scope.personList[index];
        };

        //监听姓名变化,从而实时请求接口
        $scope.$watch('searchName', function (name) {
            if($scope.changeRoleType) {
                queryLawyers();
            }
        });

        //翻页
        $scope.pageChanged = function () {
            queryLawyers();
        };

        //提交选中人员
        $scope.submitSelectPerson = function () {
            if(!self.selectedPerson || !self.selectedPerson.user_id) {
                toast.show('请选择更换的用户');
                return;
            }

            //更换人员的id
            project.change_person({
                project_id: $stateParams.id,
                user_id: self.selectedPerson.user_id,
                type: $scope.changeRoleType
            }).then(function (data) {
                toast.show('更换成功', 1000, function () {
                    hideModal('changePersonModal', function () {
                        $state.reload($state.current.name);
                    });
                });
            });
        };
    }]
});