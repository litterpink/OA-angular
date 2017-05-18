/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 市场分析师评估信息
 */
angular.module('byComponent').component('projectAnalystBtn', {
    bindings: {
        //项目id
        projectId: '@'
    },
    templateUrl: '../components/project-analyst-btn/project-analyst-btn.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams', 'project','queryData', function ($state,$rootScope, $scope, $stateParams, project,queryData) {
        var self = this;

        $scope.type = getUserInfo().type;
        var user_id = getUserInfo().user_id;
        console.log($stateParams,$scope.type);

        self.$onChanges = function (value) {
            var projectId = value.projectId.currentValue;
            console.log(value);
            if(projectId) {
                //注入数据数据
                queryData.getData('project_operate/analyst_draft',{analyst_id:user_id,project_id: projectId}).then(function (data) {
                    console.log(data);
                    $scope.dispute = data.data[0].dispute;
                    $scope.party_info = data.data[0].party_info;
                    $scope.money = parseInt(data.data[0].money);
                    $scope.disputes_basis = data.data[0].disputes_basis;
                    $scope.court = data.data[0].court;
                    $scope.limitation = data.data[0].limitation;
                    $scope.result = data.data[0].result;
                    $scope.suggestion = data.data[0].suggestion;
                });
            }
        };


        //保存草稿
        $scope.saveDraft = function (dispute,party_info,money,disputes_basis,court,limitation,result,suggestion) {
            var params = {
                analyst_id: user_id,
                project_id: self.projectId,
                dispute: dispute,
                party_info: party_info,
                money: money,
                disputes_basis: disputes_basis,
                court: court,
                limitation: limitation,
                result: result,
                suggestion: suggestion
            };
            console.log(params);
            queryData.postData('project_operate/analyst_draft',params).then(function (data) {
                $('#analyst').on('hidden.bs.modal', function () {
                    //刷新
                    $state.reload();
                });
                $('#analyst').modal('hide');
            });
        };
        //提交分析
        $scope.submitAnalyst = function (dispute,party_info,money,disputes_basis,court,limitation,result,suggestion) {
            var params = {
                analyst_id: user_id,
                project_id: self.projectId,
                dispute: dispute,
                party_info: party_info,
                money: money,
                disputes_basis: disputes_basis,
                court: court,
                limitation: limitation,
                result: result,
                suggestion: suggestion
            };
            console.log(params);
            queryData.postData("project_operate/analyst_eval",params).then(function (data) {
                if(data.status == true){
                    console.log(data);
                    $('#analyst').on('hidden.bs.modal', function () {
                        //刷新
                        $state.reload();
                    });
                    $('#analyst').modal('hide');
                }else {
                    alert(data.message);
                }
            });
        };
        /* 写到各自的控制器中,要不然一次付给好多court种 */
        /* 搜索到法院,单击赋值 */
        $scope.changeVal = function (newVal, pro) {
            $scope.searchVal = newVal;
            $scope.court = newVal;
            $scope.matchingprovince = pro;
            $(".resultList").hide();
        };
        $scope.showList = function () {
            $(".resultList").show();
            $(".search").focus();
            $scope.searchVal = "";
        };
        $scope.changeColor = function () {
            //1.监听内容  有内容时取消红色边框
            if($scope.disputes_basis=='' || $scope.disputes_basis == undefined){
                $('#disputes').css({'border-color':'red'});
            }
            $scope.$watch('disputes_basis', function () {
                if($scope.disputes_basis=='' || $scope.disputes_basis == undefined){
                    $('#disputes').css({'border-color':'red'});
                }else{
                    $('#disputes').css({'border-color':'white'});
                }
            });
            //2.监听内容  有内容时取消红色边框
            if($scope.party_info=='' || $scope.party_info == undefined){
                $('#disputesColor').css({'border-color':'red'});
            }
            $scope.$watch('party_info', function () {
                if($scope.party_info=='' || $scope.party_info == undefined){
                    $('#disputesColor').css({'border-color':'red'});
                }else{
                    $('#disputesColor').css({'border-color':'white'});
                }
            });
            //2.监听内容  有内容时取消红色边框
            if($scope.result=='' || $scope.result == undefined){
                $('#result').css({'border-color':'red'});
            }
            $scope.$watch('result', function () {
                if($scope.result=='' || $scope.result == undefined){
                    $('#result').css({'border-color':'red'});
                }else{
                    $('#result').css({'border-color':'white'});
                }
            });
        };
    }]
});
