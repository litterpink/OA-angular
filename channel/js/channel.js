var channelApp = angular.module("channelApp", ["ui.router", "ui.bootstrap", "angularTrix", "w5c.validator", "ngFileUpload", "mix.service", "mix.directive", "mix.filter", "angular-loading-bar"]);
// 配置界面公共的控制器, 比如退出登录, 查看用户信息, 修改密码 (获取数据服务, 退出登录服务, 单击标题效果服务)
channelApp.controller("commonCtrl", function ($scope, queryData, signOut) {
    $scope.signOut = function () {
        signOut.out();
        //获取用户信息
    };
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    $scope.userName = userInfo.name;
});
// 配置表单验证
channelApp.config(function (w5cValidatorProvider) {
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
// 路由控制
channelApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/mycase");
    $stateProvider
    // 我的案件
        .state("mycase", {
            url: "/mycase",
            templateUrl: "mycase.html",
            controller: mycaseCtrl
        })
        // 我的案件
        .state("info", {
            url: "/mycase/info/:id",
            templateUrl: "mycaseInfo.html",
            controller: mycaseInfoCtrl
        })

});
//配置loading
channelApp.config(configuredLoadingBar);
// 我的案件
function mycaseCtrl($scope,queryData) {
    //获取登陆者信息
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    var userType = userInfo.type;
    var user_id = userInfo.user_id;
    //获取所有列表信息
    queryData.getData('project_list/cd').then(function (data) {
        console.log(data);
        if(data.status == true){
            $scope.infos = data.data.data;

            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;

            // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
            $scope.maxSize = 5; // 显示最大页数
            $scope.bigTotalItems = $scope.maxItems;
            $scope.bigCurrentPage = 1;
        }else {
            alert(data.message);
        }
    });
}
function mycaseInfoCtrl($scope,queryData) {

}










