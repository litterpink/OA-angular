var myApp = angular.module("myApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "ngFileUpload", "mix.service", "mix.directive", "mix.filter","project.service","byComponent", 'angular-loading-bar','angular-input-stars']);

//配置loading
myApp.config(configuredLoadingBar);

//配置表单验证
myApp.config(function (w5cValidatorProvider) {
    // 全局配置
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: function showError(elem, errorMessages){
            return false;
        },
        removeError: function (elem) {
            return false;
        }
    });
    w5cValidatorProvider.setRules({
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
            number: '标的额格式不正确'
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
        reason: {
            required: "原因不能为空"
        },
        oldPass: {
            required: "请输入旧密码"
        },
        newPass: {
            required: "请输入新密码"
        },
        confirmPass: {
            required: "请输入确认新密码"
        }
    });
});

// 路由控制
myApp.config(function ($stateProvider, $urlRouterProvider) {
    //项目评估信息重定向
    $urlRouterProvider.when('/project/detail/:id/evaluate', ['$match', '$stateParams', function ($match, $stateParams) {
        return '/project/detail/'+$urlRouterProvider.$stateParams.id+'/evaluate/analyst'
    }]);
    $urlRouterProvider.when("/project", "/project/list/所有");
    $urlRouterProvider.when("/project/list", "/project/list/所有");
    $urlRouterProvider.otherwise("/project/list/督办中");
    $stateProvider
    //3项目管理
        .state("project", {
            url: "/project",
            template: '<ui-view></ui-view>',
            controller: projectRootController
        })
        //项目列表
        .state("project.list", {
            url: "/list/:status",
            template: '<div class="right-content"><project-list></project-list></div>'
        })
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
        //督办中的添加模块
        .state("project.detail.supervision.addModule", {
            url: "/addModule",
            template: '<add-module></add-module>'
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
        //评估信息
        .state("project.detail.evaluate", {
            url: "/evaluate",
            template: '<project-evaluate></project-evaluate>',
        })
        .state("project.detail.evaluate.analyst", {
            url: "/analyst",
            template: '<project-evaluate-analyst></project-evaluate-analyst>'
        })
        .state("project.detail.evaluate.wcm", {
            url: "/wcm",
            template: '<project-evaluate-wcm></project-evaluate-wcm>'
        })
        .state("project.detail.evaluate.wcd", {
            url: "/wcd",
            template: '<project-evaluate-wcd></project-evaluate-wcd>'
        })

        //2.律师管理
        .state("lawyer", {
            url: "/lawyer",
            abstract: true,
            template: '<div class="right-content" ui-view></div>'
        })
        //2.2.1律师匹配
        .state("lawyer.match", {
            url: "/match",
            template: '<ad-user-lawyer-match></ad-user-lawyer-match>'
        })
        //律师匹配结果
        .state("lawyer.match.result", {
            url: "/result",
            template: '<ad-user-lawyer-match-result></ad-user-lawyer-match-result>'
        })
        //2.2.2全部律师
        .state("lawyer.all", {
            url: "/all",
            template: '<ad-user-lawyer-all></ad-user-lawyer-all>'
        })
        //官网入驻
        .state("lawyer.gw", {
            url: "/gw",
            template: '<ad-user-lawyer-gw></ad-user-lawyer-gw>'
        })
        //2.2.3大律师档案
        .state("lawyer.archive", {
            url: "/archive",
            template: '<ad-user-lawyer-archive></ad-user-lawyer-archive>'
        })
        //2.2.4添加律师
        .state("lawyer.add", {
            url: "/add",
            template: '<ad-user-lawyer-add-input lawyer-id="lawyerId"></ad-user-lawyer-add-input>'
        })
        //2.2.5我的收藏
        .state("lawyer.collect", {
            url: "/collect",
            template: '<ad-user-lawyer-collect></ad-user-lawyer-collect>'
        })
        //律师详情
        .state("lawyerInfo", {
            url: "/lawyerInfo/:id/info",
            template: '<lawyer-account></lawyer-account>'
        })
        .state("feedback", {
            url: "/feedback",
            template: '<user-feedback></user-feedback>'
        })

});

// 配置界面公共的控制器, 比如退出登录, 查看用户信息, 修改密码 (获取数据服务, 退出登录服务, 单击标题效果服务)
myApp.controller("adminCtrl", function ($scope, queryData, signOut) {
    $scope.signOut = function () {
        signOut.out();
    };
    //获取用户信息
    var userInfo = getUserInfo();
    $scope.userName = userInfo.name;
});

//菜单控制器
myApp.controller("menuController", function ($scope, queryData, signOut) {
    $scope.menuOptions = [
        {
            name: '项目管理',
            imageName: '../common/images/project-manage.png',
            options: [
                {
                    name: '所有项目',
                    uiSref: "project.list({status: '所有'})"
                },
                {
                    name: '督办中项目',
                    uiSref: "project.list({status: '督办中'})"
                },
                {
                    'name': '已结项项目',
                    uiSref: "project.list({status: '已结项'})"
                },
                {
                    'name': '签约中项目',
                    uiSref: "project.list({status: '签约中'})"
                }
            ]
        },
        {
            name: '律师管理',
            imageName: '../common/images/client-manage.png',
            options: [
                {
                    name: '律师匹配',
                    uiSref: 'lawyer.match',
                },
                {
                    name: '全部律师',
                    uiSref: 'lawyer.all'
                },
                {
                    name: '官网入驻律师',
                    uiSref: 'lawyer.gw'
                },
                {
                    name: '大律师档案',
                    uiSref: 'lawyer.archive',
                },
                {
                    name: '添加律师',
                    uiSref: 'lawyer.add',
                },
                {
                    name: '我的收藏',
                    uiSref: 'lawyer.collect'
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

//项目根控制器
function projectRootController($scope, num) {
    var parentScope = $scope.$parent;
    //刷新菜单控制器的数目
    num.projectManager().then(function (data) {
        console.log(data);
        parentScope.menuOptions[0].options[1].num = data.data.manager;
    });
}














