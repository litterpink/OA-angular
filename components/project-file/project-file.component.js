/**
 * Created by liuchungui on 16/8/25.
 */
'use strict';

/**
 * 项目文件组件
 */
angular.module('byComponent').component('projectFile', {
    templateUrl: '../components/project-file/project-file.template.html',
    controller: ['$scope', '$stateParams', function ($scope, $stateParams) {
        $scope.projectId = $stateParams.id;
        //根据用户类型判断是否可编辑
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        var self = this;
        switch (parseInt(userInfo.type)) {
            //帮帮内部员工, 显示帮帮内部文件
            case 90:
            case 91:
            case 92:
            case 93:
            case 94:
            case 95:
            case 96:
            case 97:
            case 98:
                $scope.showInternalFile = true;
                break;
            default:
                $scope.showInternalFile = false;
                break;
        }
    }]
});