/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('adUserCustomerInfo', {
    bindings: {
        //跳转详情页页面, 默认是进度页面
        page: '@'
    },
    templateUrl: '../components/ad-user-customer-info/ad-user-customer-info.template.html',
    controller: ['$state','$rootScope', '$scope', '$stateParams', 'client', 'interact','Upload','queryData', function ($state,$rootScope, $scope, $stateParams, client, interact,Upload,queryData) {
        /**
         * 1. 配置
         */
        //初始化
        var self = this;
        self.$onInit = function () {
            if(self.page == undefined) {
                self.page = "speed";
            }
        };
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

        //herf配置
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        var user_id = userInfo.user_id;
        var type = userInfo.type;
        $scope.clickProject = function (id) {
            switch (type){
                case '90' :
                    self.goHerf = '#/project/detail/'+id+'/supervision';
                    break;
                case '91' :
                    self.goHerf = '#/project/list/detail/'+id+'/speed';
                    break;
            }
            console.log(id);
            console.log( self.goHerf);
            window.location.href = self.goHerf;
        };
        

        /**
         * 2. 请求客户详细信息
         */
        getMessage();
        function getMessage() {
            client.get($stateParams.id).then(function (data) {
                data = data.data;
                console.log(data);
                //取出信息
                $scope.client = data.user_info;
                $scope.head_file = data.head_file;
                $scope.projectList = data.projects;
                $scope.interactList = data.interacts;
                //修改的客户信息, copy对象
                $scope.updateClient = $.extend(true, {}, $scope.client);
            });
        }


        /**
         * 3. 提交或修改互动
         */
        $scope.submitInteract = function (content) {
            if(content.length <= 0) {
                alert("请输入互动信息");
            }
            //添加互动
            interact.post({
                interacted_id: $stateParams.id,
                details: content,
                //管理员与销售操作时, 都当做是销售行为
                type: '1'
            }).then(function (data) {
                $('#interation').on('hidden.bs.modal', function () {
                    //刷新当前组件
                    getMessage();
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
            interact.put({
                id: interactInfo.interact_id,
                details: interactInfo.details,
            }).then(function (data) {
                consoleLog(data);
                //提交修改
                $scope.interactList[self.updateIndex] = interactInfo;
                //隐藏模态
                $('#interationUpdate').modal('hide');
            });
        };

        /**
         * 4. 提交修改客户信息
         */
        //点击弹出修改客户信息模态
        $scope.showUpdateModal = function (index) {
            //记录更新客户的索引, 2:更新个人或机构基本信息 3:更新备注
            self.updateClientIndex = index;
            $('#clientInfoModal').modal('show');
        };
        
        //提交更新客户信息
        $scope.submitUpdate = function (clientInfo) {
            console.log(clientInfo);
            clientInfo.sales_id = getUserInfo().user_id;
            client.put(clientInfo).then(function (data) {
                //提交修改
                $scope.client = $.extend(true, {}, clientInfo);
                //隐藏模态
                $('#clientInfoModal').modal('hide');
            });
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
            }).success(function (data, status, headers, config) { //成功的情况
                console.log(data);
                if (data.status == true) {
                    $(".progress-striped").hide();
                    console.log(data);
                    if($scope.head_file.file_id == undefined || $scope.head_file.file_id==""){
                        var params = {
                            user_id: $scope.client.client_id,
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
                                console.log(data.message);
                            }
                        });
                    }else {
                        params = {
                            file_id: $scope.head_file.file_id,
                            user_id: $scope.client.client_id,
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
                                console.log(data.message);
                            }
                        });
                    }
                }
                else {
                    alert(data.message);
                    console.log(data.message);
                }
                //失败的情况
            }).error(function (data) {
                console.log(data);
            })
        };

    }]
});
