/**
 * Created by liuchungui on 16/8/25.
 */

'use strict';

/**
 * 项目文件列表组件
 */
angular.module('byComponent').component('projectFileList', {
    templateUrl: '../components/project-file-list/project-file-list.template.html',
    controller: ['$stateParams', '$scope', 'fileOperate', 'toast', '$state', function ($stateParams, $scope, fileOperate, toast, $state) {
        //时间模块  91.销售  92.市场分析
        var userInfo = getUserInfo();
        var type = userInfo.type;
        $scope.type = type;
        //文件操作类型 1:案件材料与证据 2:律师工作成果 3:官方文件 4:帮帮内部文件
        $scope.fileType = $stateParams.type;
        //限制显示20个字
        $scope.limitTextNum = 20;
        //项目id
        $scope.projectId = $stateParams.id;

        //初始化uploadUrls
        $scope.uploadUrls = [];

        //配置日期选择控件
        $scope.dateOptions = {
            locale: 'zh-cn',
            format: 'L',
            showClose: true,
            keepOpen: false
        };

        //文件列表类型标题
        switch (parseInt($scope.fileType)) {
            case 1: $scope.fileTypeTitle = "案件材料与证据"; break;
            case 2: $scope.fileTypeTitle = "律师工作成果"; break;
            case 3: $scope.fileTypeTitle = "官方文件"; break;
            case 4: $scope.fileTypeTitle = "帮帮内部文件"; break;
            default: $scope.fileTypeTitle = "";
        }

        /**
         * 1. 查询文件列表
         */
        function queryFileListData() {
            fileOperate.queryProjectFiles({
                project_id: $stateParams.id,
                project_file_type: $stateParams.type,
                user_id: userInfo.user_id
            }).then(function (data) {
                console.log(data);
                var fileList = data.data;
                //遍历
                for(var i = 0; i < fileList.length; i++) {
                    if(!fileList[i].file_profile || fileList[i].file_profile.length <= $scope.limitTextNum) {
                        //控制显示全部
                        fileList[i].show_all = true;
                        fileList[i].tmp_file_profile = fileList[i].file_profile;
                    }
                    else {
                        //控制显示全部
                        fileList[i].show_all = false;
                        //20个字的部分
                        fileList[i].tmp_file_profile = fileList[i].file_profile.substr(0, $scope.limitTextNum) + '...';
                    }
                }
                $scope.fileList = fileList;
            });
        }
        queryFileListData();

        /**
         * 2. 上传文件
         */
        $scope.uploadFiles = function (uploadFiles) {
            if(uploadFiles.length <= 0) {
                toast.show('请上传文件');
                return;
            }
            fileOperate.add({
                file_info: uploadFiles,
                project_file_type: $stateParams.type,
                module_id: 0,
                project_id: $stateParams.id,
                type: 1
            }).then(function (data) {
                //当模态框完全隐藏时,回调函数
                $('#uploadFile').on('hidden.bs.modal', function () {
                    //刷新当前组件
                    $state.reload($state.current.name);
                });
                $('#uploadFile').modal('hide');
            });
        };

        /**
         * 3. 删除文件/编辑文件
         */
        $scope.deleteFile = function (fileId, index) {
            confirm('确认删除文件?',function (r) {
                if(r){
                    fileOperate.delete(fileId).then(function (data) {
                        toast.show('删除成功');
                        //删除文件
                        $scope.fileList.splice(index, 1);
                    });
                }
            });
        };
        
        //编辑文件
        $scope.editFile = function (file, index, type) {
            $scope.editType = type;
            self.selectedIndex = index;
            var copyFile = $.extend(true, {}, file);
            copyFile.effect_time = timeStringToDate(copyFile.effect_time);
            copyFile.file_id = copyFile.id;
            $scope.editingFile = copyFile;
            $('#editFileModal').modal('show');
        };
        
        //提交编辑文件
        $scope.submitEditFile = function (file) {
            fileOperate.editFile(file).then(function (data) {
                //请求文件列表,更新数据
                queryFileListData();

                //模态消失
                $('#editFileModal').modal('hide');
            });
        };

        /**
         * 3. 控制文件全部展示事件
         */
        //展开显示全部
        $scope.expandShowAll = function (fileInfo) {
            fileInfo.show_all = true;
        };
        //收起
        $scope.closeShowAll = function (fileInfo) {
            fileInfo.show_all = false;
        };
    }]
});
