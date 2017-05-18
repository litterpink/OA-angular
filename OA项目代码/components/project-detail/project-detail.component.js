/**
 * Created by liuchungui on 16/8/26.
 */
'use strict';

angular.module('byComponent').component('projectDetail', {
    templateUrl: '../components/project-detail/project-detail.template.html',
    controller: ['$stateParams', '$scope', 'project', '$state', function ($stateParams, $scope, project, $state) {
        /**
         * 1. 设置项目名称和编号
         */
        $scope.projectName = sessionStorage.getItem(SelectProjectName);
        $scope.projectNum = $stateParams.id;
        $scope.updateProjectName = $scope.projectName;

        /**
         * 2. 配置顶部菜单的选项
         */
        var userType = parseInt(getUserInfo().type);
        switch (userType) {
            //管理员/项目总监/项目经理
            case 90:
            case 95:
            case 96:
                $scope.menuOptions = [
                    {
                        name: '案件督办',
                        uiSref: ".supervision"
                    },
                    {
                        name: '进度',
                        uiSref: ".speed"
                    },
                    {
                        'name': '项目信息',
                        uiSref: ".info"
                    },
                    {
                        'name': '参与人员',
                        uiSref: ".person"
                    },
                    {
                        'name': '文件',
                        uiSref: ".file"
                    },
                    {
                        name: '评估信息',
                        uiSref: ".evaluate"
                    }
                ];
                break;
            //销售/分析师/风控经理/风控总监/商务经理
            case 91:
            case 92:
            case 93:
            case 94:
            case 97:
                $scope.menuOptions = [
                    {
                        'name': '项目信息',
                        uiSref: ".info"
                    },
                    {
                        name: '进度',
                        uiSref: ".speed"
                    },
                    {
                        name: '评估信息',
                        uiSref: ".evaluate"
                    },
                    {
                        'name': '参与人员',
                        uiSref: ".person"
                    },
                    {
                        'name': '文件',
                        uiSref: ".file"
                    }
                ];
                break;
            default:
                $scope.menuOptions = [
                    {
                        name: '案件督办',
                        uiSref: ".supervision"
                    },
                    {
                        name: '进度',
                        uiSref: ".speed"
                    },
                    {
                        'name': '项目信息',
                        uiSref: ".info"
                    },
                    {
                        'name': '参与人员',
                        uiSref: ".person"
                    },
                    {
                        'name': '文件',
                        uiSref: ".file"
                    }
                ];
                break;

        }

        /**
         * 3. 修改项目名称
         */
        var projectStatus = sessionStorage.getItem(SelectProjectStatus);
        //市场分析师并且状态是市场分析师分析状态时, 可以修改项目名称
        if(userType == '92' && projectStatus == '2') {
            $scope.canEditeProjectName = true;
        }
        else {
            $scope.canEditeProjectName = false;
        }

        //提交更改项目名称
        $scope.submitUpdate = function (updateProjectName) {
            project.update({
                name: updateProjectName,
                project_id: $stateParams.id
            }).then(function (data) {
                hideModal('updateProjectNameModal', function () {
                    $scope.projectName = updateProjectName;
                });
            });
        };

        //监听项目名称发生改变, 则存储
        $scope.$watch('projectName', function (value) {
            //缓存到本地
            sessionStorage.setItem(SelectProjectName, value);
        });
    }]
});
