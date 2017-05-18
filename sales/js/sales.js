var salesApp = angular.module("salesApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "ngFileUpload", "mix.service", "mix.directive", "mix.filter", "project.service", "byComponent", "user.service", 'angular-loading-bar']);

//配置loading
salesApp.config(configuredLoadingBar);

// 配置表单验证
salesApp.config(function (w5cValidatorProvider) {
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
        }
    });
});
// 路由控制
salesApp.config(function ($stateProvider, $urlRouterProvider) {
    //项目列表重定向
    $urlRouterProvider.when('/project/list', '/project/list/status/0');
    //项目评估信息重定向
    $urlRouterProvider.when('/project/list/detail/:id/evaluate', ['$match', '$stateParams', function ($match, $stateParams) {
         return '/project/list/detail/'+$urlRouterProvider.$stateParams.id+'/evaluate/analyst'
    }]);
    //新建项目的重定向
    $urlRouterProvider.when('/project/new', '/project/new/client');
    $urlRouterProvider.otherwise("/project/list/status/0");
    $stateProvider
    // 项目管理
        .state("project", {
            abstract: true,
            url: "/project",
            template: '<ui-view></ui-view>'
            // templateUrl: "project.html",
            // controller: function ($scope,queryData) {
            //     //rightHeight();
            //
            //     var sales_id = JSON.parse(sessionStorage.getItem('userInfo')).user_id;
            //     queryData.getData('project_list/sales',{sales_id: sales_id}).then(function (data) {
            //         $scope.project_num = data.data.project_num
            //     });
            //     $scope.project_num = JSON.parse(sessionStorage.getItem('project_num'));
            // }
        })
        // 项目列表
        .state("project.list", {
            url: "/list",
            template: '<ui-view></ui-view>'
            // templateUrl: "projectList.html",
            // controller: projectStatusCtrl
        })
        //项目列表
        .state("project.list.status", {
            url: "/status/:status",
            templateUrl: "projectList.html",
            controller: projectStatusCtrl
            // template: '<sales-project-list></sales-project-list>'
        })
        //项目详情
        .state("project.list.detail", {
            url: "/detail/:id",
            template: '<project-detail></project-detail>'
        })
        // 进度 评估信息 项目信息 参与人员 文件 控制器, 加载公共模板
        .state("project.list.detail.speed", {
            url:"/speed",
            template: '<project-speed></project-speed>',
        })
        .state("project.list.detail.evaluate", {
            url: "/evaluate",
            // abstract: true,
            template: '<project-evaluate></project-evaluate>',
            controller: function ($state) {
            }
        })
            .state("project.list.detail.evaluate.analyst", {
                url: "/analyst",
                template: '<project-evaluate-analyst></project-evaluate-analyst>'
            })
            .state("project.list.detail.evaluate.wcm", {
                url: "/wcm",
                template: '<project-evaluate-wcm></project-evaluate-wcm>'
            })
            .state("project.list.detail.evaluate.wcd", {
                url: "/wcd",
                template: '<project-evaluate-wcd></project-evaluate-wcd>'
            })
        .state("project.list.detail.info", {
            url:"/info",
            template: '<project-info></project-info>',
        })
        .state("project.list.detail.person", {
            url:"/person",
            template: '<project-person></project-person>',
        })
        .state("project.list.detail.file", {
            url:"/file",
            template: '<ui-view><project-file></project-file></ui-view>',
        })
        //文件列表
        .state("project.list.detail.file.list", {
            url: "/list/:type",
            template: '<project-file-list></project-file-list>',
        })

        // 新建项目
        .state("project.new", {
            url: "/new",
            templateUrl: "projectNew.html",
        })
        //新建项目的客户信息
        .state("project.new.client", {
            url: "/client",
            templateUrl: "clientInfo.html",
            controller: selectClientInfoCtrl
        })
        //新建项目渠道
        .state("project.new.middle", {
            url: "/middle",
            templateUrl: "middleInfo.html",
            controller: selectMiddleCtrl
        })
        //新建项目案件信息
        .state("project.new.case", {
            url: "/case",
            templateUrl: "caseInfo.html",
            controller: fillInCaseCtrl
        })

        /* 客户管理 */
        .state("customers", {
            abstract: true,
            url: "/customers",
            template: '<div class="right-content"><ui-view></ui-view></div>',
            // templateUrl: "customers.html",
        })
        .state("customers.list", {
            url: "/list",
            abstract: true,
            template: '<ui-view></ui-view>'
        })
        .state("customers.list.all", {
            url: "/all",
            template: '<ad-user-customer-all></ad-user-customer-all>'
        })
        .state("customers.info", {
            url: "/:id/info",
            template: '<ad-user-customer-info></ad-user-customer-info>'
        })
        .state("customers.new", {
            url: "/new",
            templateUrl: "customerNew.html",
            controller: customerNewCtrl
        })
        .state("customers.collect", {
            abstract: true,
            url: "/collect",
            template: "<ui-view></ui-view>"
        })
        .state("customers.collect.list", {
            url: "/list",
            template: '<collect-customers></collect-customers>'
        })
        .state("customers.collect.info", {
            url: "/:id/info",
            template: '<ad-user-customer-info></ad-user-customer-info>'
        })

        /* 渠道管理 */
        .state("middle", {
            url: "/middle",
            template: '<div class="right-content"><ui-view></ui-view></div>'
            // templateUrl: "middle.html",
            // controller: function () {
                //rightHeight();
            // }
        })
        .state("middle.list", {
            url: "/list",
            template: "<ui-view></ui-view>"
        })
        .state("middle.list.all", {
            url: "/all",
            template: "<ad-user-channel-all></ad-user-channel-all>"
        })
        .state("middle.info", {
            url: "/:id/info",
            template: '<ad-user-channel-all-info></ad-user-channel-all-info>'
        })
        /* 收藏 */
        .state("middle.collect", {
            url: "/collect",
            template: '<ui-view></ui-view>',
            abstract: true
        })
        .state("middle.collect.list", {
            url:"/list",
            template: '<collect-middle></collect-middle>'
        })
        .state("middle.collect.info", {
            url: "/:id/info",
            template: '<ad-user-channel-all-info></ad-user-channel-all-info>'
        })
        .state("middle.new", {
            url: "/new",
            template: '<div class="col-sm-2"></div>' +
            '<div class="col-sm-8"><add-middle button-title="完成" source="1" middle-id="middleId" next-step="nextStep()"></add-middle></div>'+
            '<div class="col-sm-2"></div>' ,
            controller: function ($scope, $state) {
                $scope.nextStep = function () {
                    $state.go("middle.list.all");
                }
            }
        })
        .state("feedback", {
            url: "/feedback",
            template: '<user-feedback></user-feedback>'
        })
});

// 配置界面公共的控制器, 比如退出登录, 查看用户信息, 修改密码 (获取数据服务, 退出登录服务, 单击标题效果服务)
salesApp.controller("commonCtrl", function ($scope, queryData, signOut) {
    $scope.signOut = function () {
        signOut.out();
    };
    $scope.modify = function () {

    }
    //获取用户信息
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    $scope.userName = userInfo.name;
});

//菜单控制器
salesApp.controller("menuController", function ($scope, queryData, signOut) {
    $scope.menuOptions = [
        {
            name: '项目管理',
            imageName: '../common/images/project-manage.png',
            options: [
                {
                    name: '项目列表',
                    uiSref: "project.list"
                },
                {
                    name: '新建项目',
                    uiSref: "project.new"
                }
            ]
        },
        {
            name: '客户管理',
            imageName: '../common/images/client-manage.png',
            options: [
                {
                    name: '客户列表',
                    uiSref: "customers.list.all"
                },
                {
                    name: '添加客户',
                    uiSref: 'customers.new'
                }
            ]
        },
        {
            name: '渠道管理',
            imageName: '../common/images/middle-manage.png',
            options: [
                {
                    name: '渠道列表',
                    uiSref: 'middle.list.all'
                },
                {
                    name: '添加渠道',
                    uiSref: 'middle.new'
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

//状态控制器
function projectStatusCtrl($scope, queryData) {
    $scope.statusOptions = [
        {
            name: '所有',
            uiSref: "project.list.status({status: 0})"
        },
        {
            name: '未提交评估',
            uiSref: "project.list.status({status: 1})"
        },
        {
            'name': '评估中',
            uiSref: "project.list.status({status: 2})"
        },
        {
            'name': '待签约',
            uiSref: "project.list.status({status: 3})"
        },
        {
            'name': '督办中',
            uiSref: "project.list.status({status: 4})"
        },
        {
            'name': '已结项',
            uiSref: "project.list.status({status: 5})"
        },
        {
            'name': '退回补充材料',
            uiSref: "project.list.status({status: 6})"
        },
        {
            'name': '搁置项目',
            // 'num': 10,
            uiSref: "project.list.status({status: 7})"
        }
    ];

    //更新数据的方法
    $scope.updateStatusNum = function (projectNum) {
        $scope.statusOptions[1].num = projectNum.assessment;
        $scope.statusOptions[3].num = projectNum.sign;
        $scope.statusOptions[6].num = projectNum.return;
    };

    //请求数据,更新数目
    var sales_id = getUserInfo().user_id;
    queryData.getData('project_list/project_num', {sales_id: sales_id}).then(function (data) {
        $scope.updateStatusNum(data.data);
    });
}

// 选择客户信息的控制器
function selectClientInfoCtrl($scope, $rootScope, queryData, provinceCity, user, $state) {
    /**
     * 1. 设置默认值,配置富文本和分页
     */
    //配置分页
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    //初始化选中
    $scope.selectedIndex = sessionStorage.getItem(SaveNewProjectClientSourceTypeKey);
    if($scope.selectedIndex == undefined) {
        $scope.selectedIndex = 0;
    }

    /**
     * 2. 事件处理和网络请求
     */
    //查询客户列表信息
    function queryUsersInfo(page) {
        user.usersInfo({
            user_type: 'client',
            name: $scope.name,
            page: page
        }).then(function (data) {
            console.log(data);
            $scope.totalItems = data.data.maxRows;
            $scope.clientList = data.data.data;
            //设置默认选中的客户
            if($scope.clientList != undefined && $scope.clientList.length > 0 && page == 0) {
                $scope.clientId = $scope.clientList[0].user_id;
            }
        });
    }
    
    //选中用户事件
    $scope.selectClient = function (clientId) {
        $scope.clientId = clientId;
    };

    //查找下一页的客户
    $scope.pageChanged = function (page) {
        queryUsersInfo(page);
    };

    /**
     * 监听输入的姓名变化
     * 默认第一次会进行请求
     */
    $scope.$watch('name', function (name) {
        queryUsersInfo(0);
    });

    //选择方式, 0: 录入客户信息 1:从数据库选择
    $scope.selectIndex = function (index) {
        $scope.selectedIndex = index;
        sessionStorage.setItem(SaveNewProjectClientSourceTypeKey, index);
    };

    /**
     * 3. 填写客户的事件
     */
    // 表单提交按钮操作事项, 表单验证成功, 界面跳转
    $scope.nextStep = function () {
        //判断保存哪一个clientId
        if($scope.selectedIndex == 0) {
            sessionStorage.setItem(SaveNewProjectClientIdKey, $scope.newClientId);
        }
        else {
            sessionStorage.setItem(SaveNewProjectClientIdKey, $scope.clientId);
        }
        $state.go("project.new.middle");
    };
}

//新建项目,选择渠道信息
function selectMiddleCtrl($rootScope, $scope, user, provinceCity, middle, $state) {
    $scope.selectedIndex = sessionStorage.getItem(SaveNewProjectMiddleSourceTypeKey);
    if($scope.selectedIndex == undefined) {
        $scope.selectedIndex = 0;
        sessionStorage.setItem(SaveNewProjectMiddleSourceTypeKey, $scope.selectedIndex);
    }

    //选择方式, 0: 录入渠道信息 1:从数据库选择
    $scope.selectIndex = function (index) {
        $scope.selectedIndex = index;
        sessionStorage.setItem(SaveNewProjectMiddleSourceTypeKey, index);
    };
    /**
     * 1. 设置默认值,配置富文本和分页
     */
    //配置分页
    $scope.totalItems = 64;
    $scope.currentPage = 1;
    $scope.maxSize = 5;

    /**
     * 2. 选择渠道逻辑
     */
    //查询客户列表信息
    function queryUsersInfo(page) {
        user.usersInfo({
            user_type: 'middle',
            name: $scope.name,
            page: page
        }).then(function (data) {
            console.log(data)
            $scope.totalItems = data.data.maxRows;
            //渠道列表
            $scope.userList = data.data.data;
            //设置默认选中的客户
            if($scope.userList != undefined && page == 0) {
                //选择的用户id
                $scope.middleId = $scope.userList[0].user_id;
            }
        });
    }

    //默认请求第一页的客户
    queryUsersInfo(0);

    //选中用户事件
    $scope.selectUser = function (userId) {
        $scope.selectUserId = userId;
        //保存渠道id
        $scope.middleId = userId;
    };

    //点击查询按钮的事件
    $scope.queryUsers = function () {
        queryUsersInfo(0);
    };

    //查找下一页的用户
    $scope.pageChanged = function (page) {
        queryUsersInfo(page);
    };

    //监听姓名
    $scope.$watch('name', function (name) {
        queryUsersInfo(0);
    });

    /**
     * 3. 添加渠道
     */

    //下一步
    $scope.nextStep = function () {
        if($scope.selectedIndex == 0) {
            sessionStorage.setItem(SaveNewProjectMiddleIdKey, $scope.newMiddleId);
        }
        else {
            sessionStorage.setItem(SaveNewProjectMiddleIdKey, $scope.middleId);
        }
        //添加成功,跳转到下一个页面
        $state.go("project.new.case");
    };

    //跳过
    $scope.skipStep = function () {
        sessionStorage.removeItem(SaveNewProjectMiddleIdKey);
        $state.go("project.new.case");
    };
}

//新建项目填写案件信息控制器
function fillInCaseCtrl($scope, projectOperate, client, middle, toast) {
    /**
     * 1. 设置默认值和配置富文本
     */
    var caseInfo = getObjectFromSessionStorage(SaveCaseInfoKey);
    if(caseInfo == undefined) {
        $scope.case = {
            middle_apply: 0
        };
    }
    else {
        $scope.case = caseInfo;
    }

    /**
     * 2. 事件处理
     */
    //点击完成 触发  富文本无内容提示(边框变红)
    $scope.changeColor = function () {
        if($scope.case.goals=='' || $scope.case.goals == undefined){
            $('#caseGoals').css({'border-color':'red'});
        }
        //监听内容  有内容时取消红色边框
        $scope.$watch('case.goals', function () {
            if($scope.case.goals=='' || $scope.case.goals == undefined){
                $('#caseGoals').css({'border-color':'red'});
            }else{
                $('#caseGoals').css({'border-color':'white'});
            }
        });
    };

    //监听case, 并保存
    $scope.$watch('case', function (caseInfo) {
        saveObjectToSessionStorage(SaveCaseInfoKey, caseInfo);
    }, true);

    /**
     * 3. 项目创建完成
     */

    //点击完成
    $scope.complete = function (caseInfo) {
        caseInfo.middle_id = sessionStorage.getItem(SaveNewProjectMiddleIdKey);
        caseInfo.client_id = sessionStorage.getItem(SaveNewProjectClientIdKey);
        console.log(caseInfo);
        //添加项目
        projectOperate.add(caseInfo).then(function (data) {
            //删除添加项目一路添加的session信息
            sessionStorage.removeItem(SaveCaseInfoKey);
            sessionStorage.removeItem(SaveClientInfoKey);
            sessionStorage.removeItem(SaveMiddleInfoKey);
            sessionStorage.removeItem(SaveNewProjectClientIdKey);
            sessionStorage.removeItem(SaveNewProjectMiddleIdKey);
            sessionStorage.removeItem(SaveNewProjectClientSourceTypeKey);
            sessionStorage.removeItem(SaveNewProjectMiddleSourceTypeKey);

            console.log(data);
            window.location = '#'
        });
    };

    //选择是否是渠道律师
    $scope.selectMiddleType = function (value) {
        console.log("选择是否渠道律师");
        $scope.case.middle_apply = value;
    };
}

//添加客户控制器
function customerNewCtrl($scope, $state) {
    $scope.nextStep = function () {
        //跳转到列表页面
        $state.go("customers.list.all");
    }
}
