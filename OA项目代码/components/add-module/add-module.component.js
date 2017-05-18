/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('addModule', {
    templateUrl: '../components/add-module/add-module.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'projectModule', '$state', 'toast', function ($rootScope, $scope, $stateParams, projectModule, $state, toast) {
        //保存当前项目id
        $scope.projectId = $stateParams.id;

        //获取所有模块
        projectModule.getAllModule().then(function (data) {
            consoleLog(data);
            $scope.moduleList = data.data;
        });
        
        //保存当前模块索引
        $scope.selectModule = function (index) {
            $scope.selectedIndex = index;
        };

        //确定添加模块
        $scope.confirmAddModule = function () {
            if($scope.selectedIndex == undefined) {
                toast.show('请选择一个模块添加');
                return;
            }
            //添加模块
            var module = $scope.moduleList[$scope.selectedIndex];
            projectModule.add({
                project_id: $stateParams.id,
                module_id: module.id,
                module_name: module.name
            }).then(function (data) {
                $scope.backAction();
            });
        };

        //返回
        $scope.backAction = function () {
            window.location.href = "#/project/detail/"+$stateParams.id+"/supervision";
        }
    }]
});
