/**
 * Created by liuchungui on 16/8/25.
 */

'use strict';

/**
 * 项目信息组件
 */
angular.module('byComponent').component('projectInfo', {
    templateUrl: '../components/project-info/project-info.template.html',
    controller: ['$state','$stateParams', '$scope', 'project','$timeout', function ($state,$stateParams, $scope, project,$timeout) {
        //根据用户类型判断是否可编辑
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        var self = this;
        $scope.limitTextNum = 100;
        switch (parseInt(userInfo.type)) {
            case 90:
                //可修改项目
                $scope.canEditeProject = true;
                break;
            default:
                //不可修改项目
                $scope.canEditeProject = false;
                break;
        }

        //获取项目基本信息
        project.basic($stateParams.id).then(function (data) {
            //遍历
            $scope.project = data.data;
            //修改project-detail项目名称
            if($scope.$parent.$parent.projectName) {
                $scope.$parent.$parent.projectName = $scope.project.name;
            }
            console.log(data);
            data.data.money = parseInt(data.data.money);


            $scope.project.middle_apply_text = $scope.project.middle_apply;


            if($scope.project.middle_apply == '是') {
                $scope.project.middle_apply = '1';
            }
            else {
                $scope.project.middle_apply = '0';
            }
            //为销售经理并且还未提交给分析师, 销售经理可修改项目
            if(userInfo.type == 91 && $scope.project.status_num == 1) {
                $scope.canEditeProject = true;
            }
            //修改的项目的信息, copy对象
            $scope.case = $.extend(true, {}, $scope.project);


            var aEle = document.getElementsByClassName('targetHeight');
            var bEle = document.getElementsByClassName('changeHeight');
            var str = [
                data.data.party_info,
                data.data.dispute,
                data.data.attitude,
                data.data.goals,
                data.data.brief,
                data.data.property,
                data.data.relief_info,
                data.data.attention
            ];
            var Max = 100;
            for(var j = 0;j < str.length;j++){
                if(j==0){
                    if(str[j].length < Max){
                        $scope.project.party_info = data.data.party_info;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.party_info = (data.data.party_info).substring(0, Max) + '...';
                    }
                }
                if(j==1){
                    if(str[j].length < Max){
                        $scope.project.dispute = data.data.dispute;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.dispute = (data.data.dispute).substring(0, Max) + '...';
                    }
                }
                if(j==2){
                    if(str[j].length < Max){
                        $scope.project.attitude = data.data.attitude;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.attitude = (data.data.attitude).substring(0, Max) + '...';
                    }
                }
                if(j==3){
                    if(str[j].length < Max){
                        $scope.project.goals = data.data.goals;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.goals = (data.data.goals).substring(0, Max) + '...';
                    }
                }
                if(j==4){
                    if(str[j].length < Max){
                        $scope.project.brief = data.data.brief;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.brief = (data.data.brief).substring(0, Max) + '...';
                    }
                }
                if(j==5){
                    if(str[j].length < Max){
                        $scope.project.property = data.data.property;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.property = (data.data.property).substring(0, Max) + '...';
                    }
                }
                if(j==6){
                    if(str[j].length < Max){
                        $scope.project.relief_info = data.data.relief_info;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.relief_info = (data.data.relief_info).substring(0, Max) + '...';
                    }
                }
                if(j==7){
                    if(str[j].length < Max){
                        $scope.project.attention = data.data.attention;
                        aEle[j].innerHTML = '';
                    }else {
                        $scope.project.attention = (data.data.attention).substring(0, Max) + '...';
                    }
                }
            }

            /*$scope.project.attitude = (data.data.attitude).substring(0, Max) + '...';
            $scope.project.goals = (data.data.goals).substring(0, Max) + '...';
            $scope.project.brief = (data.data.goals).substring(0, Max) + '...';
            $scope.project.property = (data.data.goals).substring(0, Max) + '...';
            $scope.project.relief_info = (data.data.relief_info).substring(0, Max) + '...';
            $scope.project.attention = (data.data.attention).substring(0, Max) + '...';*/
            //console.log(str);
            for(var i =0; i < aEle.length; i ++) {
                (function (i) {
                    aEle[i].onclick = function () {
                            if (aEle[i].innerHTML == '显示全部') {
                                aEle[i].innerHTML = '隐藏';
                                bEle[i].innerHTML = str[i];
                            }else {
                                console.log(i);
                                bEle[i].innerHTML = (str[i]).substr(0, Max) + '...';
                                aEle[i].innerHTML = '显示全部';
                            }
                    }
                })(i)
            }


        });
        
        //提交更改
        $scope.submitUpdate = function (updateProject) {
            consoleLog(updateProject);
            project.update(updateProject).then(function (data) {
                consoleLog(data);
                //修改并隐藏模态
                $scope.project = $.extend(true, {}, updateProject);
                $('#caseInfo').on('hidden.bs.modal', function () { 
                    //刷新当前组件 
                    $state.reload($state.current.name); 
                });
                 $('#caseInfo').modal('hide');
            });
        };
    }]
});
