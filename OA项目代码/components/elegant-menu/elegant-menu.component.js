/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 菜单组件
 * <elegant-menu options="options">
 */
angular.module('byComponent').component('elegantMenu', {
    bindings: {
        options: '<'
    },
    templateUrl: '../components/elegant-menu/elegant-menu.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', '$timeout', '$state', function ($rootScope, $scope, $stateParams, $timeout, $state) {
        const ElegantMenuSelectedIndexKey = "ElegantMenuSelectedIndexKey";
        const ElegantMenuSubSelectedIndexKey = "ElegantMenuSubSelectedIndexKey";
        var self = this;
        //取出缓存值
        $scope.selectedIndex = sessionStorage.getItem(ElegantMenuSelectedIndexKey);
        $scope.subSelectedIndex = sessionStorage.getItem(ElegantMenuSubSelectedIndexKey);
        $scope.selectMenu = function (index, subIndex) {
            $scope.selectedIndex = index;
            //子菜单选择项
            $scope.subSelectedIndex = subIndex;
            
            //存储起来
            sessionStorage.setItem(ElegantMenuSelectedIndexKey, index);
            sessionStorage.setItem(ElegantMenuSubSelectedIndexKey, subIndex);
        };

        // console.log($state.$current);

        /**
         * 这个操作主要是处理ui-router中的bug, 如果第一次没有ui-sref-active正确, 则记录起来, 重新刷新一遍
         */
        var isNeedRefresh = false;
        if($state.$current.name == "") {
            isNeedRefresh = true;
        }

        $timeout(function () {
            //需要刷新, 则再次进入当前控制器
            if(isNeedRefresh) {
                $state.reload($state.$current.name);
                isNeedRefresh = false;
            }
        });
        // self.options = [
        //     {
        //         name: '项目管理',
        //         imageName: '../common/images/project-manage.png',
        //         options: [
        //             {
        //                 name: '项目列表',
        //                 // uiSref: "project.list({status: 0})", //路由事件的ui-sref
        //                 selectEvent: function (index, subIndex) {
        //                     console.log('选择的index = ' + index + ', subIndex = ' + subIndex);
        //                 }, //选择事件
        //             },
        //             {
        //                 name: '新建项目',
        //                 // uiSref: "project.list({status: 0})", //路由事件的ui-sref
        //                 selectEvent: function (index, subIndex) {
        //                     console.log('选择的index = ' + index + ', subIndex = ' + subIndex);
        //                 }, //选择事件
        //             }
        //         ]// 第二层选项
        //     },
        //     {
        //         name: '客户管理',
        //         imageName: '../common/images/client-manage.png',
        //         options: [
        //             {
        //                 name: '客户列表',
        //                 // uiSref: "project.list({status: 0})", //路由事件的ui-sref
        //                 selectEvent: function (index, subIndex) {
        //                     console.log('选择的index = ' + index + ', subIndex = ' + subIndex);
        //                 }, //选择事件
        //             },
        //             {
        //                 name: '添加客户',
        //                 // uiSref: "project.list({status: 0})", //路由事件的ui-sref
        //                 selectEvent: function (index, subIndex) {
        //                     console.log('选择的index = ' + index + ', subIndex = ' + subIndex);
        //                 }, //选择事件
        //             }
        //         ]// 第二层选项
        //     },
        //     {
        //         name: '渠道管理',
        //         imageName: '../common/images/middle-manage.png',
        //         options: [
        //             {
        //                 name: '渠道列表',
        //                 // uiSref: "project.list({status: 0})", //路由事件的ui-sref
        //                 selectEvent: function (index, subIndex) {
        //                     console.log('选择的index = ' + index + ', subIndex = ' + subIndex);
        //                 }, //选择事件
        //             },
        //             {
        //                 name: '添加渠道',
        //                 // uiSref: "project.list({status: 0})", //路由事件的ui-sref
        //                 selectEvent: function (index, subIndex) {
        //                     console.log('选择的index = ' + index + ', subIndex = ' + subIndex);
        //                 }, //选择事件
        //             }
        //         ]// 第二层选项
        //     },
        //     {
        //         name: '律师大数据',
        //         imageName: '../common/images/lawyer-manage.png',
        //     },
        //     {
        //         name: '数据管理',
        //         imageName: '../common/images/data-manage.png',
        //     },
        // ];
    }]
});
