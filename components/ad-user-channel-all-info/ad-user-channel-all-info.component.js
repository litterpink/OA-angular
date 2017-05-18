/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 所有渠道信息
 */
angular.module('byComponent').component('adUserChannelAllInfo', {
    templateUrl: '../components/ad-user-channel-all-info/ad-user-channel-all-info.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams','queryData','$http','Upload', 'provinceCity', function ($state,$rootScope, $scope, $stateParams,queryData,$http,Upload, provinceCity) {
        /**
         * 1.  配置菜单
         */
        $scope.selectedIndex = 0;
        //菜单配置
        $scope.menuOptions = [
            {
                name: '基本信息'
            },
            {
                name: '项目信息'
            },
            {
                name: '互动信息'
            }
        ];

        //配置菜单选中事件
        $scope.selectIndex = function (index) {
            console.log(index);
        };

        /**
         * 2. 获取用户信息, 并配置跳转
         */
        var userInfo = getUserInfo();
        var user_id = userInfo.user_id;
        var type = userInfo.type;
        $scope.clickProject = function (id) {
            switch (type){
                case '90' :
                    $state.go('project.detail.speed', {
                        id: id
                    });
                    break;
                case '91' :
                    $state.go('project.list.detail.info', {
                        id: id
                    });
                    break;
            }
        };

        /**
         * 2. 获取省市联动
         */
        //获取省份
        provinceCity.province().then(function (data) {
            // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
            $scope.province = data;
            updateCities();
        });

        //当选择的省级变化时, 更新对应省级下的城市
        function updateCities() {
            if($scope.province == '' || $scope.province == undefined) {
                $scope.city = '';
            }
            var data = $scope.province;
            for (var i = 0; i < data.length; i++) {
                // 判断如果配置选中的省份,然后获取对应的市的数组
                if ($scope.updateMiddle != undefined && data[i].name == $scope.updateMiddle.province) {
                    $scope.city = data[i].cities;
                }
            }
        }

        // 省份改变的时候, 选择相应的市
        $scope.provinceChange = function () {
            updateCities();
            // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
            $scope.updateMiddle.city = $scope.city[0];
        };

        /**
         * 3. 请求用户基本信息数据
         */
        var params = {
            middle_id: $stateParams.id
        };
        //获取基本信息
        getMessage();
        function getMessage() {
            queryData.getData("User_middle/middle", params).then(function (data) {
                console.log(data);
                $scope.byMiddleCase = data.data.middle_case;
                $scope.byMiddleFile = data.data.middle_file;
                $scope.byMiddleInteract = data.data.interact;
                $scope.file = data.data.head_file;
                $scope.middle = data.data.middle_info;

                console.log($scope.middle);

                $scope.middle_file_id = data.data.head_file.file_id;

                //更新的渠道的信息,进行一份copy
                $scope.updateMiddle = $.extend(true, {}, $scope.middle);

                //更新省市联动
                updateCities();
            });
        }

        //点击弹出修改渠道信息模态
        $scope.showUpdateModal = function (index) {
            //记录更新客户的索引, 2:更新个人或机构基本信息 3:更新备注
            self.updateMiddleIndex = index;
            if($scope.middle.type == '个人渠道' || $scope.middle.type == '律师渠道') {
                $('#editBaseinfo').modal('show');
            }
            else {
                $('#editOrgBaseinfo').modal('show');
            }
        };

        //点击更新备注
        $scope.clickEditMarks = function () {
            $('#editRemarks').modal('show');
        };


        //修改备注信息
        $scope.editRemarks = function (remarks) {
            var params = {
                middle_id: $stateParams.id,
                remarks: remarks
            };
            queryData.putData("User_middle/middle", params).then(function (data) {
                $('#editRemarks').modal('hide');
                //将更新成功的信息放入显示
                $scope.middle = $.extend(true, {}, $scope.updateMiddle);
            })
        };

        // ok修改个人或者律师基本信息
        $scope.editBaseInfo = function (remark) {
            queryData.putData("User_middle/middle", $scope.updateMiddle).then(function (data) {
                $('#editBaseinfo').modal('hide');
                //将更新成功的信息放入显示
                $scope.middle = $.extend(true, {}, $scope.updateMiddle);
            })
        };
        // ok修改机构基本信息
        $scope.editOrgBaseInfo = function () {
            queryData.putData("User_middle/middle", $scope.updateMiddle).then(function (data) {
                $('#editOrgBaseinfo').modal('hide');
                //将更新成功的信息放入显示
                $scope.middle = $.extend(true, {}, $scope.updateMiddle);
            })
        };
        /* ok上传头像 依赖Upload服务 */
        /* ok注意: 这里要获取基本信息里面的信息, 从在异步加载问 */
        $scope.uploadUser = function (file) {
            $scope.uploadHead(file);
        };
        $scope.uploadHead = function (file) {
            // var lawyerId = sessionStorage.getItem("uploadLawyerId");
            Upload.upload({
                url: ServerURL + 'file/file_upload',
                data: {file: file}
            }).progress(function (evt) {    // 进度
                $(".progress-striped").show();
            }).success(function (data, status, headers, config) {
                //成功的情况
                $scope.file.url = data.data.url;
                if (data.status == true) {
                    $(".progress-striped").hide();
                    console.log(data);
                    if($scope.middle_file_id == undefined || $scope.middle_file_id==""){
                        var params = {
                            user_id: $scope.middle.middle_id,
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
                                $state.reload($state.current.name);
                                console.log(data);
                            }
                            else {
                                alert(data.message);
                            }
                        });
                    }else {
                         params = {
                            file_id: $scope.middle_file_id,
                            user_id: $scope.middle.middle_id,
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
                                $state.reload($state.current.name);
                                console.log(data);
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
                //sessionStorage.setItem("status", false);
            })
        };
      
        //ok修改互动信息
        $scope.interactParams = function (id,details,num) {
            $scope.interact = details;
            $scope.editInteract = function (interact) {
                var data = {
                    id: id,
                    details: $scope.interact
                };
                console.log(data);
                queryData.putData("interact/interact", data).then(function (data) {
                    if (data.status == true) {
                        $scope.byMiddleInteract[num].details = interact;
                        $('#editInteration').modal('hide');
                        //window.location.reload();
                    }
                    else {
                        alert(data.message);
                    }
                })
            }
        };
        
        // ok添加互动信息
        $scope.addInteract = function (interactInfo) {
            $scope.interact = '';
            var data = {
                type: 1,
                interacter_id: user_id,
                interacted_id: $stateParams.id,
                details: interactInfo
            };
            console.log(data);
            queryData.postData("interact/interact", data).then(function (data) {
                consoleLog(data);
                if (data.status == true) {
                    $('#addInteract').on('hidden.bs.modal', function () {
                        //刷新当前组件
                        getMessage();
                    });
                    $('#addInteract').modal('hide');

                }
                else {
                    alert(data.message);
                }
            });
        };

    }]
});
