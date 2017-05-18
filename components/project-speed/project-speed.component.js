/**
 * Created by liuchungui on 16/8/25.
 */

'use strict';

/**
 * 项目进度组件
 */
angular.module('byComponent')
    .component('projectSpeed', {
        templateUrl: '../components/project-speed/project-speed.template.html',
        controller: ['$stateParams', 'project', '$scope', function ($stateParams, project, $scope) {
            consoleLog($stateParams);
            /**
             * 查询项目进度
             */
            project.progress($stateParams.id).then(function (data) {
                console.log(data);
                $scope.operateList = data.data.operate;
                $scope.recordList = data.data.record;
                if(($scope.operateList == undefined || $scope.operateList.length == 0) && ($scope.recordList == undefined || $scope.recordList.length == 0)) {
                    $scope.showNodata = true;
                }
                else {
                    $scope.showNodata = false;
                }
            });
        }]
    });
