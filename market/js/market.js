var marketApp = angular.module("marketApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "ngFileUpload", "mix.service", "mix.directive", "mix.filter", "byComponent", 'angular-loading-bar']);

// 配置表单验证
marketApp.config(function (w5cValidatorProvider) {
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
marketApp.config(configuredLoadingBar);


// 路由控制
marketApp.config(function ($stateProvider, $urlRouterProvider) {
    //项目评估信息重定向
    $urlRouterProvider.when('/project/detail/:id/evaluate', ['$match', '$stateParams', function ($match, $stateParams) {
        return '/project/detail/'+$urlRouterProvider.$stateParams.id+'/evaluate/analyst'
    }]);
    $urlRouterProvider.otherwise("/project/list/待分析");
    $stateProvider
    // 我的案件
        .state("project", {
            abstract: true,
            templateUrl: '../common/templates/mainContent.html',
            url: "/project",
            controller: menuController
        })
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
marketApp.controller("commonCtrl", function ($scope, queryData, signOut) {
    $scope.signOut = function () {
        signOut.out();
    };
    //获取用户信息
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    $scope.userName = userInfo.name;

    rightHeight();
});
//菜单控制器
function menuController($scope, signOut, projectList, num) {
    $scope.menuOptions = [
        {
            name: '项目管理',
            imageName: '../common/images/project-manage.png',
            options: [
                {
                    name: '所有',
                    uiSref: "project.list({status: '所有'})"
                },
                {
                    name: '待分析',
                    uiSref: "project.list({status: '待分析'})"
                },
                {
                    name: '销售补充材料中',
                    uiSref: "project.list({status: '销售补充材料中'})"
                },
                {
                    name: '已分析',
                    uiSref: "project.list({status: '已分析'})"
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

    //请求数量
    num.analyst().then(function (data) {
        console.log(data);
        $scope.menuOptions[0].options[1].num = data.data.analyst;
    });

}

// 项目列表
function projectListCtrl($state, $scope, queryData, $stateParams) {
    //点击完成 触发  富文本无内容提示(边框变红)
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

    //初始化分页
    $scope.maxSize = 5;
    $scope.currentPage = 1;

    //获取登陆者信息
    var userInfo = getUserInfo();
    var userType = userInfo.type;
    var user_id = userInfo.user_id;
    
    //请求分析师数据
    function queryAnalystData() {
        queryData.getData('project_list/analyst',{
            analyst_id: user_id,
            page: $scope.currentPage,
            status: $stateParams.status,
            pageSize: 9
        }).then(function (data) {
            console.log(data);
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

            //给最大页数
            $scope.totalItems = data.data.maxRows;
            $scope.infos = data.data.data;
        });
    }
    //默认第一请求所有数据
    queryAnalystData();

    //点击分页
    $scope.pageChanged = function (page,status) {
        queryAnalystData();
    };
    
    //注入数据数据
    $scope.analyst = function (num) {
        $scope.project_id = num;
        // queryData.getData('project_operate/analyst_draft',{analyst_id:user_id,project_id: num}).then(function (data) {
        //     console.log(data);
        //     $scope.dispute = data.data[0].dispute;
        //     $scope.party_info = data.data[0].party_info;
        //     $scope.money = parseInt(data.data[0].money);
        //     $scope.disputes_basis = data.data[0].disputes_basis;
        //     $scope.court = data.data[0].court;
        //     $scope.limitation = data.data[0].limitation;
        //     $scope.result = data.data[0].result;
        //     $scope.suggestion = data.data[0].suggestion;
        // })
    };
    /*//保存草稿
    $scope.saveDraft = function (dispute,party_info,money,disputes_basis,court,limitation,result,suggestion) {
        var params = {
            analyst_id: user_id,
            project_id: $scope.project_id,
            dispute: dispute,
            party_info: party_info,
            money: money,
            disputes_basis: disputes_basis,
            court: court,
            limitation: limitation,
            result: result,
            suggestion: suggestion
        };
        queryData.postData('project_operate/analyst_draft',params).then(function (data) {
            console.log(params);
            if(data.status == true){
                console.log('成功');
            }
        });
    };
    //提交分析
    $scope.submitAnalyst = function (dispute,party_info,money,disputes_basis,court,limitation,result,suggestion) {
        var params = {
            analyst_id: user_id,
            project_id: $scope.project_id,
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
    };*/
    //提交材料
    $scope.uploadfile = function (num) {
        $scope.project_id = num;
    };
    $scope.submitMaterial = function (detail) {
        var params = {
            analyst_id: user_id,
            project_id: $scope.project_id,
            detail: detail
        };
        console.log(params);

        queryData.putData("project_operate/analyst_back",params).then(function (data) {
            if(data.status == true){
                console.log(data);
                $('#uploadfile').on('hidden.bs.modal', function () {
                    //刷新
                    $state.reload();
                });
                $('#uploadfile').modal('hide');
            }else {
                alert(data.message);
            }
        });
    };

    //点击项目,跳入详情页面
    $scope.clickProject = function (project) {
        console.log(project);
        //存储项目名称
        sessionStorage.setItem(SelectProjectName, project.name);
        //存储当前项目状态
        sessionStorage.setItem(SelectProjectStatus, project.num_status);
        //window.location.href = "#/project/detail/" + project.num + "/info"
    };
    $('body').on('click', '.clickProject' ,function(){
        var self = $(this);
        var win = window.open(self.attr('data-url'), "_blank");
    });
}












