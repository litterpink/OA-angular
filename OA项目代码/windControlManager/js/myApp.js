var myApp = angular.module("myApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "ngFileUpload", "mix.service", "mix.directive", "mix.filter", "byComponent", 'angular-loading-bar']);

// 配置表单验证
myApp.config(function (w5cValidatorProvider) {
    var getParentGroup = function (elem) {
        if (elem[0].tagName === "FORM" || elem[0].nodeType == 11) {
            return null;
        }
        if (elem && elem.hasClass("form-group")) {
            return elem;
        } else {
            return getParentGroup(elem.parent());
        }
    };
    function isEmpty (object) {
        if (!object) {
            return true;
        }
        if (object instanceof Array && object.length === 0) {
            return true;
        }
        return false;
    };

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
        suggestion: {
            required: "综合意见不能为空"
        }
    });
});

//配置loading
myApp.config(configuredLoadingBar);

// 路由控制
myApp.config(function ($stateProvider, $urlRouterProvider) {
    //项目评估信息重定向
    $urlRouterProvider.when('/project/detail/:id/evaluate', ['$match', '$stateParams', function ($match, $stateParams) {
        return '/project/detail/'+$urlRouterProvider.$stateParams.id+'/evaluate/analyst'
    }]);
    $urlRouterProvider.otherwise("/project/list/风控经理评估中");
    $stateProvider
    // 案件
        .state("project", {
            abstract: true,
            templateUrl: '../common/templates/mainContent.html',
            url: "/project",
            controller: menuController
        })
        //列表
        .state("project.list", {
            url: "/list/:status",
            templateUrl: "projectList.html",
            controller: projectListCtrl
        })
        .state("project.detail", {
            url: "/detail/:id",
            template: '<project-detail></project-detail>'
        })
        // 进度 评估信息 项目信息 参与人员 文件 控制器, 加载公共模板
        .state("project.detail.speed", {
            url:"/speed",
            template: '<project-speed></project-speed>',
        })
        .state("project.detail.evaluate", {
            url: "/evaluate",
            template: '<project-evaluate></project-evaluate>'
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
        .state("project.feedback", {
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
function menuController($scope, queryData, signOut, num) {
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
                    name: '评估中项目',
                    uiSref: "project.list({status: '风控经理评估中'})"
                },
                {
                    name: '销售补充材料中项目',
                    uiSref: "project.list({status: '销售补充材料中'})"
                },
                {
                    name: '已评估项目',
                    uiSref: "project.list({status: '已评估'})"
                }
            ]
        },
        {
            name: '意见反馈',
            imageName: '../common/images/feedback.png',
            uiSref: 'project.feedback',
            selectedImageName: '../common/images/feedback_select.png',
        }
    ];

    num.controller().then(function (data) {
        console.log(data);
        $scope.menuOptions[0].options[1].num = data.data.controller;
    });
};

function projectListCtrl($state, $scope, queryData, $stateParams) {
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

    //获取登陆者信息
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    var userType = userInfo.type;
    var user_id = userInfo.user_id;

    //初始化分页
    $scope.maxSize = 5;
    $scope.currentPage = 1;

    //请求风控经理案件
    function queryControllerData() {
        queryData.getData('project_list/controller',{
            controller_id: user_id,
            page: $scope.currentPage,
            status: $stateParams.status,
            page_size: 9
        }).then(function (data) {
            console.log(data);
            $scope.infos = data.data.data;
            $scope.totalItems = data.data.maxRows;
        });
    }

    //请求风控经理所有案件
    queryControllerData();

    //点击分页
    $scope.pageChanged = function (page) {
        queryControllerData();
    };

    /*
     *
     *
     * 各种状态修改
     *
     *
     */
    //评估
    $scope.assessment = function (num) {
        $scope.project_id = num;
        //获取草稿
        queryData.getData('project_operate/controller_draft',{controller_id: user_id,project_id: num}).then(function (data) {
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
            project_id: $scope.project_id,
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
            if(data.status == true){
                console.log('保存成功');
            }
        });
    };
    //提交评估
    $scope.submitAssessment = function (money,risk,property,client_ability,lawyers,lawyer_fee,official_fee,travel_expense,payment_time,payment_money,judicial,result,suggestion) {
        var params = {
            project_id: $scope.project_id,
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
            //评估完成,跳转到所有页面
            hideModal('assessment', function () {
                $state.go('project.list', {
                    status: '所有'
                }, {
                    reload: true
                });
            });
        });
    };
    //退回补充材料
    $scope.return = function (num) {
        $scope.project_id = num;
    };
    var moving = false;
    $scope.submitBack = function (detail) {
        //如果正在移动, 直接结束
        if(moving) {
            return;
        }
        //标识正在移动
        moving = true;
        var params = {
            project_id: $scope.project_id,
            controller_id: user_id,
            detail: detail
        };
        console.log(params);
        queryData.putData("project_operate/controller_back",params).then(function (data) {
            //退回材料完成,跳转到所有页面
            hideModal('return', function () {
                $state.go('project.list', {
                    status: '所有'
                }, {
                    reload: true
                });
            });
            moving = false;
        });
    };

    //点击项目,跳入详情页面
    $scope.clickProject = function (project) {
        //存储项目名称
        sessionStorage.setItem(SelectProjectName, project.name);
        //window.location.href = "#/project/detail/" + project.num + "/info"
    };
    $('body').on('click', '.clickProject' ,function(){
        var self = $(this);
        var win = window.open(self.attr('data-url'), "_blank");
    });
}
















