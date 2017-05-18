/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 风控总监评估信息
 */
angular.module('byComponent').component('projectEvaluateWcm', {
    templateUrl: '../components/project-evaluate-wcm/project-evaluate-wcm.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams', 'project','queryData', function ($state,$rootScope, $scope, $stateParams, project,queryData) {
        consoleLog($stateParams);
        var project_id = $stateParams.id;
        var user_id = getUserInfo().user_id;
        $scope.type = getUserInfo().type;
        //请求数据
        getMessage();
        function getMessage() {
            project.evals($stateParams.id).then(function (data) {
                console.log(data);
                data = data.data;
                $scope.controller = data.controller;
            });
        }
        project.basic($stateParams.id).then(function (data) {
            console.log(data);
            $scope.status = data.data.num_status;
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
            $scope.$watch('result', function () {
                if($scope.result=='' || $scope.result == undefined){
                    $('#result').css({'border-color':'red'});
                }else{
                    $('#result').css({'border-color':'white'});
                }
            });
        };
        //评估
        $scope.assessment = function (num) {
            //$scope.project_id = num;
            //获取草稿
            queryData.getData('project_operate/controller_draft',{controller_id: user_id,project_id: project_id}).then(function (data) {
                console.log(data);
                $scope.money = parseInt(data.data[0].money);
                $scope.risk = data.data[0].risk;
                $scope.property = data.data[0].property;
                $scope.client_ability = data.data[0].client_ability;
                $scope.lawyers = data.data[0].lawyers;
                $scope.lawyer_fee = parseInt(data.data[0].lawyer_fee);
                $scope.official_fee = parseInt(data.data[0].official_fee);
                $scope.travel_expense = parseInt(data.data[0].travel_expense);
                $scope.payment_money = parseInt(data.data[0].payment_money);
                $scope.payment_time = data.data[0].payment_time;
                $scope.judicial = data.data[0].judicial;
                $scope.result = data.data[0].result;
                $scope.suggestion = data.data[0].suggestion;
            });
        };
        //保存为草稿
        $scope.saveDraft =function(money,risk,property,client_ability,lawyers,lawyer_fee,official_fee,travel_expense,payment_time,payment_money,judicial,result,suggestion){
            var params = {
                project_id: project_id,
                controller_id: user_id,
                money: money,
                risk: risk,
                property: property,
                client_ability: client_ability,
                lawyers: lawyers,
                lawyer_fee: lawyer_fee,
                official_fee: official_fee,
                travel_expense: travel_expense,
                payment_time: payment_time,
                payment_money: payment_money,
                judicial: judicial,
                result: result,
                suggestion: suggestion
            };
            console.log('保存为草稿',params);
            queryData.postData('project_operate/controller_draft',params).then(function (data) {
                $('#assessment').on('hidden.bs.modal', function () {
                    //刷新当前组件
                    $state.reload();
                });
                $('#assessment').modal('hide');
            });
        };
        //提交评估
        $scope.submitAssessment = function (money,risk,property,client_ability,lawyers,lawyer_fee,official_fee,travel_expense,payment_time,payment_money,judicial,result,suggestion) {
            var params = {
                project_id: project_id,
                controller_id: user_id,
                money: money,
                risk: risk,
                property: property,
                client_ability: client_ability,
                lawyers: lawyers,
                lawyer_fee: lawyer_fee,
                official_fee: official_fee,
                travel_expense: travel_expense,
                payment_time: payment_time,
                payment_money: payment_money,
                judicial: judicial,
                result: result,
                suggestion: suggestion
            };
            console.log(params);
            queryData.postData("project_operate/controller_eval",params).then(function (data) {
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
