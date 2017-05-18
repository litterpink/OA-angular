/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 添加律师导入
 */
angular.module('byComponent').component('adUserLawyerAddInput', {
    bindings: {
        //是否嵌入在modal当中, 默认false
        embedModal: '@',
        //取消, 嵌入模态时使用
        cancel: '&',
        //完成回调, 嵌入模态时使用
        complete: '&',
        //lawyerId, 嵌入模态时使用
        lawyerId: '='
    },
    templateUrl: '../components/ad-user-lawyer-add-input/ad-user-lawyer-add-input.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', '$http','queryData', 'provinceCity', 'toast','Upload', function ($rootScope, $scope, $stateParams, $http,queryData, provinceCity, toast,Upload) {
        /**
         * 1. 设置默认值
         */
        getYear($scope, $http);


        var self = this;

        var user_id = getUserInfo().user_id;
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
            create_by: user_id,
            input_mode: "2",
            country: "中国",

            income: "",
            team_scale: ""
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
            console.log(lawyer);
            queryData.postData("User_lawyer/lawyer", lawyer).then(function (data) {
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
            });
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
                        upload_user: user_id,
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
                                window.location = "#/user/lawyer/all";
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
    }]
});
