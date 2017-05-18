/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 律师档案信息
 */
angular.module('byComponent').component('lawyerAccount', {
    templateUrl: '../components/lawyer-account/lawyer-account.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams', 'queryData','$http','Upload','toast', function ($state,$rootScope, $scope, $stateParams, queryData,$http,Upload,toast) {
        /*
         *获取律师id 和 用户id
         *
         * */
        var userInfo = getUserInfo();
        var lawyer_id = $stateParams.id;
        var user_id = userInfo.user_id;
        // 防止按钮被连续点击
        var moving = false;
        //给用户类型
        $scope.userType = userInfo.type;

        /**
         * 1.  配置菜单
         */
        $scope.selectedIndex = 0;
        //菜单配置 律师端权限限制
        if(userInfo.type == '2') {
            $scope.menuOptions = [
                {
                    name: '基本信息'
                },
                {
                    name: '合作信息'
                }
            ];
        }else {
            $scope.menuOptions = [
                {
                    name: '基本信息'
                },
                {
                    name: '合作信息'
                },
                {
                    name: '互动信息'
                },
                {
                    name: '律师评估'
                }
            ];
        }

        /*
         *加载省份和年份
         *
         * */
        $scope.city = function () {
            city($scope, $http);
        };
        $scope.provinceChange = function () {
            $scope.lawyer.city = "";
        };
        getYear($scope, $http);



        /* 写到各自的控制器中,要不然一次付给好多court种 */
        /* 搜索到法院,单击赋值 */
        $scope.changeVal = function (newVal, pro) {
            $scope.searchVal = newVal;
            $scope.lawyer_court.court = newVal;
            $scope.matchingprovince = pro;
            $(".resultList").hide();
        };
        $scope.showList = function () {
            $(".resultList").show();
            $(".search").focus();
            $scope.searchVal = "";
        };

        //律师时,直接取本身的id
        if(userInfo.type == '2') {
            lawyer_id = user_id;
        }else {
        }
        console.log(lawyer_id);
        /*
         *查询律师基本信息
         *
         * */
        getMessage();
        function getMessage() {
            queryData.getData("User_lawyer/lawyer", {operator_id: lawyer_id}).then(function (data) {
                /* 律师基本信息,法院信息,检察院信息,公安信息 */
                //console.log(data);
                $scope.lawyer = data.data.lawyer;

                $scope.head_file = data.data.head_file;
                $scope.judicial_info = data.data.judicial_info;
                $scope.projectList = data.data.projects;
                $scope.interactList = data.data.interacts;
                $scope.commentList = data.data.comment;


                $scope.lawyer_court = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.lawyer_procuratorate = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.lawyer_police = {
                    start_time_month: '0',
                    end_time_month: '0'
                };
                $scope.lawyer_arbitration = {
                    start_time_month: '0',
                    end_time_month: '0'
                };



                $scope.person = $.extend(true, {}, $scope.lawyer);




                console.log(data);


                // 显示大律师图片标志
                $scope.showSenior = false;
                if($scope.judicial_info != undefined && $scope.judicial_info != ''){
                    showSeniorLeftBig();
                }
                function showSeniorLeftBig() {
                    var arr = data.data.judicial_info;
                    var length = arr.length;
                    for(var i = 0;i < length;i++){
                        if(arr[i].judicial_type == '法院'){
                            $scope.showSenior = true;
                            break;
                        }
                    }
                }
            });

        }


        /*
         *修改基本信息
         *
         * */

        $scope.editLawyer = function (person,lawyer_id,user_id) {
            var data = {
                user_id: user_id,
                lawyer_id: lawyer_id,
                //基本信息
                name: person.name,
                phone: person.phone,
                email: person.email,
                birth: person.birth,
                sex: person.sex,
                province: person.province,
                city: person.city,
                address: person.address,

            };

            queryData.putData("user_lawyer/lawyer_basic", data).then(function (data) {
                console.log(data);
                if (data.status == false) {
                    toast.show(data.message, 2000);
                }
                else {
                    toast.show(data.message, 2000);
                    $('#editBaseinfo').modal('hide');
                    $scope.lawyer = $.extend(true, {}, $scope.person);

                }
            });
        };

        /*
         *修改执业信息
         *
         * */
        $scope.editPractice = function (person,lawyer_id,user_id) {
            var data = {
                user_id: user_id,
                lawyer_id: lawyer_id,
                //基本信息
                firm: person.firm,
                position: person.position,
                license_number: person.license_number
            };

            queryData.putData("user_lawyer/lawyer_license", data).then(function (data) {
                console.log(data);
                if (data.status == false) {
                    toast.show(data.message, 2000);
                }
                else {
                    toast.show(data.message, 2000);
                    $('#editPractice').modal('hide');
                    $scope.lawyer = $.extend(true, {}, $scope.person);

                }
            });
        };


        /*
         *修改擅长领域
         *
         * */
        $scope.editGoodat = function (person,lawyer_id,user_id) {
            var data = {
                lawyer_id: lawyer_id,
                //擅长领域
                practice_area: person.practice_area,
                income: person.income,
                team_scale: person.team_scale
            };
            queryData.putData("user_lawyer/lawyer_practice", data).then(function (data) {
                console.log(data);
                if (data.status == false) {
                    toast.show(data.message, 2000);
                }
                else {
                    toast.show(data.message, 2000);

                    $('#editGoodat').modal('hide');
                    $scope.lawyer = $.extend(true, {}, $scope.person);
                }
            });
        };


        /*
         *修改其他信息
         *
         * */
        $scope.editOther = function (person,lawyer_id,user_id) {
            var data = {
                user_id: user_id,
                lawyer_id: lawyer_id,
                //其他信息
                school: person.school,
                remarks: person.remarks
            };
            consoleLog(data);
            queryData.putData("user_lawyer/lawyer_other", data).then(function (data) {
                console.log(data);
                if (data.status == false) {
                    toast.show(data.message, 2000);
                }
                else {
                    toast.show(data.message, 2000);

                    $('#editOther').modal('hide');
                    $scope.lawyer = $.extend(true, {}, $scope.person);
                }
            });
        };


        /*
         *
         *修改从业信息
         *
         */
        //这里是获取数据
        $scope.experience = function (info) {
            //控制提交修改按钮
            $scope.changeBotton = true;
            //控制选项卡显示\隐藏
            $scope.changeType = false;

            $scope.index = info.id;
            $scope.showModle = info.judicial_type;
            console.log(info.judicial_type,$scope.index);

            if(info.judicial_type == "法院"){
                $scope.lawyer_court.court = info.court;
                $scope.lawyer_court.start_time_year = info.start_time_year;
                $scope.lawyer_court.start_time_month = info.start_time_month;
                $scope.lawyer_court.end_time_year = info.end_time_year;
                $scope.lawyer_court.end_time_month = info.end_time_month;
                $scope.lawyer_court.case_type = info.case_type;
                $scope.lawyer_court.job_duty = info.job_duty;
                $scope.lawyer_court.court_level = info.court_level;
            }
            if(info.judicial_type == "检察院"){
                $scope.lawyer_procuratorate.procuratorate = info.procuratorate;
                $scope.lawyer_procuratorate.start_time_year = info.start_time_year;
                $scope.lawyer_procuratorate.start_time_month = info.start_time_month;
                $scope.lawyer_procuratorate.end_time_year = info.end_time_year;
                $scope.lawyer_procuratorate.end_time_month = info.end_time_month;
                $scope.lawyer_procuratorate.job_duty = info.job_duty
            }
            if(info.judicial_type == "公安"){
                $scope.lawyer_police.police = info.police;
                $scope.lawyer_police.start_time_year = info.start_time_year;
                $scope.lawyer_police.start_time_month = info.start_time_month;
                $scope.lawyer_police.end_time_year = info.end_time_year;
                $scope.lawyer_police.end_time_month = info.end_time_month;
                $scope.lawyer_police.level = info.level
            }
            if(info.judicial_type == "仲裁机构"){
                $scope.lawyer_arbitration.organi_name = info.organi_name;
                $scope.lawyer_arbitration.start_time_year = info.start_time_year;
                $scope.lawyer_arbitration.start_time_month = info.start_time_month;
                $scope.lawyer_arbitration.end_time_year = info.end_time_year;
                $scope.lawyer_arbitration.end_time_month = info.end_time_month;
                $scope.lawyer_arbitration.job_duty = info.job_duty
            }



            $scope.editExperience = function () {
                if ($scope.showModle == "法院") {
                    // 默认值 法院
                    var data = {
                        judicial_type: "法院",
                        judicial_id: $scope.index,

                        court: $scope.lawyer_court.court,
                        start_time: $scope.lawyer_court.start_time_year + '/' + $scope.lawyer_court.start_time_month + '/0',
                        end_time: $scope.lawyer_court.end_time_year + '/' + $scope.lawyer_court.end_time_month + '/0',
                        case_type: $scope.lawyer_court.case_type,
                        job_duty: $scope.lawyer_court.job_duty,
                        court_level: $scope.lawyer_court.court_level
                    }
                }
                if ($scope.showModle == "检察院") {
                    // 检察院
                    var data = {
                        judicial_type: "检察院",
                        judicial_id: $scope.index,

                        procuratorate: $scope.lawyer_procuratorate.procuratorate,
                        start_time: $scope.lawyer_procuratorate.start_time_year + '/' + $scope.lawyer_procuratorate.start_time_month + '/0',
                        end_time: $scope.lawyer_procuratorate.end_time_year + '/' + $scope.lawyer_procuratorate.end_time_month + '/0',
                        job_duty: $scope.lawyer_procuratorate.job_duty
                    }
                }
                if ($scope.showModle == "公安") {
                    // 公安
                    var data = {
                        judicial_type: "公安",
                        judicial_id: $scope.index,

                        police: $scope.lawyer_police.police,
                        start_time: $scope.lawyer_police.start_time_year + "/" + $scope.lawyer_police.start_time_month + '/0',
                        end_time: $scope.lawyer_police.end_time_year + "/" + $scope.lawyer_police.end_time_month + '/0',
                        level: $scope.lawyer_police.level
                    }
                }
                if ($scope.showModle == "仲裁机构") {
                    // 仲裁机构
                    var data = {
                        judicial_type: "仲裁机构",
                        judicial_id: $scope.index,

                        organi_name: $scope.lawyer_arbitration.organi_name,
                        start_time: $scope.lawyer_arbitration.start_time_year + '/' + $scope.lawyer_arbitration.start_time_month + '/0',
                        end_time: $scope.lawyer_arbitration.end_time_year + '/' + $scope.lawyer_arbitration.end_time_month + '/0',
                        job_duty: $scope.lawyer_arbitration.job_duty
                    }
                }
                console.log(data);
                //提示未输入必要信息
                /*if ($scope.lawyer.name == "" || $scope.lawyer.name == undefined) {
                 $(".name").focus();
                 return false;
                 }
                 if ($scope.lawyer.province == "" || $scope.lawyer.province == undefined) {
                 $(".province").focus();
                 return false;
                 }
                 if ($scope.lawyer.practice_area == "" || $scope.lawyer.practice_area == undefined) {
                 $(".practice_area").focus();
                 return false;
                 }*/


                queryData.putData("user_lawyer/lawyer_judicial",data).then(function (data) {
                    console.log(data);
                    if(data.status == true){
                        toast.show(data.message, 2000);

                        $('#experience').on('hidden.bs.modal', function () {
                         //刷新当前组件
                            $state.reload($state.current.name);
                         });
                        $('#experience').modal('hide');
                    }else {
                        toast.show(data.message, 2000);

                        $('#experience').modal('hide');
                    }
                });

            };

        };
        /*
         *删除从业信息
         *
         * */
        $scope.deleteExp = function (info) {
            var data = {
                judicial_id: info.id,
                lawyer_id: $scope.lawyer.id
            };
            switch (info.judicial_type){
                case '法院':
                    data.judicial_type = 1;
                    break;
                case '检察院':
                    data.judicial_type = 2;
                    break;
                case '公安':
                    data.judicial_type = 3;
                    break;
                case '仲裁机构':
                    data.judicial_type = 4;
                    break;
            };
            confirm('你确认删除从业信息吗?',function (r) {
                if(r){
                    queryData.getData('User_lawyer/lawyer_delete',data).then(function (data) {
                        toast.show(data.message, 2000);
                        getMessage();
                    });
                }
            });
        };
        /*
         *添加从业信息
         *
         * */
        $scope.selectLawyerType = function (type) {
            $scope.showModle = type;
        };
        $scope.controlType = function () {
            //控制提交修改按钮
            $scope.changeBotton = false;
            //控制选项卡显示\隐藏
            $scope.changeType = true;
            //默认选择法院
            $scope.showModle = '法院';
        };
        $scope.addExperience = function () {
            if ($scope.showModle == "法院") {
                // 默认值 法院
                var data = {
                    user_lawyer_id: $scope.lawyer.id,
                    lawyer_id: lawyer_id,
                    judicial_type: 1,

                    court: $scope.lawyer_court.court,
                    start_time: $scope.lawyer_court.start_time_year + '/' + $scope.lawyer_court.start_time_month + '/0',
                    end_time: $scope.lawyer_court.end_time_year + '/' + $scope.lawyer_court.end_time_month + '/0'
                };
                switch ($scope.lawyer_court.case_type){
                    case '民商事':
                        data.case_type = 1;
                        break;
                    case '知识产权':
                        data.case_type = 2;
                        break;
                    case '刑事':
                        data.case_type = 3;
                        break;
                    case '行政':
                        data.case_type = 4;
                        break;
                    case '其他':
                        data.case_type = 1;
                        break;
                }
                switch ($scope.lawyer_court.job_duty){
                    case '院长':
                        data.job_duty = 1;
                        break;
                    case '副院长':
                        data.job_duty = 2;
                        break;
                    case '庭长':
                        data.job_duty = 3;
                        break;
                    case '副庭长':
                        data.job_duty = 4;
                        break;
                    case '审判长':
                        data.job_duty = 5;
                        break;
                    case '审判员':
                        data.job_duty = 6;
                        break;
                    case '助理审判员':
                        data.job_duty = 7;
                        break;
                    case '书记员':
                        data.job_duty = 8;
                        break;
                    case '其他':
                        data.job_duty = 9;
                        break;
                }
                switch ($scope.lawyer_court.court_level){
                    case '最高院':
                        data.court_level = 1;
                        break;
                    case '高级法院':
                        data.court_level = 2;
                        break;
                    case '中级法院':
                        data.court_level = 3;
                        break;
                    case '基层法院':
                        data.court_level = 4;
                        break;
                }
            }
            if ($scope.showModle == "检察院") {
                // 检察院
                var data = {
                    user_lawyer_id: $scope.lawyer.id,
                    lawyer_id: lawyer_id,
                    judicial_type: 2,

                    procuratorate: $scope.lawyer_procuratorate.procuratorate,
                    start_time: $scope.lawyer_procuratorate.start_time_year + '/' + $scope.lawyer_procuratorate.start_time_month + '/0',
                    end_time: $scope.lawyer_procuratorate.end_time_year + '/' + $scope.lawyer_procuratorate.end_time_month + '/0'
                };
                switch ($scope.lawyer_procuratorate.job_duty){
                    case '检察长':
                        data.job_duty = 1;
                        break;
                    case '副检察长':
                        data.job_duty = 2;
                        break;
                    case '处长/局长/主任':
                        data.job_duty = 3;
                        break;
                    case '副处长/副局长/副主任':
                        data.job_duty = 4;
                        break;
                    case '检察员':
                        data.job_duty = 5;
                        break;
                    case '助理检察员':
                        data.job_duty = 6;
                        break;
                    case '书记员':
                        data.job_duty = 7;
                        break;
                    case '其他':
                        data.job_duty = 8;
                        break;


                }
            }
            if ($scope.showModle == "公安") {
                // 公安
                var data = {
                    user_lawyer_id: $scope.lawyer.id,
                    lawyer_id: lawyer_id,
                    judicial_type: 3,

                    police: $scope.lawyer_police.police,
                    start_time: $scope.lawyer_police.start_time_year + "/" + $scope.lawyer_police.start_time_month + '/0',
                    end_time: $scope.lawyer_police.end_time_year + "/" + $scope.lawyer_police.end_time_month + '/0'
                };
                switch ($scope.lawyer_police.level){
                    case '科级':
                        data.level = 1;
                        break;
                    case '处级':
                        data.level = 2;
                        break;
                    case '厅局级':
                        data.level = 3;
                        break;
                    case '部级':
                        data.level = 4;
                        break;
                    case '其他':
                        data.level = 5;
                        break;

                }
            }
            if ($scope.showModle == "仲裁机构") {
                // 仲裁机构
                var data = {
                    user_lawyer_id: $scope.lawyer.id,
                    lawyer_id: lawyer_id,
                    judicial_type: 4,

                    organi_name: $scope.lawyer_arbitration.organi_name,
                    start_time: $scope.lawyer_arbitration.start_time_year + '/' + $scope.lawyer_arbitration.start_time_month + '/0',
                    end_time: $scope.lawyer_arbitration.end_time_year + '/' + $scope.lawyer_arbitration.end_time_month + '/0',
                    job_duty: $scope.lawyer_arbitration.job_duty
                }
            }
            console.log(data);
            queryData.postData('User_lawyer/lawyer_judicial',data).then(function (data) {
                if(data.status == true){
                    toast.show(data.message, 2000);

                    $('#experience').on('hidden.bs.modal', function () {
                        //刷新当前组件
                        getMessage();
                    });
                    $('#experience').modal('hide');
                }else {
                    toast.show(data.message, 2000);

                    $('#experience').modal('hide');
                }
            });
        };
        /**
         * 添加或修改互动
         */
        $scope.submitInteract = function (content) {
            if(moving){
                return;
            }
            moving = true;
            if(content.length <= 0) {
                alert("请输入互动信息");
                moving = false;
            }
            var data = {
                interacter_id: user_id,
                interacted_id: lawyer_id,
                details: content,
                type: '3'
            };
            //添加互动
            queryData.postData('Interact/interact',data).then(function (data) {
                $('#interation').on('hidden.bs.modal', function () {
                    //刷新当前组件
                    getMessage();
                    $scope.content = '';
                    moving = false;
                });
                $('#interation').modal('hide');
            });
        };

        //点击开始修改互动信息
        $scope.beginUpdateInteract = function (interactInfo, updateIndex) {
            $scope.updateInteract = $.extend(true, {}, interactInfo);
            //保存修改索引
            self.updateIndex = updateIndex;
        };

        //提交修改
        $scope.submitUpdateInteract = function (interactInfo) {
            console.log(interactInfo);
            queryData.putData('Interact/interact',{
                    id: interactInfo.interact_id,
                    details: interactInfo.details
            }).then(function (data) {
                    //提交修改
                    $scope.interactList[self.updateIndex] = interactInfo;
                    //隐藏模态
                    $('#interationUpdate').modal('hide');
            });
        };





        /* 上传头像 依赖Upload服务 */
        /* 注意: 这里要获取基本信息里面的信息, 从在异步加载问 */
        $scope.uploadUser = function () {
            $scope.upload($scope.file);
        };
        $scope.upload = function (file) {
            // var lawyerId = sessionStorage.getItem("uploadLawyerId");
            Upload.upload({
                url: ServerURL + 'file/file_upload',
                data: {file: file}
            }).progress(function (evt) {    // 进度
                $(".progress-striped").show();
                $(".progress-striped").text('进度: '+ parseInt(100.0 * evt.loaded / evt.total) + '%');
            }).success(function (data, status, headers, config) { //成功的情况
                if (data.status == true) {
                    // window.location.reload();
                    $(".progress-striped").hide();
                    console.log(data);
                    if($scope.head_file.file_id == undefined || $scope.head_file.file_id==""){
                        var params = {
                            user_id: lawyer_id,
                            upload_user: user_id,
                            type: 3,
                            file_info:[
                                {   file_name: data.data.file_name,
                                    qiniu_file_name: data.data.qiniu_file_name,
                                    url:  data.data.url}
                            ]
                        };
                        console.log(params);
                        console.log("这里是添加");
                        queryData.postData("file/file", params).then(function (data) {
                            console.log(data);
                            if (data.status == true) {
                                /* 律师基本信息,法院信息,检察院信息,公安信息 */
                                $scope.files = data.data.file;
                                console.log(data);
                                $state.reload($state.current.name);
                            }
                            else {
                                alert(data.message);
                            }
                        });
                    }else {
                        params = {
                            file_id: $scope.head_file.file_id,
                            user_id: lawyer_id,
                            upload_user: user_id,
                            type: "用户头像文件",
                            file_info:[
                                {   file_name: data.data.file_name,
                                    qiniu_file_name: data.data.qiniu_file_name,
                                    url:  data.data.url,
                                    status: true}
                            ]
                        };
                        console.log(params);
                        console.log("这里是修改");
                        queryData.putData("file/file", params).then(function (data) {
                            console.log(data);
                            if (data.status == true) {
                                /* 律师基本信息,法院信息,检察院信息,公安信息 */
                                $scope.files = data.data.file;
                                console.log(data);
                                $state.reload($state.current.name);
                            }
                            else {
                                alert(data.message);
                            }
                        });
                    }
                }
                else {
                    alert(data.message);
                }
                //失败的情况
            }).error(function (data) {
                console.log(data);
            })
        };
        
        //点击查看案件详情
        $scope.clickProject = function (info) {
            //商务经理, 进入案件的项目信息页面
            if(userInfo.type == 97) {
                $state.go('project.detail.info', {
                    id: info.project_id
                });
            }
            else {
                $state.go('project.detail.supervision', {
                    id: info.project_id
                });
            }
        };


    }]
});
