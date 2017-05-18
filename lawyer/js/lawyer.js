/**
 * Created by liuchungui on 16/8/19.
 */

var lawyerApp = angular.module("lawyerApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "mix.service", "mix.directive", "mix.filter", "ngFileUpload", "project.service", "byComponent", "angular-input-stars", 'angular-loading-bar']);

// 配置表单验证
lawyerApp.config(function (w5cValidatorProvider) {
    // 全局配置
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: function showError(elem, errorMessages){
            return true;
        },
        removeError: function (elem) {
            return true;
        }
    });
    w5cValidatorProvider.setRules({
        email: {
            required: "输入的邮箱地址不能为空",
            email   : "输入邮箱地址格式不正确"
        },
        name: {
            required: "姓名不能为空"
        },
        phone: {
            required: "输入手机号码不能为空",
            number: "手机号码格式不正确"
        },
        firm: {
            required: "机构名称不能为空"
        },
        caseName: {
            required: "案件名不能为空"
        },
        money: {
            required: "标的不能为空",
            number: '标的额格式不正确',
        },
        goals: {
            required: "客户目标不能为空"
        },
        signDate: {
            required: "请选择签约日期"
        },
        preProfit: {
            required: "前期收益不能为空"
        },
        position: {
            required: "职位不能为空"
        }
    });
});


//配置loading
lawyerApp.config(configuredLoadingBar);

// 路由控制
lawyerApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/account");
    $stateProvider
        .state("account", {
            url: "/account",
            template: '<lawyer-account></lawyer-account>'
        })
        //合作信息
        .state("cooperation", {
            url: "/cooperation",
            template: '<lawyer-cooperation></lawyer-cooperation>'
        })
        .state("project", {
            url: "/project",
            template: '<div ui-view></div>'
        })
        //项目列表
        .state("project.list", {
            url: "/list",
            template: '<div class="right-content"><project-list></project-list></div>'
        })
        //项目详情
        .state("project.detail", {
            url: "/detail/:id",
            template: '<project-detail></project-detail>'
        })
        .state("project.detail.speed", {
            url:"/speed",
            template: '<project-speed></project-speed>',
        })
        .state("project.detail.supervision", {
            url:"/supervision",
            template: '<ui-view><project-supervision></project-supervision></ui-view>',
        })
        //督办中的代办事项
        .state("project.detail.supervision.todo", {
            url:"/todo",
            template: '<project-todo></project-todo>',
        })
        .state("project.detail.info", {
            url:"/info",
            template: '<project-info></project-info>',
        })
        .state("project.detail.person", {
            url:"/person",
            template: '<project-person></project-person>',
        })
        .state("project.detail.file", {
            url:"/file",
            template: '<ui-view><project-file></project-file></ui-view>',
        })
        //文件列表
        .state("project.detail.file.list", {
            url: "/list/:type",
            template: '<project-file-list></project-file-list>',
        })
        .state("feedback", {
            url: "/feedback",
            template: '<user-feedback></user-feedback>'
        })
});

// 配置界面公共的控制器, 比如退出登录, 查看用户信息, 修改密码 (获取数据服务, 退出登录服务, 单击标题效果服务)
lawyerApp.controller("commonCtrl", function ($scope, queryData, signOut) {
    $scope.signOut = function () {
        signOut.out();
    };
    //获取用户信息
    var userInfo = getUserInfo();
    $scope.userName = userInfo.name;
});

//菜单控制器
lawyerApp.controller("menuController", function ($scope, queryData, signOut) {
    $scope.menuOptions = [
        {
            name: '档案管理',
            imageName: '../common/images/project-manage.png',
            options: [
                {
                    name: '档案信息',
                    uiSref: "account"
                }
            ]
        },
        {
            name: '项目管理',
            imageName: '../common/images/project-manage.png',
            options: [
                {
                    name: '项目列表',
                    uiSref: "project.list"
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

