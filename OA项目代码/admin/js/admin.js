var adminApp = angular.module("adminApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "ngFileUpload", "mix.service", "mix.directive", "mix.filter", "project.service", "user.service", "byComponent", "angular-input-stars", "ngDialog", 'ngAnimate', 'angular-loading-bar']);
// 配置表单验证
adminApp.config(function (w5cValidatorProvider) {
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
adminApp.config(function (cfpLoadingBarProvider) {
    configuredLoadingBar(cfpLoadingBarProvider);
});

// 路由控制
adminApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("/user/lawyer", "/user/lawyer/match");
    $urlRouterProvider.when("/user/customer", "/user/customer/all/list");
    $urlRouterProvider.when("/user/channel", "/user/channel/all/list");
    $urlRouterProvider.when("/user/channel/all", "/user/channel/all/list");
    $urlRouterProvider.when("/user/customer/all", "/user/customer/all/list");
    $urlRouterProvider.when("/project", "/project/list/0");
    $urlRouterProvider.otherwise("/data/project");
    //项目评估信息重定向
    $urlRouterProvider.when('/project/detail/:id/evaluate', ['$match', '$stateParams', function ($match, $stateParams) {
        return '/project/detail/'+$urlRouterProvider.$stateParams.id+'/evaluate/analyst'
    }]);
    $stateProvider
    //1.数据概览
    .state("data", {
            abstract: true,
            url: "/data",
            template: '<div class="right-content" ui-view></div>',
            // templateUrl: "data.html",
            controller: dataCtrl
        })
        //1.1项目统计
        .state("data.project", {
            url: "/project",
            template: '<ad-data-project></ad-data-project>',
            controller: function () {
                // resizeHeight();
            }
        })
        //1.2律师统计
        .state("data.lawyer", {
            url: "/lawyer",
            template: '<ad-data-lawyer></ad-data-lawyer>'
        })
        //1.3客户统计
        .state("data.customer", {
            url: "/customer",
            template: '<ad-data-customer></ad-data-customer>'
        })
            //1.3.1世界地图
            .state("data.customer.world", {
                url: "/world",
                templateUrl: "worldMap.html",
                controller: dataCustomerWorldCtrl
            })
            //1.3.2中国
            .state("data.customer.china", {
                url: "/china",
                templateUrl: "chinaMap.html",
                controller: dataCustomerChinaCtrl
            })
        //1.4渠道统计
        .state("data.channel", {
            url: "/channel",
            template: '<ad-data-channel></ad-data-channel>'
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
   /*-------------------------分割线------------------------------------------------- */
    //2用户管理
    .state("user", {
        abstract: true,
        url: "/user",
        template: '<ui-view></ui-view>'
    })
        //2.1内部人员
        .state("user.person", {
            url: "/person",
            template: '<ad-user-person></ad-user-person>'
        })
            //2.1.1内部人员-基本信息
            .state("user.person.info", {
                url: "/:id/info",
                template: '<ad-user-person-info></ad-user-person-info>'
            })
        //2.2律师
        .state("user.lawyer", {
            url: "/lawyer",
            templateUrl: "topMenu.html",
            controller: lawyerMenuController
        })
            //2.2.1律师匹配
        .state("user.lawyer.match", {
            url: "/match",
            template: '<ad-user-lawyer-match></ad-user-lawyer-match>'
        })
                //律师匹配结果
        .state("user.lawyer.match.result", {
            url: "/result",
            template: '<ad-user-lawyer-match-result></ad-user-lawyer-match-result>'
        })
            //2.2.2全部律师
        .state("user.lawyer.all", {
            url: "/all",
            template: '<ad-user-lawyer-all></ad-user-lawyer-all>'
        })
        //官网入驻
        .state("user.lawyer.gw", {
            url: "/gw",
            template: '<ad-user-lawyer-gw></ad-user-lawyer-gw>'
        })
            //2.2.3大律师档案
        .state("user.lawyer.archive", {
            url: "/archive",
            template: '<ad-user-lawyer-archive></ad-user-lawyer-archive>'
        })
        //2.2.4添加律师
        .state("user.lawyer.add", {
            url: "/add",
            template: '<ad-user-lawyer-add-input lawyer-id="lawyerId"></ad-user-lawyer-add-input>'
        })
            //2.2.5我的收藏
        .state("user.lawyer.collect", {
            url: "/collect",
            template: '<ad-user-lawyer-collect></ad-user-lawyer-collect>'
        })
        //律师详情
        .state("lawyerInfo", {
            url: "/lawyerInfo/:id/info",
            template: '<lawyer-account></lawyer-account>'
        })
        //2.3客户
        .state("user.customer", {
            url: "/customer",
            template: '<ui-view></ui-view>',
            // templateUrl: "topMenu.html",
            // abstract: true,
            // controller: customerMenuController
        })
            //2.3.1所有客户
        .state("user.customer.all", {
            url: "/all",
            templateUrl: 'topMenu.html',
            controller: customerMenuController
            // template: '<ui-view></ui-view>'
        })
        .state("user.customer.all.list", {
            url: "/list",
            template: '<ad-user-customer-all></ad-user-customer-all>',
        })
                //2.3.1所有客户Info
        .state("user.customer.info", {
            url: "/:id/info",
            template: '<ad-user-customer-info page="supervision"></ad-user-customer-info>'
        })
            //2.3.2添加客户
        .state("user.customer.all.add", {
            url: "/add",
            templateUrl: "../sales/customerNew.html",
            controller: function ($scope, $state) {
                $scope.nextStep = function () {
                    //跳转到列表页面
                    $state.go("user.customer.all");
                }
            }
        })
            //2.4渠道
        .state("user.channel", {
            url: "/channel",
            template: '<ui-view></ui-view>'
        })
        //2.4.1所有渠道
        .state("user.channel.all", {
            url: "/all",
            templateUrl: "topMenu.html",
            controller: channelMenuController
        })
        .state("user.channel.all.list", {
            url: "/list",
            template: '<ad-user-channel-all></ad-user-channel-all>'
        })
                //2.4.1.1所有渠道Info
        .state("user.channel.info", {
            url: "/:id/info",
            template: '<ad-user-channel-all-info></ad-user-channel-all-info>'
        })
            //2.4.2添加
        .state("user.channel.all.add", {
            url: "/add",
            template: '<add-middle button-title="完成" middle-id="middleId" next-step="nextStep()"></add-middle>',
            controller: function ($scope, $state) {
                $scope.nextStep = function () {
                    $state.go("user.channel.all.list");
                }
            }
            // template: '<ad-user-channel-add></ad-user-channel-add>'
        })
        //         //2.4.2.1添加个人信息
        // .state("user.channel.add.person", {
        //     url: "/person",
        //     template: '<ad-user-channel-add-person></ad-user-channel-add-person>'
        // })
        //         //2.4.2.1添加机构信息
        // .state("user.channel.add.mechanism", {
        //     url: "/mechanism",
        //     template: '<ad-user-channel-add-mechanism></ad-user-channel-add-mechanism>'
        // })
/*------------------------------分割线------------------------------------------- */
        //3项目管理
        .state("project", {
            url: "/project",
            template: '<ui-view></ui-view>',
        })
        //项目列表
        .state("project.list", {
            url: "/list/:status",
            templateUrl: "projectList.html",
            controller: projectStatusMenuCtrl
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
        //反馈处理
        .state("feedback", {
            url: "/feedback",
            template: '<ui-view></ui-view>'
        })
        .state("feedback.todoList", {
            url: "/todoList",
            templateUrl: 'feedbackList.html',
            controller: feedbackTodoListController
        })
        .state("feedback.dealtList", {
            url: "/dealtList",
            templateUrl: 'feedbackList.html',
            controller: feedbackDealtListController
        });

});

// adminApp.run(function ($rootScope, $state, $location, $transitions) {
//     $transitions.onBefore({to: "user.**", from: "data.**"}, function ($transition$, $state) {
//         var cacheStateName = sessionStorage.getItem('adminUserCacheState');
//         var cacheHref = sessionStorage.getItem('adminUserCacheHref');
//         // 与将要跳转的状态不一样, 则返回一个新的目标状态
//         if(cacheHref != undefined && cacheStateName != undefined && cacheStateName != $transition$.to().name) {
//             // $state.transitionTo(cacheStateName);
//             // return $state.target(cacheStateName);
//             //由于有带参数的路由,无法直接target,所以使用href
//             window.location = cacheHref;
//         }
//     });
//
//     $transitions.onBefore({to: "user.**", from: "project.**"}, function ($transition$, $state) {
//         var cacheStateName = sessionStorage.getItem('adminUserCacheState');
//         var cacheHref = sessionStorage.getItem('adminUserCacheHref');
//         // 与将要跳转的状态不一样, 则返回一个新的目标状态
//         if(cacheHref != undefined && cacheStateName != undefined && cacheStateName != $transition$.to().name) {
//             // $state.transitionTo(cacheStateName);
//             // return $state.target(cacheStateName);
//             //由于有带参数的路由,无法直接target,所以使用href
//             window.location = cacheHref;
//         }
//     });
//
//     $transitions.onSuccess({to: "user.**"}, function ($transition$, $state) {
//         //保存用户管理的状态
//         sessionStorage.setItem('adminUserCacheState', $state.current.name);
//         //保存href链接
//         sessionStorage.setItem('adminUserCacheHref', $state.href($state.current));
//     });
// });

/*------------------------------分割线------------------------------------------- */
// 配置界面公共的控制器, 比如退出登录, 查看用户信息, 修改密码 (获取数据服务, 退出登录服务, 单击标题效果服务)
adminApp.controller("adminCtrl", function ($scope, queryData, signOut) {
    $scope.signOut = function () {
        signOut.out();
    };
    //获取用户信息
    var userInfo = getUserInfo();
    $scope.userName = userInfo.name;
});

//菜单控制器
adminApp.controller("menuController", function ($scope, queryData, signOut) {
    $scope.menuOptions = [
        {
            name: '数据管理',
            imageName: '../common/images/data-manage.png',
            options: [
                {
                    name: '项目统计',
                    uiSref: "data.project"
                },
                {
                    name: '律师统计',
                    uiSref: "data.lawyer"
                },
                {
                    name: '客户统计',
                    uiSref: "data.customer"
                },
                {
                    name: '渠道统计',
                    uiSref: "data.channel"
                },
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
            name: '客户管理',
            imageName: '../common/images/client-manage.png',
            options: [
                {
                    name: '内部人员',
                    uiSref: "user.person"
                },
                {
                    name: '律师',
                    uiSref: 'user.lawyer'
                },
                {
                    name: '客户',
                    uiSref: 'user.customer'
                },
                {
                    name: '渠道',
                    uiSref: 'user.channel'
                }
            ]
        },
        {
            name: '项目管理',
            imageName: '../common/images/project-manage.png',
            options: [
                {
                    name: '项目列表',
                    uiSref: 'project'
                }
            ]
        },
        {
            name: '反馈处理',
            imageName: '../common/images/handle_list.png',
            options: [
                {
                    name: '待处理',
                    uiSref: 'feedback.todoList'
                },
                {
                    name: '已处理',
                    uiSref: 'feedback.dealtList'
                }
            ]
        }
    ];
});

//律师顶部菜单
function lawyerMenuController($scope) {
    $scope.menuOptions = [
        {
            name: '律师匹配',
            uiSref: 'user.lawyer.match',
        },
        {
            name: '全部律师',
            uiSref: 'user.lawyer.all'
        },
        {
            name: '官网入驻律师',
            uiSref: 'user.lawyer.gw'
        },
        {
            name: '大律师档案',
            uiSref: 'user.lawyer.archive',
        },
        {
            name: '添加律师',
            uiSref: 'user.lawyer.add',
        },
        {
            name: '我的收藏',
            uiSref: 'user.lawyer.collect'
        }
    ];
}

//客户顶部菜单控制器
function customerMenuController($scope) {
    $scope.menuOptions = [
        {
            name: '所有客户',
            uiSref: 'user.customer.all.list'
        },
        {
            name: '添加客户',
            uiSref: 'user.customer.all.add'
        }
    ];
}

//项目状态顶部菜单控制器
function projectStatusMenuCtrl($scope, queryData) {
    $scope.statusOptions = [
        {
            name: '所有',
            uiSref: "project.list({status: 0})"
        },
        {
            name: '未提交评估',
            uiSref: "project.list({status: 1})"
        },
        {
            'name': '评估中',
            uiSref: "project.list({status: 2})"
        },
        {
            'name': '待签约',
            uiSref: "project.list({status: 3})"
        },
        {
            'name': '督办中',
            uiSref: "project.list({status: 4})"
        },
        {
            'name': '已结项',
            uiSref: "project.list({status: 5})"
        },
        {
            'name': '退回补充材料',
            uiSref: "project.list({status: 6})"
        },
        {
            'name': '搁置项目',
            uiSref: "project.list({status: 7})"
        }
    ];
}

//渠道顶部菜单控制器
function channelMenuController($scope) {
    $scope.menuOptions = [
        {
            name: '所有渠道',
            uiSref: 'user.channel.all.list'
        },
        {
            name: '添加渠道',
            uiSref: 'user.channel.all.add'
        }
    ];
}

//反馈处理的待办事项
function feedbackTodoListController($scope, feedback) {
    //初始化
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.pageSize = 10;

    //获取待办的反馈列表
    function getFeedbackTodoListData() {
        feedback.list({
            is_solve: 0,
            page_size: $scope.pageSize,
            page: $scope.currentPage
        }).then(function (data) {
            console.log(data);
            $scope.infoList = data.data.data;
            $scope.totalItems = data.data.maxRows;
        });
    }

    //第一次初始化, 获取数据
    getFeedbackTodoListData();

    //提交处理事件
    $scope.clickButton = function (info) {
        confirm('确定已经解决这个反馈?', function (value) {
            if(value) {
                var userInfo = getUserInfo();
                feedback.put({
                    user_id: userInfo.user_id,
                    feedback_id: info.id,
                    is_solve: '已解决'
                }).then(function (data) {
                    getFeedbackTodoListData();
                })
            }
        })
    };

    //翻页
    $scope.pageChanged = function () {
        getFeedbackTodoListData();
    };
}

//反馈处理的已办事项
function feedbackDealtListController($scope, feedback) {
    //初始化
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.pageSize = 10;

    //请求已处理事项
    function getListData() {
        feedback.list({
            is_solve: 1,
            page_size: $scope.pageSize,
            page: $scope.currentPage
        }).then(function (data) {
            $scope.infoList = data.data.data;
            $scope.totalItems = data.data.maxRows;
        });
    }

    //默认第一次获取数据
    getListData();

    //翻页
    $scope.pageChanged = function () {
        getListData();
    };
}

//1.数据概览
function dataCtrl($state,$rootScope,$scope,queryData) {
}
        //1.3.1世界地图
function dataCustomerWorldCtrl($rootScope,$scope,queryData) {
    $scope.world = "世界地图";
}
        //1.3.2中国地图
function dataCustomerChinaCtrl($rootScope,$scope,queryData) {
}

/*------------------------------分割线------------------------------------------- */
//2用户管理
/*function userCtrl($rootScope,$scope,queryData) {
    // rightHeight();
}
        //2.3.2添加客户
function userCustomerAddCtrl($state, $rootScope,$scope,queryData,provinceCity) {
    //初始化城市信息
    $scope.vm = {
        entity: {
            province: "北京",
            city: "朝阳"
        }
    };
    // 使用服务获取 省市联动
    provinceCity.province().then(function (data) {
        // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
        $scope.province = data;
        $scope.city = data[0].cities;
        // 省份改变的时候, 选择相应的市
        $scope.provinceChange = function () {
            for (var i = 0; i < data.length; i++) {
                // 判断如果配置选中的省份,然后获取对应的市的数组
                if (data[i].name == $scope.vm.entity.province) {
                    $scope.city = data[i].cities;
                    // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
                    $scope.vm.entity.city = data[i].cities[0];
                }
            }
        }
    });

    // 设置默认值
    $scope.type = "个人";
    $scope.sex = "男";
    $scope.level = "普通";
    // 带配置的富文本框, ueditor插件,备注信息使用
    $scope._simpleConfig = {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: [
            ['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic', 'underline',                     'fontborder', 'strikethrough', '|', 'forecolor', 'backcolor',                           'insertorderedlist', 'insertunorderedlist', 'justifyleft', 'justifyright',              'justifycenter', 'justifyjustify']
        ],
        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false
    };
    $scope.remarks = "备注";
}*/











