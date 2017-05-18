/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 风控经理评估信息
 */
angular.module('byComponent').component('projectEvaluateWcd', {
    templateUrl: '../components/project-evaluate-wcd/project-evaluate-wcd.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams', 'project','queryData', function ($state,$rootScope, $scope, $stateParams, project,queryData) {
        var project_id = $stateParams.id;
        var user_id = getUserInfo().user_id;
        $scope.type = getUserInfo().type;
        //请求数据
        project.evals($stateParams.id).then(function (data) {
            console.log(data);
            data = data.data;
            $scope.director = data.cd;
        });
        //点击完成 触发  富文本无内容提示(边框变红)
        $scope.changeColor = function () {
            //1.监听内容  有内容时取消红色边框

            $('#suggestionColor').css({'border-color':'white'});

            $scope.$watch('suggestion', function () {
                if($scope.suggestion=='' || $scope.suggestion == undefined){
                    $('#suggestionColor').css({'border-color':'red'});
                }else{
                    $('#suggestionColor').css({'border-color':'white'});
                }
            });
            //2.监听内容  有内容时取消红色边框

            $('#result').css({'border-color':'white'});

            $scope.$watch('result', function () {
                if($scope.result=='' || $scope.result == undefined){
                    $('#result2').css({'border-color':'red'});
                }else{
                    $('#result2').css({'border-color':'white'});
                }
            });
        };
        $scope.submitAssessment = function (suggestion,result) {
            var params = {
                project_id: project_id,
                cd_id: user_id,
                result: result,
                suggestion: suggestion
            };
            console.log(params);
            queryData.postData("project_operate/cd_eval",params).then(function (data) {
                if(data.status == true){
                    console.log(data);
                    $('#assessment').on('hidden.bs.modal', function () {
                        //刷新当前组件
                        $state.reload();
                    });
                    $('#assessment').modal('hide');
                }else {
                    alert(data.message);
                }
            });
        };
    }]
});
