/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 律师匹配
 */
angular.module('byComponent').component('adUserLawyerMatch', {
    templateUrl: '../components/ad-user-lawyer-match/ad-user-lawyer-match.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', '$state', function ($rootScope, $scope, $stateParams,queryData, $state) {
        /* 查询框居中显示 */
        /*$(function () {
            var height = ($(window).height() - 500) / 2;
            $(".content").css({"margin-top": height});


            if (event.keyCode == 13) {
                window.event.keyCode = 32;
            }
        })*/


        var self = this;
        self.area = "1";
        //储存搜索参数
        $scope.matching = function () {
            if ($scope.court == undefined || $scope.court == "") {
                $(".court").focus();
                return false;
            }
            else {
                $scope.warnInfo = "";
                //跳转到匹配结果页面
                $state.go('.result');

                console.log(self.area,$scope.court);
                sessionStorage.setItem("area",self.area);
                sessionStorage.setItem("court",$scope.court);
            }
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

    }]
});
