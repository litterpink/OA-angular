/**
 * Created by liuchungui on 16/8/24.
 */
'use strict';

/**
 * 项目列表组件
 */
angular.module('byComponent')
    .component('projectList', {
        templateUrl: '../components/project-list/project-list.template.html',
        controller: ['$scope', 'projectList','$state', 'cfpLoadingBar', '$stateParams', function projectListController($scope, projectList, $state, cfpLoadingBar, $stateParams) {
            var userInfo = getUserInfo();
            if(userInfo.type == '96'){
                listHeight(false,'120px',$scope);
            }else if(userInfo.type == '97'){
                listHeight(false,'120px',$scope);
            }else if(userInfo.type == '4'){
                listHeight(false,'120px',$scope);
            }else if(userInfo.type == '2'){
                listHeight(false,'120px',$scope);
            }else {
                listHeight(true,'220px',$scope);
            }
            /**
             * 1.设置默认值
             */
            //显示页面的数量
            $scope.maxSize = 5;
            //当前分页
            $scope.currentPage = 1;

            /**
             * 2. 根据用户类型, 配置相关的操作
             */
            //根据用户类型判断是否显示输入框
            var self = this;
            console.log(userInfo);
            switch (parseInt(userInfo.type)) {
                //管理员
                case 90:
                    //非简单列表, 带输入框搜索条件
                    $scope.isSimpleList = false;
                    self.queryProjectList = function () {
                        projectList.admin({
                            name: $scope.name,
                            status: $stateParams.status,
                            page: $scope.currentPage,
                            page_size: 9
                        }).then(function (data) {
                            //设置分页的总数量
                            $scope.totalItems = data.data.maxRows;
                            $scope.projectList = data.data.data;
                            console.log($scope.projectList);
                        });
                    };
                    break;
                // 项目经理
                case 96:
                    console.log($stateParams.status);
                    self.queryProjectList = function () {
                        projectList.manager({
                            page: $scope.currentPage,
                            page_size: 9,
                            status: $stateParams.status,
                            manager_id: userInfo.user_id
                        }).then(function (data) {
                            //设置分页的总数量
                            $scope.totalItems = data.data.maxRows;
                            $scope.projectList = data.data.data;
                            consoleLog($scope.projectList);
                        });
                    };
                    break;
                //商务经理
                case 97:
                    self.queryProjectList = function () {
                        projectList.businessManager({
                            page: $scope.currentPage,
                            page_size: 9,
                        }).then(function (data) {
                            //设置分页的总数量
                            $scope.totalItems = data.data.maxRows;
                            $scope.projectList = data.data.data;
                        });
                    };
                    break;
                // 项目总监
                case 95:
                    break;
                //客户角色
                case 4:
                case 5:
                    //简单列表, 不带搜索条件
                    $scope.isSimpleList = true;
                    self.queryProjectList = function () {
                        cfpLoadingBar.start();
                        projectList.client({
                            page: $scope.currentPage,
                            page_size: 9,
                            client_id: userInfo.user_id
                        }).then(function (data) {
                            //设置分页的总数量
                            $scope.totalItems = data.data.maxRows;
                            $scope.projectList = data.data.data;
                            consoleLog($scope.projectList);
                            // cfpLoadingBar.complete();
                        });
                    };
                    break;

                //律师角色
                case 2:
                case 3:
                    //简单列表, 不带搜索条件
                    $scope.isSimpleList = true;
                    self.queryProjectList = function () {
                        cfpLoadingBar.start();
                        projectList.lawyer({
                            page: $scope.currentPage,
                            page_size: 9,
                            lawyer_id: userInfo.user_id
                        }).then(function (data) {
                            //设置分页的总数量
                            $scope.totalItems = data.data.maxRows;
                            $scope.projectList = data.data.data;
                            consoleLog($scope.projectList);
                        });
                    };
                    break;
            }

            /**
             * 3. 事件
             */
            $scope.pageChanged = function (page) {
                self.queryProjectList();
            };
            //监听项目名称
            $scope.$watch('name', function (name) {
                self.queryProjectList();
                console.log(name);
            });

            //点击项目,跳入详情页面
            $scope.clickProject = function (project) {
                //存储项目名称
                sessionStorage.setItem(SelectProjectName, project.name);
                switch (parseInt(userInfo.type)) {
                    //商务经理
                    case 97:
                        window.location.href = "#/project/detail/" + project.num + "/speed";
                        break;
                    default:
                        window.location.href = "#/project/detail/" + project.num + "/supervision";
                        break;
                }
            };
        }]
    });