/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 市场分析师评估信息
 */
angular.module('byComponent').component('projectEvaluateAnalyst', {
    templateUrl: '../components/project-evaluate-analyst/project-evaluate-analyst.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams', 'project','queryData', function ($state,$rootScope, $scope, $stateParams, project,queryData) {
        $scope.type = getUserInfo().type;
        //var user_id = getUserInfo().user_id;
        $scope.project_id = $stateParams.id;
        //请求数据
        getMessage();
        function getMessage() {
            project.evals($stateParams.id).then(function (data) {
            console.log(data);
            data = data.data;
            $scope.analyst = data.analyst;
            console.log($scope.analyst);
            });
        }
        project.basic($stateParams.id).then(function (data) {
            console.log(data);
            $scope.status = data.data.num_status;
        });
    }]
});
