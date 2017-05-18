// 定义控制器
myapp.config(function ($httpProvider,w5cValidatorProvider) {
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
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
});
// 因为路由占用了#,所以要使用锚点链接,就需要如下操作,$anchorScroll
myapp.controller("aboutCtrl", function ($scope, $location, $anchorScroll) {
    $scope.goto = function (id) {
        $location.hash(id);
        $anchorScroll();
    }
});
myapp.controller("commonCtrl", function ($scope) {

});
// 自定义指令, 鼠标经过新闻条目效果
myapp.directive("hover", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("mouseover", function () {
                element.css("background", "#eee");
            });
            element.bind("mouseout", function () {
                element.css("background", "#fff");
            })
        }
    }
});

// 客户留言
myapp.controller("clientCtrl", function ($scope, $http, ngDialog) {
    $scope.name = "";
    $scope.phone = "";
    $scope.comments = "";
    $scope.checkPhone = "";
    $scope.subClient = function () {
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        if (reg.test($scope.phone)) {
            //{params: {params}}
            if ($scope.name == "") {
                $scope.error = "姓名不能为空";
            }
            else {
                var data = {
                    name: $scope.name,
                    phone: $scope.phone,
                    comments: $scope.comments
                };
                console.log(data);
                $http.post(ServerURL + "enter/client", data).success(function (data) {
                    console.log(data.status);
                    sessionStorage.setItem("status", data.status);
                    window.location.href = "jump.html";
                    console.log(data);
                });
            }
        }
        else {
            $scope.error = "手机号码格式错误";
        }
    }

});

// 新闻信息
myapp.controller("newCtrl", function ($scope, $http, ngDialog) {
    // $http.get(url + "enter/news").success(function (data) {
    //     $scope.data = data.data.data;
    //     console.log(data);
    // });
});

// 律师入驻
myapp.controller("inputLawyerCtrl", function ($scope, $http, Upload, queryData, $interval, ngDialog,provinceCity,toast) {
    /**
     * 1. 设置默认值
     */
    $http.get("../common/json/year.json").success(function (data) {
        $scope.yearList = data;
    });


    var self = this;
    /*$scope.$watch('lawyer',function () {
        console.log($scope.lawyer);
        console.log($scope.lawyer.school);
        console.log($scope.lawyer.remarks);
    },true);*/

    // 设置默认值
    $scope.lawyer = {
        name:'',
        province:'',
        firm:'',
        position: "",
        practice_area: "",


        sex: '',
        level: '',
        city: '',
        birth:'',
        input_mode: "3",
        country: "中国",

        income: "",
        team_scale: "",
    };

    /* 写到各自的控制器中,要不然一次付给好多court种 */
    /* 搜索到法院,单击赋值 */
    $scope.changeVal = function (newVal, pro) {
        console.log(newVal);
        $scope.searchVal = newVal;
        $scope.court.court = newVal;
        $scope.matchingprovince = pro;
        $(".resultList").hide();
    };

    $scope.showList = function () {
        $(".resultList").show();
        $(".search").focus();
        $scope.searchVal = "";
    };

    $scope.judicial_type = "1";
    $scope.court = {
        start_time_month: '0',
        end_time_month: '0',
    };
    $scope.procuratorate = {
        start_time_month: '0',
        end_time_month: '0'
    };
    $scope.police = {
        start_time_month: '0',
        end_time_month: '0'
    };
    $scope.arbitration = {
        start_time_month: '0',
        end_time_month: '0'
    };
    $scope.selectLawyerType = function (type) {
        $scope.judicial_type = type;
    };

    /**
     * 2. 获取省市联动
     */
    provinceCity.province().then(function (data) {
        // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
        $scope.province = data;
        $scope.city = data[0].cities;

        // 省份改变的时候, 选择相应的市
        $scope.provinceChange = function () {
            for (var i = 0; i < data.length; i++) {
                // 判断如果配置选中的省份,然后获取对应的市的数组
                if (data[i].name == $scope.lawyer.province) {
                    $scope.city = data[i].cities;
                    // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
                    $scope.lawyer.city = data[i].cities[0];
                }
            }
            if($scope.lawyer.province == '' || $scope.lawyer.province == undefined){
                $scope.lawyer.city = '';
            }
        }
    });

    /**
     * 3. 事件处理
     */


    /**
     * 关闭取消
     */
    $scope.cancelSubmit = function () {
        self.cancel();
    };
    /**
     *控制显示和隐藏
     */
    $('#partOne').show();
    $('#partTwo').hide();
    $('#partThree').hide();
    $('#partFour').hide();
    $('#partFive').hide();
    $scope.nextOne = function () {
        $('#partOne').hide();
        $('#partTwo').show();
        $('#partThree').hide();
        $('#partFour').hide();
        $('#partFive').hide();

        $('.spanEle2,.blueSolid1').css({backgroundColor: '#3085f1'});
        $('.liEle2').css({color: '#3085f1'});
    };
    $scope.nextTwo = function () {
        $('#partOne').hide();
        $('#partTwo').hide();
        $('#partThree').show();
        $('#partFour').hide();
        $('#partFive').hide();

        $('.spanEle2,.spanEle3').css({backgroundColor: '#3085f1'});
        $('.blueSolid1,.blueSolid2').css({backgroundColor: '#3085f1'});
        $('.liEle2,.liEle3').css({color: '#3085f1'});
    };
    $scope.nextThree= function () {
        var lawyerEx = {};
        //法院
        if ($scope.judicial_type == "1") {
            lawyerEx.judicial_type = "法院";
            lawyerEx.court = $scope.court.court;
            lawyerEx.start_time = $scope.court.start_time_year +'/'+ $scope.court.start_time_month+'/0';
            lawyerEx.end_time = $scope.court.end_time_year +'/'+ $scope.court.end_time_month+'/0';
            lawyerEx.job_duty = $scope.court.job_duty;

            lawyerEx.case_type = $scope.court.case_type;
            lawyerEx.court_level = $scope.court.court_level;
        }
        //检察院
        else if ($scope.judicial_type == "2") {
            lawyerEx.judicial_type = "检察院";
            lawyerEx.procuratorate = $scope.procuratorate.procuratorate;
            lawyerEx.start_time = $scope.procuratorate.start_time_year+'/' + $scope.procuratorate.start_time_month+'/0';
            lawyerEx.end_time = $scope.procuratorate.end_time_year+'/' + $scope.procuratorate.end_time_month+'/0';
            lawyerEx.job_duty = $scope.procuratorate.job_duty;
        }
        //警察
        else if ($scope.judicial_type == "3") {
            lawyerEx.judicial_type = "公安";
            lawyerEx.police = $scope.police.police;
            lawyerEx.start_time = $scope.police.start_time_year+'/' + $scope.police.start_time_month+'/0';
            lawyerEx.end_time = $scope.police.end_time_year +'/'+ $scope.police.end_time_month+'/0';
            lawyerEx.level = $scope.police.level;
        }
        //仲裁机构
        else if ($scope.judicial_type == "4"){
            lawyerEx.judicial_type = "仲裁机构";
            lawyerEx.organi_name = $scope.arbitration.police;
            lawyerEx.start_time = $scope.arbitration.start_time_year +'/'+ $scope.arbitration.start_time_month+'/0';
            lawyerEx.end_time = $scope.arbitration.end_time_year +'/'+ $scope.arbitration.end_time_month+'/0';
            lawyerEx.job_duty = $scope.arbitration.level;

        }
        if($scope.court.court != undefined || $scope.procuratorate.procuratorate != undefined || $scope.police.police != undefined || $scope.arbitration.police != undefined){
            var startTimeY = (lawyerEx.start_time.split('/'))[0];
            var startTimeM = (lawyerEx.start_time.split('/'))[0];
            var endtTimeY = (lawyerEx.end_time.split('/'))[0];
            var endtTimeM = (lawyerEx.end_time.split('/'))[0];
            if(startTimeY == 'undefined' || endtTimeY == 'undefined'){
                lawyerEx.showTime = false;
            }else {
                lawyerEx.showTime = true;
            }
            if(startTimeY != 'undefined' && endtTimeY != 'undefined'){
                if(startTimeY > endtTimeY){
                    toast.show('开始时间不能大于结束时间');
                }else {
                    $scope.experience.push(lawyerEx);
                    $scope.court = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                    $scope.procuratorate = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                    $scope.police = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                    $scope.arbitration = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                }
            }
            if(startTimeY == 'undefined' && endtTimeY == 'undefined'){
                $scope.experience.push(lawyerEx);
                $scope.court = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.procuratorate = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.police = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.arbitration = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
            }
        }else {

        }



        if($scope.experience != 0){
            $('#partOne').hide();
            $('#partTwo').hide();
            $('#partThree').hide();
            $('#partFour').show();
            $('#partFive').hide();
            $('.spanEle2,.spanEle3,.spanEle4').css({backgroundColor: '#3085f1'});
            $('.blueSolid1,.blueSolid2,.blueSolid3').css({backgroundColor: '#3085f1'});
            $('.liEle2,.liEle3,.liEle4').css({color: '#3085f1'});
        }


        console.log($scope.experience);




    };
    //没有相关经历,跳过
    $scope.jumpNext = function () {
        $('#partOne').hide();
        $('#partTwo').hide();
        $('#partThree').hide();
        $('#partFour').show();
        $('#partFive').hide();

        $('.spanEle2,.spanEle3,.spanEle4').css({backgroundColor: '#3085f1'});
        $('.blueSolid1,.blueSolid2,.blueSolid3').css({backgroundColor: '#3085f1'});
        $('.liEle2,.liEle3,.liEle4').css({color: '#3085f1'});

        $scope.experience = [];
        console.log($scope.experience);
    };
    $scope.nextFour = function () {

        var lawyer = $scope.lawyer;
        lawyer.experience = $scope.experience;

        /*if(!lawyer.name) {
         toast.show("请输入律师的姓名");
         return;
         }
         if(!lawyer.phone) {
         toast.show("请输入律师的手机号");
         return;
         }
         if(!lawyer.firm) {
         toast.show("请输入律师的单位");
         return;
         }*/
       /* queryData.postData("User_lawyer/lawyer", lawyer).then(function (data) {
            self.lawyerId = data.data.user_id;

            if(self.embedModal) {
                setTimeout(function () {
                    console.log("完成");
                    //完成回调
                    self.complete();
                }, 10);
            }
            else {
                $('#partOne').hide();
                $('#partTwo').hide();
                $('#partThree').hide();
                $('#partFour').hide();
                $('#partFive').show();

                $('.spanEle2,.spanEle3,.spanEle4,.spanEle5').css({backgroundColor: '#3085f1'});
                $('.blueSolid1,.blueSolid2,.blueSolid3,.blueSolid4').css({backgroundColor: '#3085f1'});
                $('.liEle2,.liEle3,.liEle4,.liEle5').css({color: '#3085f1'});

                toast.show("添加律师成功", 500, function () {
                    //window.location.href = "#/user/lawyer/all";
                });
            }
        });*/
        console.log(lawyer);
    };
    /*点击添加从业经历*/
    $scope.experience = [];
    $scope.addExperience = function (lawyerEx) {
        var lawyerEx = {};
        //法院
        if ($scope.judicial_type == "1") {
            lawyerEx.judicial_type = "法院";
            lawyerEx.court = $scope.court.court;
            lawyerEx.start_time = $scope.court.start_time_year +'/'+ $scope.court.start_time_month+'/0';
            lawyerEx.end_time = $scope.court.end_time_year +'/'+ $scope.court.end_time_month+'/0';
            lawyerEx.job_duty = $scope.court.job_duty;

            lawyerEx.case_type = $scope.court.case_type;
            lawyerEx.court_level = $scope.court.court_level;
        }
        //检察院
        else if ($scope.judicial_type == "2") {
            lawyerEx.judicial_type = "检察院";
            lawyerEx.procuratorate = $scope.procuratorate.procuratorate;
            lawyerEx.start_time = $scope.procuratorate.start_time_year+'/' + $scope.procuratorate.start_time_month+'/0';
            lawyerEx.end_time = $scope.procuratorate.end_time_year+'/' + $scope.procuratorate.end_time_month+'/0';
            lawyerEx.job_duty = $scope.procuratorate.job_duty;
        }
        //警察
        else if ($scope.judicial_type == "3") {
            lawyerEx.judicial_type = "公安";
            lawyerEx.police = $scope.police.police;
            lawyerEx.start_time = $scope.police.start_time_year+'/' + $scope.police.start_time_month+'/0';
            lawyerEx.end_time = $scope.police.end_time_year +'/'+ $scope.police.end_time_month+'/0';
            lawyerEx.level = $scope.police.level;
        }
        //仲裁机构
        else if ($scope.judicial_type == "4"){
            lawyerEx.judicial_type = "仲裁机构";
            lawyerEx.organi_name = $scope.arbitration.police;
            lawyerEx.start_time = $scope.arbitration.start_time_year +'/'+ $scope.arbitration.start_time_month+'/0';
            lawyerEx.end_time = $scope.arbitration.end_time_year +'/'+ $scope.arbitration.end_time_month+'/0';
            lawyerEx.job_duty = $scope.arbitration.level;

        }

        if($scope.court.court != undefined || $scope.procuratorate.procuratorate != undefined || $scope.police.police != undefined || $scope.arbitration.police != undefined){
            var startTimeY = (lawyerEx.start_time.split('/'))[0];
            var startTimeM = (lawyerEx.start_time.split('/'))[0];
            var endtTimeY = (lawyerEx.end_time.split('/'))[0];
            var endtTimeM = (lawyerEx.end_time.split('/'))[0];
            if(startTimeY == 'undefined' || endtTimeY == 'undefined'){
                lawyerEx.showTime = false;
            }else {
                lawyerEx.showTime = true;
            }
            if(startTimeY != 'undefined' && endtTimeY != 'undefined'){
                if(startTimeY > endtTimeY){
                    toast.show('开始时间不能大于结束时间');
                }else {
                    $scope.experience.push(lawyerEx);
                    $scope.court = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                    $scope.procuratorate = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                    $scope.police = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                    $scope.arbitration = {
                        start_time_month: '0',
                        end_time_month: '0'
                    };
                }
            }
            if(startTimeY == 'undefined' && endtTimeY == 'undefined'){
                $scope.experience.push(lawyerEx);
                $scope.court = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.procuratorate = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.police = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.arbitration = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
            }

        }else {
            toast.show('单位名称不能为空');
        }
        console.log($scope.experience);
    };


    /* ok上传头像 依赖Upload服务 */
    /* ok注意: 这里要获取基本信息里面的信息, 从在异步加载问 */
    $scope.uploadUser = function () {
        $scope.uploadHead($scope.file);
    };
    $scope.uploadHead = function (file) {
        Upload.upload({
            url: ServerURL + 'file/file_upload',
            data: {file: file}
        }).progress(function (evt) {    // 进度
            $(".progress-striped").show();
        }).success(function (data, status, headers, config) { //成功的情况
            if (data.status == true) {
                // window.location.reload();
                $(".progress-striped").text("上传成功");
                console.log(data);
                var params = {
                    user_id: self.lawyerId,
                    upload_user: self.lawyerId,
                    type: 3,
                    file_info:[{   file_name: data.data.file_name,
                        qiniu_file_name: data.data.qiniu_file_name,
                        url:  data.data.url
                    }]
                };
                console.log(params);
                queryData.postData("file/file", params).then(function (data) {
                    console.log(data);
                    if (data.status == true) {
                        $scope.files = data.data.file;
                        console.log(data);
                        //window.location.reload();
                        window.location.href = "../gw/login.html#/account";
                    }
                    else {
                        alert(data.message);
                    }
                });
            } else {
                alert(data.message);
            }
            //失败的情况
        }).error(function (data) {
            console.log(data);
        })
    };

    //返回
    $scope.backOne= function () {
        $('#partOne').show();
        $('#partTwo').hide();
        $('#partThree').hide();
        $('#partFour').hide();
        $('.spanEle,.blueSolid').css({backgroundColor: '#ccc'});
        $('.liEle').css({color: '#ccc'});
        $('.liEle1').css({color: '#3085f1'});
        $('.spanEle1').css({backgroundColor: '#3085f1'});
    };
    $scope.backTwo= function () {
        $('#partOne').hide();
        $('#partTwo').show();
        $('#partThree').hide();
        $('#partFour').hide();

        $('.spanEle,.blueSolid').css({backgroundColor: '#ccc'});
        $('.liEle').css({color: '#ccc'});
        $('.blueSolid1').css({backgroundColor: '#3085f1'});
        $('.liEle1,.liEle2').css({color: '#3085f1'});
        $('.spanEle1,.spanEle2').css({backgroundColor: '#3085f1'});

    };
    $scope.backThree= function () {
        $('#partOne').hide();
        $('#partTwo').hide();
        $('#partThree').show();
        $('#partFour').hide();
        $('.spanEle,.blueSolid').css({backgroundColor: '#ccc'});
        $('.liEle').css({color: '#ccc'});
        $('.blueSolid1,.blueSolid2').css({backgroundColor: '#3085f1'});
        $('.liEle1,.liEle2,.liEle3').css({color: '#3085f1'});
        $('.spanEle1,.spanEle2,.spanEle3').css({backgroundColor: '#3085f1'});
    };

    //删除数组指定元素 点击删除从业经历
    $scope.delete = function (index) {
        ($scope.experience).splice(index,1);
        var id = '#hide'+index;
        $(id).hide();
        console.log($scope.experience);
    };

});

//登录成功
function loginSuccess(ngDialog, data, toast) {
    var status = data.data.status;
    //将用户信息存入session
    sessionStorage.setItem("userInfo", JSON.stringify(data.data));
    sessionStorage.setItem("status", status);

    //登录状态
    if(status == 1) {
        switch (parseInt(data.data.type)) {
            case 90: //管理员
                window.location.href = "../admin";
                break;
            case 91: //销售
                window.location.href = "../sales";
                break;
            case 92: //市场分析师
                window.location.href = "../market";
                break;
            case 93: //风控经理
                window.location.href = "../windControlManager";
                break;
            case 94: //风控总监
                window.location.href = "../directorOfAirControl";
                break;
            case 95: //项目总监
                window.location.href = "../projectDirector";
                break;
            case 96: //项目经理
                window.location.href = "../projectManager";
                break;
            case 97: //商务经理
                window.location.href = "../businessManager";
                break;
            case 98: //HR
                window.location.href = "../hr";
                break;
            case 2: //律师
                window.location.href = "../lawyer";
                break;
            case 3: //渠道&律师
                window.location.href = "../channel";
                break;
            case 4: //个人客户
                window.location.href = "../client";
                break;
            case 5: //机构客户
                window.location.href = "../client";
                break;
            case 6: //个人渠道
                window.location.href = "../channel";
                break;
            case 7: //机构渠道
                window.location.href = "../channel";
                break;
            default:
                showDialog('用户还未开通');
                break;
        }
    }
    else if(status == 4) {
        $(".dialogBtn").click();
    }
    else if(status == 5) {
        window.location.href = "updatePass.html";
        $scope.warning = "第一次登陆，请先修改密码！";
    }
    else {
        toast.show('账号未激活或已被禁用,请联系帮帮管理员');
    }
}
// 登陆
myapp.controller("loginCtrl", function ($scope, $http, md5, queryData, ngDialog, toast) {
    $scope.phone = localStorage.getItem("rememberUsername");
    $scope.remember = localStorage.getItem("isRememberMe");
    $scope.password = "";
    $scope.loginP = false;
    $scope.clickRememberCheckBox = function (value) {
        localStorage.setItem('isRememberMe', value);
    };
    $scope.loginPhone = function () {
        $scope.loginP = true;
    };
    $scope.login = function () {
        var username = $scope.phone;
        var pass = md5.createHash($scope.password);
        var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
        // session存储倒序该密码里面
        localStorage.setItem("oldPassword", pass);
        if ($scope.remember == true) {
            localStorage.setItem("rememberUsername", username);
        }
        var data = {
            username: username,
            pass: pass
        };
        if(phoneReg.test(data.username)){
            queryData.postData("login/account", data).then(function (data) {
                console.log(data);
                if(data.status == true) {
                    loginSuccess(ngDialog, data, toast);
                }
                else {
                    toast.show(data.message, 2000);
                }
            });
        }else {
            toast.show('手机号码格式不正确');
        }
        console.log(data);

    };
    document.onkeydown = function (e) {
        if (!e) e = window.event;//火狐中是 window.event
        if ((e.keyCode || e.which) == 13) {
            // 定义参数,这个是在登陆中使用ng-model绑定的变量
            var username = $scope.phone;
            var pass = md5.createHash($scope.password);
            // session存储倒序该密码里面
            localStorage.setItem("oldPassword", pass);
            if ($scope.remember == true) {
                localStorage.setItem("rememberUsername", username);
            }
            var data = {
                username: username,
                pass: pass
            };
            console.log(data);
            queryData.postData("login/account", data).then(function (data) {
                console.log(data);
                if(data.status == true) {
                    loginSuccess(ngDialog, data, toast);
                }
                else {
                    toast.show('手机号码格式不正确', 2000);
                }
            });
        }
    };
});
// 忘记密码
myapp.controller("forgetPass", function ($scope, $interval, queryData, md5, ngDialog, toast) {
    $scope.newPass = "";
    $scope.phone = "";
    $scope.verCode = "";

    $scope.paracont = "获取验证码";
    $scope.paraevent = false;
    var second = 60;
    var timePromise = undefined;
    $scope.sentMessage = function () {
        $scope.paraevent = true;
        timePromise = $interval(function () {
            if (second <= 0) {
                $interval.cancel(timePromise);
                timePromise = undefined;

                second = 60;
                $scope.paracont = "重发验证码";
                $scope.paraevent = false;
            }
            else {
                $scope.paracont = second + "秒后可重发";
                second--;

            }
        }, 1000, 100);

        // 发送短信的接口
        var data = {
            phone: $scope.phone
        };
        queryData.postData("login/send_message_code", data).then(function (data) {
            console.log(data);
        })
    };
    $scope.editPass = function () {
        var data = {
            phone: $scope.phone,
            code: $scope.verCode,
            new_pass: md5.createHash($scope.newPass)
        };
        queryData.postData("login/forget_pass", data).then(function (data) {
            console.log(data);
            toast.show(data.message, 2000, function () {
                if (data.status == true) {
                    window.location.href = "login.html";
                }
            });
        })
    }
});
// 修改密码
myapp.controller("updatePassCtrl", function ($scope, queryData, md5, ngDialog, toast) {
    $scope.warning = "";
    $scope.newPass = "";
    $scope.confirmPass = "";
    $scope.updatePass = function () {
        if ($scope.newPass == "" || $scope.confirmPass == "" || $scope.newPass == undefined || $scope.confirmPass == undefined) {
            $scope.warning = "密码不能为空";
        }
        else {
            if ($scope.newPass != $scope.confirmPass) {
                $scope.warning = "新密码输入不一致";
            }
            else {
                var data = {
                    old_pass: localStorage.getItem("oldPassword"),
                    new_pass: md5.createHash($scope.newPass),
                    user_id: getUserInfo().user_id
                };
                console.log(data);
                queryData.postData("login/pass_update", data).then(function (data) {
                    toast.show(data.message, 2000, function () {
                        if(data.status == true) {
                            var type = getUserInfo().type;
                            switch (parseInt(type)) {
                                case 90: //管理员
                                    window.location.href = "../admin";
                                    break;
                                case 91: //销售
                                    window.location.href = "../sales";
                                    break;
                                case 92: //市场分析师
                                    window.location.href = "../market";
                                    break;
                                case 93: //风控经理
                                    window.location.href = "../windControlManager";
                                    break;
                                case 94: //风控总监
                                    window.location.href = "../directorOfAirControl";
                                    break;
                                case 95: //项目总监
                                    window.location.href = "../projectDirector";
                                    break;
                                case 96: //项目经理
                                    window.location.href = "../projectManager";
                                    break;
                                case 97: //商务经理
                                    window.location.href = "../businessManager";
                                    break;
                                case 98: //HR
                                    window.location.href = "../hr";
                                    break;
                                case 2: //律师
                                    window.location.href = "../lawyer";
                                    break;
                                case 3: //渠道&律师
                                    window.location.href = "../channel";
                                    break;
                                case 4: //个人客户
                                    window.location.href = "../client";
                                    break;
                                case 5: //机构客户
                                    window.location.href = "../client";
                                    break;
                                case 6: //个人渠道
                                    window.location.href = "../channel";
                                    break;
                                case 7: //机构渠道
                                    window.location.href = "../channel";
                                    break;
                                default:
                                    toast.show('用户还未开通');
                                    break;
                            }
                        }
                        else {
                            window.location.reload();
                        }
                    });
                })
            }
        }
    }

    //暂不修改
    /*$scope.removeLater = function () {

    }*/

});

// 检查登陆
myapp.controller("checkLoginCtrl", function ($scope, queryData, ngDialog) {
    var obj = getURLQueringString();
    var code = obj.code;
    var state = obj.state;

    var sessionState = localStorage.getItem("state");

    var status = sessionStorage.getItem("status");
    var user_id = sessionStorage.getItem("user_id");
    // 如果账号待激活, 那么就跳转修改密码界面,修改初始化密码

    if (state == sessionState) {
        // 获取第一次登陆的状态
        var url, data;
        url = "login/wechat";
        data = {
            code: code
        };
        queryData.postData(url, data).then(function (data) {
            if(data.status == true) {
                loginSuccess(ngDialog, data, toast);
            }
            else {
                toast.show(data.message, 2000, function () {
                    window.location.href = "login.html";
                })
            }
        })

    }
    else {
        window.location.href = "login.html";
    }
    console.log(code + " | " + state + " | " + sessionState);
});

// 检查注册
myapp.controller("checkRegisterCtrl", function ($scope, queryData, ngDialog) {
    var code = getURLQueringString().code;
    var state = getURLQueringString().state;
    var sessionState = localStorage.getItem("state");
    var status = sessionStorage.getItem("status");
    var user_id = sessionStorage.getItem("user_id");
    // 如果账号待激活, 那么就跳转修改密码界面,修改初始化密码
    if (state == sessionState) {
        // 获取第一次登陆的状态
        var url, data;
        if (status == 5) {
            window.location.href = "updatePass.html";
        }
        else {
            url = "login/bind_wechat";
            data = {
                code: code,
                user_id: user_id
            };
            queryData.postData(url, data).then(function (data) {
                if(data.status == true) {
                    window.location.href = "updatePass.html";
                }
                else {
                    toast.show(data.message, 2000, function () {
                        window.location.href = "login.html";
                    })
                }
                console.log(data);
            })
        }
    }
    else {
        window.location.href = "login.html";
    }
    console.log(code + " | " + state + " | " + sessionState);
});
