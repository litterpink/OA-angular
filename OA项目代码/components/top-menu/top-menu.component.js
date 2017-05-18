/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('topMenu', {
    bindings: {
        //类型 0: 带路由的菜单   1: 不带路由,只是UI操作
        type: '@',
        //配置数据
        options: '<',
        //选中事件
        select: '&',
        //选中的索引
        selectedIndex: '=',
        //控件的名字
        name: '@'
    },
    templateUrl: '../components/top-menu/top-menu.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', '$timeout', function ($rootScope, $scope, $stateParams, $timeout) {
        var self = this;
        self.$onInit = function () {
            self.type = 0;
        };

        //选中事件
        $scope.selectIndex = function (index) {
            self.selectedIndex = index;
            //使用timeout,使其已经同步完再调用事件
            $timeout(function () {
                self.select();
            });
        };
        // self.options = [
        //     {
        //         'name': '所有',
        //         'num': 10,
        //     },
        //     {
        //         'name': '未提交评估',
        //         'num': 10,
        //     },
        //     {
        //         'name': '评估中',
        //         'num': 10,
        //     },
        //     {
        //         'name': '待签约',
        //         'num': 10,
        //     },
        //     {
        //         'name': '督办中',
        //         'num': 10,
        //     },
        //     {
        //         'name': '已结项',
        //         'num': 10,
        //     },
        //     {
        //         'name': '退回补充材料',
        //         'num': 10,
        //     }
        // ];
    }]
});
