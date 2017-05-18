/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 律师评论组件
 */
angular.module('byComponent').component('lawyerEvaluate', {
    templateUrl: '../components/lawyer-evaluate/lawyer-evaluate.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', function ($rootScope, $scope, $stateParams) {
        $scope.evaluateStar = 4;
        $scope.evaluateContent = "这个律师非常的不错";
    }]
});
