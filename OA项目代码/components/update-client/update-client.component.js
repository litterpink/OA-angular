/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 更新客户的组件
 */
angular.module('byComponent').component('updateClient', {
    bindings: {
        client: '<',
        //修改类型, 默认修改全部客户类型, 2:修改基本信息, 3:修改备注
        type: '@'
    },
    templateUrl: '../components/update-client/update-client.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity', function ($rootScope, $scope, $stateParams, provinceCity) {
        var self = this;
        /**
         * 1. 监听属性值的变化
         */
        self.$onChanges = function (object) {
            consoleLog(object);
            if(object.type != undefined) {
                $scope.type = object.type.currentValue;
            }
            if(object.client != undefined) {
                if(object.client.currentValue == undefined) {
                    // 设置默认值
                    $scope.client = {
                        type: '个人客户',
                        sex: '男',
                        level: '普通客户',
                        // province: '请选择省份',
                        // city: '请选择城市'
                    };
                }
                else {
                    $scope.client = object.client.currentValue;
                    //省份数据存在, 则联动
                    updateCities();
                }
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
                if (data[i].name == $scope.client.province) {
                    $scope.city = data[i].cities;
                }
            }
        }

        // 省份改变的时候, 选择相应的市
        $scope.provinceChange = function () {
            updateCities();
            // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
            $scope.client.city = $scope.city[0];
        };
    }]
});
