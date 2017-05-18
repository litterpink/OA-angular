/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 销售端的项目列表,与普通的列表不同,它会带销售的操作
 */
angular.module('byComponent').component('salesProjectList', {
    templateUrl: '../components/sales-project-list/sales-project-list.template.html',
    controller: ['$state', '$rootScope', '$scope', '$stateParams', 'projectList', 'projectOperate', 'fileOperate', 'user','toast',
        function ($state, $rootScope, $scope, $stateParams, projectList, projectOperate, fileOperate, user, toast) {
            /**
             * 1.设置默认值
             */
            var self = this;
            //总数量
            $scope.totalItems = 64;
            //显示页面的数量
            $scope.maxSize = 5;
            //当前分页
            self.currentPage = 1;
            //配置日期选择控件
            $scope.dateOptions = {
                locale: 'zh-cn',
                format: 'L',
                showClose: true,
                keepOpen: false
            };

            /**
             * 2. 请求默认数据
             */
            //请求销售项目列表信息
            function querySalesProjectList(currentPage) {
                // console.log($scope.currentPage);
                projectList.sales({
                    status: $stateParams.status,
                    page: currentPage,
                    page_size: 9
                }).then(function (data) {
                    sessionStorage.setItem('project_num',JSON.stringify(data.data.project_num));
                    console.log(data);
                    //设置分页的总数量
                    $scope.totalItems = data.data.maxRows;

                    //将数据处理下
                    var projectList = data.data.data;

                    var resultArray = [];
                    var subArray = [];
                    for (var i = 0; i < projectList.length; i++) {
                        if (i % 3 == 0) {
                            subArray = [];
                            resultArray.push(subArray);
                        }
                        subArray.push(projectList[i]);
                    }
                    $scope.projectList = resultArray;
                });
            }

            //默认请求列表数据
            querySalesProjectList(0);

            /**
             * 3. 处理事件,请求数据
             */
            //翻页
            $scope.pageChanged = function (page) {
                querySalesProjectList(page);
            };

            //查询市场分析师
            function queryAnalystList() {
                user.staffList({
                    type: 92
                }).then(function (data) {
                    $scope.analystList = data.data.data;
                    if ($scope.analystList.length > 0) {
                        $scope.selectAnalystId = $scope.analystList[0].id;
                    }
                });
            }

            //点击选中分析师
            $scope.clickSelectAnalyst = function (analystId) {
                console.log(analystId);
                $scope.selectAnalystId = analystId;
            };

            /**
             * 操作项目
             * @param project 项目信息
             * @param eventType 事件类型, 1:提交分析师 2:签约 3:申诉 4:补充材料 5:上传材料 7:搁置
             */
            $scope.operateProject = function (project, eventType) {
                //存储项目名称, 跳转到项目详情使用
                sessionStorage.setItem(SelectProjectName, project.name);
                //判断操作的案件是否发生变化
                var isChange = false;
                if($scope.projectId != project.num) {
                    isChange = true;
                    $scope.projectId = project.num;
                }
                switch (eventType) {
                    case 1:
                    case 6:
                        queryAnalystList();
                        break;
                    case 2:
                        //如果操作的案件已经发生变化, 则清空签约信息
                        if(isChange) {
                            $scope.money = "";
                            $scope.preProfit = "";
                            $scope.finalProfit = "";
                            $scope.signDate = "";
                        }
                        break;
                    case 3:
                        break;
                    case 4:
                        $scope.uploadModalTitle = "补充材料";
                        break;
                    case 5:
                        $scope.uploadModalTitle = "上传材料";
                        break;
                    default:
                        break;
                }
            };

            //签约
            $scope.submitSign = function (uploadFiles) {
                //签约参数
                var signParams = {
                    project_id: $scope.projectId,
                    sign_money: $scope.money,
                    due_pre_profit: $scope.preProfit,
                    due_final_profit: $scope.finalProfit,
                    sign_time: $scope.signDate._d
                };

                console.log(signParams);

                //无项目文件, 直接提交
                if (uploadFiles.length == 0) {
                    projectOperate.sign(signParams).then(function (data) {
                        //隐藏模态,并且跳转到所有项目页面
                        hideModal('sign', function () {
                            $state.go('project.list.status', {
                                status: 0
                            }, {
                                reload: true
                            });
                        });
                    });
                }
                //有项目文件, 先提交文件, 然后签约
                else {
                    fileOperate.add({
                        file_info: uploadFiles,
                        project_file_type: 4,
                        module_id: 0,
                        project_id: $scope.projectId,
                        type: 1
                    }).then(function (data) {
                        projectOperate.sign(signParams).then(function (data) {
                            //隐藏模态,并且跳转到所有项目页面
                            hideModal('sign', function () {
                                $state.go('project.list.status', {
                                    status: 0
                                }, {
                                    reload: true
                                });
                            });
                        });
                    });
                }
            };

            //提交给分析师
            $scope.submitToAnalyst = function () {
                projectOperate.submitAnalyst({
                    project_id: $scope.projectId,
                    analyst_id: $scope.selectAnalystId
                }).then(function (data) {
                    //隐藏模态并且跳转到待评估
                    hideModal('analyst', function () {
                        $state.go('project.list.status', {
                            status: 2
                        }, {
                            reload: true
                        });
                    });
                });
            };

            //重新提交市场分析师
            $scope.reSubmitToAnalyst = function () {
                projectOperate.reSubmitAnalyst({
                    project_id: $scope.projectId,
                }).then(function (data) {
                    //隐藏模态并且跳转到待评估
                    hideModal('submitAnalystAgain', function () {
                        $state.go('project.list.status', {
                            status: 2
                        }, {
                            reload: true
                        });
                    });
                })
            };

            //补充材料
            $scope.submitAddMaterial = function (uploadFiles) {
                if (uploadFiles.length == 0) {
                    toast.show("请上传文件");
                    return;
                }
                //生效时间
                fileOperate.add({
                    file_info: uploadFiles,
                    project_file_type: 1,
                    module_id: 0,
                    project_id: $scope.projectId,
                    type: 1
                }).then(function (data) {
                    console.log(data);
                    //隐藏模态,并且跳转到项目详情页中的案件材料
                    hideModal('uploadFile', function () {
                        $state.go('project.list.detail.file.list', {
                            id: $scope.projectId,
                            type: 1
                        });
                    });
                });
            };

            //申诉
            $scope.submitAppeal = function () {
                projectOperate.appeal($scope.projectId).then(function (data) {
                    //隐藏模态并且跳转到待评估
                    hideModal('appeal', function () {
                        $state.go('project.list.status', {
                            status: 2
                        }, {
                            reload: true
                        });
                    });
                });
            };

            //搁置项目
            $scope.submitStopProject = function (reason) {
                projectOperate.stopProject({project_id: $scope.projectId,detail: reason}).then(function (data) {
                    //隐藏模态并且跳转到搁置项目
                    hideModal('stopProject', function () {
                        $state.go('project.list.status', {
                            status: 7
                        }, {
                            reload: true
                        });
                    });
                });
            };
            //恢复项目
            $scope.canleSelve = function (id) {
                confirm('你确认恢复项目吗?',function (r) {
                    if(r){
                        projectOperate.canleSelve({project_id: id}).then(function (data) {
                            //跳转到所有项目中
                            $state.go('project.list.status', {
                                status: 0
                            }, {
                                reload: true
                            });
                        });
                    }
                });
            };


            //点击项目,跳入详情页面
            $scope.clickProject = function (project) {
                //存储项目名称
                sessionStorage.setItem(SelectProjectName, project.name);
                $state.go('project.list.detail.info', {
                    id: project.num
                });
            };
        }]
});
