/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('projectEvaluate', {
    templateUrl: '../components/project-evaluate/project-evaluate.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'project', function ($rootScope, $scope, $stateParams, project) {
        // 打开一个收起其他卡片
        $scope.oneAtATime = true;
        // 配置每个卡片的打开状态
        $scope.status = {
            one: false,
            two: false,
            three: false,
            four: false,
            five: false,
            six: false,
            seven: false,
            eight: false
        };
        consoleLog($stateParams);
        //请求数据
        project.evals($stateParams.id).then(function (data) {
            console.log(data);
            data = data.data;
            $scope.back_record = data.back_record;
            $scope.analyst = data.analyst;
            $scope.controller = data.controller;
            $scope.director = data.cd;
        });

        /**
         * 2. 配置顶部菜单的选项
         */
        $scope.menuOptions = [
            {
                name: '市场分析师',
                uiSref: '.analyst'
            },
            {
                name: '风控经理',
                uiSref: '.wcm'
            },
            {
                name: '风控总监',
                uiSref: '.wcd'
            }
        ];
    }]
});