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
    $urlRouterProvider.otherwise("/project/list/待处理");
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
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
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
                    name: '待处理项目',
                    uiSref: "project.list({status: '待处理'})"
                },
                {
                    name: '销售补充材料中项目',
                    uiSref: "project.list({status: '销售补充材料中'})"
                },
                {
                    name: '待签约项目',
                    uiSref: "project.list({status: '待签约'})"
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

    num.controllerDirector().then(function (data) {
        console.log(data);
        $scope.menuOptions[0].options[1].num = data.data.cd;
    });
};

function projectListCtrl($state, $scope, queryData, Upload, $stateParams,toast) {
    //点击完成 触发  富文本无内容提示(边框变红)
    $scope.changeColor = function () {
        //1.监听内容  有内容时取消红色边框

        $('#suggestionColor').css({'border-color': 'white'});

        $scope.$watch('suggestion', function () {
            if ($scope.suggestion == '' || $scope.suggestion == undefined) {
                $('#suggestionColor').css({'border-color': 'red'});
            } else {
                $('#suggestionColor').css({'border-color': 'white'});
            }
        });
        //2.监听内容  有内容时取消红色边框

        $('#suggestionColor2').css({'border-color': 'white'});

        $scope.$watch('suggestion2', function () {
            if ($scope.suggestion2 == '' || $scope.suggestion2 == undefined) {
                $('#suggestionColor2').css({'border-color': 'red'});
            } else {
                $('#suggestionColor2').css({'border-color': 'white'});
            }
        });
        //2.监听内容  有内容时取消红色边框

        $('#result').css({'border-color': 'white'});

        $scope.$watch('result', function () {
            if ($scope.result == '' || $scope.result == undefined) {
                $('#result').css({'border-color': 'red'});
                $('#result2').css({'border-color': 'red'});
            } else {
                $('#result').css({'border-color': 'white'});
                $('#result2').css({'border-color': 'white'});
            }
        });
    };

    //获取登陆者信息
    var userInfo = getUserInfo();
    var userType = userInfo.type;
    var user_id = userInfo.user_id;
    var moving = false;

    //初始化分页信息
    $scope.maxSize = 5;
    $scope.currentPage = 1;

    //请求项目列表数据
    function queryControlDirectorData() {
        queryData.getData('project_list/cd', {
            page: $scope.currentPage,
            status: $stateParams.status,
            pageSize: 9,
            cd_id: user_id
        }).then(function (data) {
            console.log(data);
            $scope.infos = data.data.data;
            $scope.totalItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;
        });
    }

    //获取所有项目信息
    queryControlDirectorData();

    //点击分页
    $scope.pageChanged = function (page, status) {
        queryControlDirectorData();
    };

    //获取所有风控经理
    queryData.getData('user/staff_brief', {type: 93}).then(function (data) {
        if (data.status == true) {
            //console.log(data);
            $scope.persons = data.data.data;

            $scope.maxItems2 = data.data.maxRows;
            $scope.maxPage2 = data.data.maxPage;

            // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
            $scope.maxSize2 = 5; // 显示最大页数
            $scope.bigTotalItems2 = $scope.maxItems2;
            $scope.bigCurrentPage2 = 1;
        } else {
            alert(data.message);
        }
    });
    //点击分页
    $scope.pageChanged2 = function (page) {
        var params = {
            page: page,
            type: 93
        };
        console.log(params);
        queryData.getData('user/staff_brief', params).then(function (data) {
            console.log(data);
            $scope.persons = data.data.data;
            $scope.maxItems2 = data.data.maxRows;
            $scope.maxPage2 = data.data.maxPage;
        });
    };


    /*
     *
     *
     * 各种状态修改
     *
     *
     */
    //指派
    $scope.analyst = function (num) {
        $scope.project_id = num;
    };
    $scope.submitAnalyst = function (controller_id) {
        var params = {
            cd_id: user_id,
            controller_id: controller_id,
            project_id: $scope.project_id
        };
        if (controller_id == '' || controller_id == undefined) {
            toast.show('请选择风控经理')
        } else {
            console.log(params);
            queryData.putData("project_operate/appoint_controller", params).then(function (data) {
                //进入所有案件列表
                hideModal('analyst', function () {
                    $state.go('project.list', {
                        status: '所有'
                    }, {
                        reload: true
                    });
                });
            });
        }
    };
    //评估
    $scope.assessment = function (num) {
        $scope.project_id = num;
    };
    //提交评估
    $scope.submitAssessment = function (suggestion, result) {
        var params = {
            project_id: $scope.project_id,
            cd_id: user_id,
            result: result,
            suggestion: suggestion
        };
        queryData.postData("project_operate/cd_eval", params).then(function (data) {
            //进入所有案件列表
            hideModal('assessment', function () {
                $state.go('project.list', {
                    status: '所有'
                }, {
                    reload: true
                });
            });
        });
    };
    //复议
    $scope.reconsideration = function (num) {
        $scope.project_id = num;
    };
    $scope.submitReconsideration = function (suggestion, result) {
        var params = {
            project_id: $scope.project_id,
            cd_id: user_id,
            result: result,
            suggestion: suggestion
        };
        queryData.postData("project_operate/cd_reconsider", params).then(function (data) {
            //进入所有案件列表
            hideModal('reconsideration', function () {
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
    $scope.submitBack = function (detail) {
        var params = {
            project_id: $scope.project_id,
            cd_id: user_id,
            detail: detail
        };
        queryData.putData("project_operate/cd_back", params).then(function (data) {
            //进入所有案件列表
            hideModal('return', function () {
                $state.go('project.list', {
                    status: '所有'
                }, {
                    reload: true
                });
            });
        });
    };
    //上传风控委员会会议纪要
    $scope.uploadfile = function (num, status) {
        $scope.project_id = num;
        $scope.isStatus = status;
        console.log(num, status);
    };
    $scope.submitUploadfile = function (result, uploadUrls) {
        if (moving) {
            return;
        }
        moving = true;

        if (!uploadUrls || !uploadUrls.length) {
            toast.show('请上传文件');
            moving = false;
            return;
        }
        var params = {
            project_file_type: 4,
            project_id: $scope.project_id,
            module_id: 0,
            upload_user: user_id,
            type: 1,
            file_info: uploadUrls
        };
        console.log(params);
        queryData.postData("file/file", params).then(function (data) {
            console.log(data);
            var params = {
                project_id: $scope.project_id,
                cd_id: user_id,
                result: result
            };
            console.log(params, $scope.isStatus);
            if ($scope.isStatus == "风控委员会复议中") {
                queryData.postData("project_operate/committee_reconsider", params).then(function (data) {
                    console.log(data);
                    console.log("风控委员会复议修改成功");
                });
            }else if ($scope.isStatus == "风控委员会评估中") {
                queryData.postData("project_operate/committee_eval", params).then(function (data) {
                    console.log(data);
                    console.log("风控委员会评估修改成功");
                });
            } else {
                toast.show("风控委员会复议/评估状态修改失败");
            }
            $('#uploadfile').on('hidden.bs.modal', function () {
                //刷新当前组件
                $state.reload();
            });
            $('#uploadfile').modal('hide');
            moving = false;
        });
        //提交风控委员会
        $scope.review = function (num) {
            if (moving) {
                return
            }
            moving = true;
            $scope.submitReview = function () {
                var params = {
                    project_id: num,
                    cd_id: user_id
                };
                queryData.putData("project_operate/submit_committee", params).then(function (data) {
                    //提交委员会,刷新当前页面
                    hideModal('review', function () {
                        $state.reload();
                    });
                    moving = false;
                });
            }
        };


        //点击项目,跳入详情页面
        $scope.clickProject = function (project) {
            //存储项目名称
            sessionStorage.setItem(SelectProjectName, project.name);
            window.location.href = "#/project/detail/" + project.num + "/speed"
        };

    }
}














