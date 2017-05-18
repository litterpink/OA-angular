/**
 * Created by liuchungui on 16/8/29.
 */
'use strict';

angular.module('byComponent').component('uploadProgress', {
    bindings: {
        uploadUrls: '=',
        uploadComplete: '&',
        fileList: '=',
        id: '@',
        //是否显示生效时间
        showTime: '@',
        //项目id
        projectId: '@'
    },
    templateUrl: '../components/upload-progress/upload-progress.template.html',
    controller: ['$scope', '$timeout', function ($scope, $timeout) {
        /**
         * 初始化相关内容
         */
        $scope.isBoxActive = false;
        var self = this;
        //重置数据
        function resetData() {
            $scope.fileList = [];
            self.uploadUrls = [];
            $scope.tmpUploadUrls = [];
        }

        //重置数据
        resetData();

        //监听组件的属性变化
        self.$onChanges = function (value) {
            //比较projectId, 如果发生变化, 则清空数据
            if(value.projectId && value.projectId.currentValue != value.projectId.previousValue) {
                resetData();
            }
        };

        $scope.uploadButtonId = "uploadButton" + self.id;
        $scope.uploadContainerId = "uploadContainer" + self.id;
        
        //判断是否显示生效时间
        if(parseInt(self.showTime) || String(self.showTime) == 'true') {
            $scope.showTime = true;
        }

        //配置日期选择控件
        $scope.dateOptions = {
            locale: 'zh-cn',
            format: 'L',
            showClose: true,
            keepOpen: false
        };

        /**
         * 删除文件
         */
        self.deleteFile = function (index) {
            consoleLog('index: ' + index);
            var file = $scope.fileList.splice(index, 1)[0];
            console.log(file);
            //删除已经上传的信息
            console.log(file.uploadIndex);
            if(file.uploadIndex != undefined) {
                $scope.tmpUploadUrls.splice(file.uploadIndex, 1);
            }
            console.log($scope.tmpUploadUrls);
        };

        /**
         * 监听文件变化
         */
        var watch = $scope.$watch('tmpUploadUrls', function (value) {
            //遍历,将数据给uploadUrls
            var uploadUrls = [];
            console.log(value);
            for(var i = 0; i < value.length; i ++) {
                var uploadInfo = $scope.tmpUploadUrls[i];
                //copy一个
                uploadInfo = $.extend(true, {}, uploadInfo);
                if(uploadInfo.effect_time != undefined && uploadInfo.effect_time != "") {
                    uploadInfo.effect_time = uploadInfo.effect_time._d.toLocaleDateString();
                    console.log(uploadInfo.effect_time);
                }
                uploadUrls.push(uploadInfo);
            }
            self.uploadUrls = uploadUrls;
        }, true);


        /**
         * 添加上传文件
         */
        function addUploadFile(files) {
            //组装成数组
            if(!angular.isArray(files)) {
                files = [files];
            }

            //给每个file对象一个id和进度
            for (var i = 0; i < files.length; i++) {
                //上传状态, 1:正在上传 2:上传成功 3:网络原因引起上传失败,可以再次上传 4:服务器错误引起上传失败,显示删除按钮
                files[i].uploadStatus = 1;
                files[i].progress = '0%';
                //重命名文件名, 格式为 项目编号+文件名
                files[i].name = 'No' + self.projectId + '-' + files[i].name;
                $scope.fileList.push(files[i]);
            }
        }

        //监听组件销毁
        self.$onDestroy = function () {
            console.log('销毁组件');
            //释放watch
            watch();
        };

        /**
         * 七牛上传文件
         */
        $timeout(function () {
            /**
             * 上传事件的处理
             * @type {Object|*}
             */
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: $scope.uploadButtonId,         // 上传选择的点选按钮，必需
                uptoken_url: ServerURL + 'file/upload_token',
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: QiNiuURL,     // bucket域名，下载资源时用到，必需
                container: $scope.uploadContainerId,             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '100mb',             // 最大文件体积限制
                flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
                max_retries: 1,                     // 上传失败最大重试次数
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: $scope.uploadContainerId,          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                //x_vars : {
                //    查看自定义变量
                //    'time' : function(up,file) {
                //        var time = (new Date()).getTime();
                // do something with 'time'
                //        return time;
                //    },
                //    'size' : function(up,file) {
                //        var size = file.size;
                // do something with 'size'
                //        return size;
                //    }
                //},
                // log_level: 5,
                init: {
                    //添加到上传队列中
                    'FilesAdded': function(up, files) {
                        $scope.isBoxActive = false;
                        addUploadFile(files);
                        console.log($scope.fileList);
                        $scope.$apply();
                        console.log('添加到队列中');
                    },
                    //开始上传
                    'BeforeUpload': function(up, file) {
                        // 每个文件上传前，处理相关的事情
                        console.log('上传前');
                        console.log(file);
                    },
                    //上传中
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时，处理相关的事情
                        // console.log('上传时');
                        // console.log(file);
                        // console.log(up);
                        file.progress = file.percent + '%';
                        $scope.$apply();
                        console.log(file.percent);
                    },
                    //上传成功
                    'FileUploaded': function(up, file, info) {
                        //上传文件成功, 将上传信息放入file当中
                        file.uploadStatus = 2;
                        //上传的message
                        file.uploadStatusText = "上传成功";

                        /**
                         * 获取文件的链接
                         */
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var sourceLink = domain + res.key;
                        console.log(sourceLink);
                        var uploadInfo = {
                            qiniu_file_name: res.key,
                            file_name: res.key,
                            url: sourceLink,
                            effect_time: ""
                        };
                        //添加到上传成功的数组中
                        $scope.tmpUploadUrls.push(uploadInfo);

                        //在file存一个上传的索引,用来删除
                        file.uploadIndex = $scope.tmpUploadUrls.length - 1;
                        file.uploadInfo = uploadInfo;

                        $scope.$apply();
                    },
                    //上传失败
                    'Error': function(up, err, errTip) {
                        console.log('上传文件失败');
                        console.log(up);
                        for(var i = 0; i < up.files.length; i++) {
                            var file = up.files[i];
                            console.log(file);
                            //上传文件失败
                            if(file.uploadStatus == 1) {
                                file.uploadStatus = 4;
                            }
                            file.uploadStatusText = errTip;
                        }
                        $scope.$apply();
                    },
                    //上传完成
                    'UploadComplete': function() {
                        //队列文件处理完毕后，处理相关的事情
                        console.log($scope.tmpUploadUrls);
                        self.uploadComplete();
                        $scope.$apply();
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在unique_names: false，save_key: false时才生效
                        var fileName = file.name;
                        return fileName;
                    }
                }
            });

            /**
             * 拖拽事件处理
             * @type {Element}
             */
            console.log($scope.uploadContainerId);
            //获取拖拽区域
            var box = document.getElementById($scope.uploadContainerId);
            console.log(box);
            if(box == null) {
                return;
            }
            box.addEventListener("dragover", function(e) {
                e.preventDefault();
                // console.log("拖动");
                $scope.isBoxActive = true;
                $scope.$apply();
            }, true);

            //离开
            box.addEventListener("dragleave", function(e) {
                e.preventDefault();
                console.log('离开某个元素');
                $scope.isBoxActive = false;
                $scope.$apply();
            }, true);
        });
    }]
});
