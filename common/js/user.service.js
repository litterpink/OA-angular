/**
 * Created by liuchungui on 16/9/14.
 */
/**
 * 对用户的服务模块
 */
angular.module('user.service', ['mix.service'])
    //基本用户操作
    .factory("user", ['queryData', function (queryData) {
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            /**
             * 查看内部人员简略信息列表
             * @param $params
             */
            staffList: function ($params) {
                return queryData.getData('user/staff_brief', $params);
            },
            /**
             * 获取人员列表接口
             * @param $params
             */
            userList: function ($params) {
                return queryData.getData('user/users', $params);
            },

            /**
             * 通过手机号/姓名/用户类型获取用户简要信息
             * @param $params
             */
            usersInfo: function ($params) {
                consoleLog($params);
                return queryData.getData('user/users_info', $params);
            }
            
        }
    }])
    //对客户的操作
    .factory("client", ['queryData', function (queryData) {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //添加客户
            add: function ($params) {
                $params.sales_id = userInfo.user_id;
                $params.create_by = userInfo.user_id;
                return queryData.postData('user_client/client', $params);
            },
            //查询客户详细信息
            get: function (clientId) {
                return queryData.getData('user_client/client', {
                    user_id: clientId
                });
            },
            //修改
            put: function (params) {
                params.sales_id = userInfo.sales_id;
                return queryData.putData('user_client/client', params);
            }
        }
    }])
    //对渠道的操作
    .factory("middle", ['queryData', function (queryData) {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //添加渠道
            add: function (params) {
                params.sales_id = userInfo.user_id;
                params.create_by = userInfo.user_id;
                return queryData.postData('user_middle/middle', params);
            },
            //修改渠道
            put: function (params) {
                params.sales_id = userInfo.user_id;
                return queryData.putData('User_middle/middle', params);
            }
        }
    }])
    //对律师的操作
    .factory("lawyer", ['queryData', function (queryData) {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //查询律师列表信息
            queryList: function ($params) {
                $params.uid = userInfo.user_id;
                return queryData.getData('user_lawyer/lawyers', $params);
            }
        }
    }])
    //收藏
    .factory("collection", ['queryData', function (queryData) {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //查询收藏的用户
            query: function (params) {
                params.collector_id = userInfo.user_id;
                return queryData.getData('collection/collections', params);
            }
        }
    }])
    //互动
    .factory("interact", ['queryData', function (queryData) {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return {
            //添加互动
            post: function (params) {
                //设置帮帮内部员工
                params.interacter_id = userInfo.user_id;
                return queryData.postData('interact/interact', params);
            },
            //修改互动
            put: function (params) {
                return queryData.putData('interact/interact', params);
            }
        };
    }])
    //登录相关
    .factory("login", ['queryData', function (queryData) {
        //修改密码
        var userInfo = getUserInfo();
        return {
            updatePass: function (params) {
                params.user_id = userInfo.user_id;
                return queryData.postData('login/pass_update', params);
            }
        }
    }])
    //反馈意见
    .factory("feedback", ['queryData', function (queryData) {
        return {
            list: function (params) {
                return queryData.getData('comment/feedback', params);
            },
            put: function (params) {
                return queryData.putData('comment/feedback', params);
            }
        }
    }]);
