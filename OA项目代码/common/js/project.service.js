/**
 * Created by liuchungui on 16/8/24.
 */
/**
 * 对项目的服务模块, 依赖于mix.service模块
 */

angular.module('project.service', ['mix.service'])
    //项目模块
    .factory("projectModule", ['queryData', function (queryData) {
        return {
            /**
             * 通过项目查询项目模块
             * @param $params
             */
            query: function (params) {
                return queryData.getData('project_manage/project_modules', params);
            },
            //添加模块
            add: function (params) {
                var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                params.user_id = userInfo.user_id;
                return queryData.postData('project_manage/project_module', params);
            },
            //获取所有模块
            getAllModule: function () {
                return queryData.getData('project_manage/modules', {});
            },
            //删除项目模块
            deleteModule: function (projectModuleId) {
                return queryData.putData('project_manage/project_module_delete', {
                    project_module_id: projectModuleId
                });
            },
            //完成模块
            finish: function (projectModuleId) {
                return queryData.putData('project_manage/finish_module', {
                    project_module_id: projectModuleId
                });
            }
        }
    }])
    //项目条目模块
    .factory("projectModuleItem", ['queryData', function (queryData) {
        return {
            /**
             * 查询项目模块的条目
             * @param $params
             * @returns {string}
             */
            query: function (params) {
                // 返回条目
                return queryData.getData("project_manage/project_module_items", params);
            },
            //更新完成条目
            update: function (params) {
                return queryData.postData("project_manage/project_module_item", params);
            }
        };
    }])
    //项目列表
    .factory("projectList", ['queryData', function (queryData) {
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //销售端项目列表
            sales: function (params) {
                params.sales_id = userInfo.user_id;
                return queryData.getData('project_list/sales', params);
            },
            //管理员端项目列表
            admin: function (params) {
                console.log(params);
                return queryData.getData('project_list/admin', params);
            },
            //客户项目列表
            client: function (params) {
                return queryData.getData('project_list/client', params);
            },
            //律师项目列表
            lawyer: function (params) {
                return queryData.getData('project_list/lawyer', params);
            },
            manager: function (params) {
                return queryData.getData('project_list/manager', params);
            },
            //商务经理
            businessManager: function (params) {
                return queryData.getData('project_list/bm', params);
            }
        }
    }])
    //项目操作
    .factory("projectOperate", ['queryData', function (queryData) {
        //获取用户信息
        var userInfo = getUserInfo();
        return {
            //添加
            add: function ($params) {
                $params.sales_id = userInfo.user_id;
                return queryData.postData('project_operate/project', $params);
            },
            //签约
            sign: function ($params) {
                $params.sales_id = userInfo.user_id;
                return queryData.putData('project_operate/sign', $params);
            },
            //销售提交给分析师
            submitAnalyst: function ($params) {
                $params.sales_id = userInfo.user_id;
                return  queryData.putData('project_operate/submit_analyst', $params);
            },
            //申诉
            appeal: function (projectId) {
                return queryData.putData('project_operate/appeal', {
                    sales_id: userInfo.user_id,
                    project_id: projectId
                });
            },
            //指派律师
            assignLawyer: function (lawyerId, projectId) {
                return queryData.putData('project_manage/project_lawyer', {
                    lawyer_id: lawyerId,
                    project_id: projectId
                });
            },
            reSubmitAnalyst: function (params) {
                params.sales_id = userInfo.user_id;
                return queryData.putData('project_operate/re_submit', params);
            },
            //搁置
            stopProject: function ($params) {
                $params.user_id = userInfo.user_id;
                return queryData.putData('project/project_status', $params);
            },
            //恢复项目
            canleSelve: function ($params) {
                $params.user_id = userInfo.user_id;
                return queryData.putData('project/project_status', $params);
            }
        }
    }])
    //文件操作
    .factory("fileOperate", ['queryData', function (queryData) {
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //添加文件
            add: function (params) {
                params.upload_user = userInfo.user_id;
                return queryData.postData('file/file', params);
            },
            //查看项目文件
            queryProjectFiles: function (params) {
                return queryData.getData('file/project_files', params);
            },
            //删除文件
            delete: function (fileId) {
                return queryData.putData('file/file_delete', {
                    file_id: fileId
                });
            },
            //编辑文件
            editFile: function (params) {
                return queryData.putData('file/file_info', params);
            }
        }
    }])
    //项目基本信息
    .factory("project", ['queryData', function (queryData) {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //项目进度
            progress: function (projectId) {
                return queryData.getData('project/progress', {
                   project_id: projectId,
                    user_type: userInfo.type
                });
            },
            //评估信息
            evals: function (projectId) {
                return queryData.getData('project/evals', {
                    project_id: projectId
                })
            },
            //基本信息
            basic: function (projectId) {
                return queryData.getData('project/basic', {
                    project_id: projectId
                });
            },
            //项目参与人员信息
            project_users: function (projectId) {
                return queryData.getData('project/project_users', {
                    project_id: projectId,
                    user_type: userInfo.type
                });
            },
            //修改项目
            update: function (params) {
                return queryData.putData('project/basic', params);
            },
            //更换项目相关人员
            change_person: function (params) {
                return queryData.putData('project/project_personnel', params);
            }

        }
    }])
    //评论
    .factory("comment", ['queryData', function (queryData) {
        return {
            //添加文件
            add: function ($params) {
                //添加文件
                return queryData.postData('comment/comment', $params);
            }
        }
    }])
    //数目
    .factory("num", ['queryData', function (queryData) {
        var userInfo = getUserInfo();
        console.log(userInfo);
        return {
            //分析师
            analyst: function () {
                return queryData.getData('project_list/analyst_num', {
                    analyst_id: userInfo.user_id
                });
            },
            //风控经理
            controller: function () {
                return queryData.getData('project_list/controller_num', {
                    controller_id: userInfo.user_id
                });
            },
            //风控总监
            controllerDirector: function () {
                return queryData.getData('project_list/cd_num', {
                    cd_id: userInfo.user_id
                });
            },
            //项目总监
            projectDirector: function () {
                return queryData.getData('project_list/pd_num', {
                    pd_id: userInfo.user_id
                });
            },
            //项目经理
            projectManager: function () {
                return queryData.getData('project_list/manager_num', {
                    manager_id: userInfo.user_id
                });
            }
        }
    }]);
