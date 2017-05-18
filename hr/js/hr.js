/**
 * Created by liuchungui on 16/8/19.
 */

var hrApp = angular.module("hrApp", ["ui.router", "ui.bootstrap", "w5c.validator", "mix.service", "mix.directive", "mix.filter", "ngFileUpload", "project.service", "byComponent","angular-loading-bar"]);

// 路由控制
hrApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/data/salesman");
    $stateProvider
    //1.数据概览
        .state("data", {
            url: "/data",
            template: '<div ui-view class="right-content"></div>'
        })
        //1.5销售人员统计
        .state("data.salesman", {
            url: "/salesman",
            template: '<ad-data-sales-man></ad-data-sales-man>'
        })
        //1.5.1销售人员Info
        .state("data.salesman.info", {
            url: "/:id/info",
            template: '<ad-data-sales-man-info></ad-data-sales-man-info>'
        })
        //1.6风控人员统计
        .state("data.windcontrol", {
            url: "/windcontrol",
            template: '<ad-data-window-control></ad-data-window-control>'
        })
        //1.6.1风控人员统计Info
        .state("data.windcontrol.info", {
            url: "/:id/info",
            template: '<ad-data-window-control-info></ad-data-window-control-info>'
        })
        //1.7项目人员统计
        .state("data.properson", {
            url: "/properson",
            template: "<ad-data-properson></ad-data-properson>"
        })
        //1.7.1项目人员统计Info
        .state("data.properson.info", {
            template:'<ad-data-properson-info></ad-data-properson-info>',
            url: "/:id/info"
        })
        .state("feedback", {
            url: "/feedback",
            template: '<user-feedback></user-feedback>'
        })
});

//配置Loading
hrApp.config(configuredLoadingBar);

// 配置界面公共的控制器, 比如退出登录, 查看用户信息, 修改密码 (获取数据服务, 退出登录服务, 单击标题效果服务)
hrApp.controller("hrController", function ($scope, signOut) {


});

//菜单控制器
hrApp.controller("menuController", function ($scope, queryData, signOut) {
    $scope.menuOptions = [
        {
            name: '数据概览',
            imageName: '../common/images/data-manage.png',
            options: [
                {
                    name: '销售人员统计',
                    uiSref: "data.salesman"
                },
                {
                    name: '风控人员统计',
                    uiSref: "data.windcontrol"
                },
                {
                    name: '项目人员统计',
                    uiSref: "data.properson"
                }
            ]
        },
        {
            name: '意见反馈',
            imageName: '../common/images/feedback.png',
            uiSref: 'feedback',
            selectedImageName: '../common/images/feedback_select.png',
        }
    ];
});

//1.数据概览
function dataCtrl($state,$rootScope,$scope,queryData, $urlRouter) {
    rightHeight();
}

