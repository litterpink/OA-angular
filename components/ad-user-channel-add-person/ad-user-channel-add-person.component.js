/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 添加渠道个人信息
 */
angular.module('byComponent').component('adUserChannelAddPerson', {
    templateUrl: '../components/ad-user-channel-add-person/ad-user-channel-add-person.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity', function ($rootScope, $scope, $stateParams, provinceCity) {
        //初始化城市信息
        $scope.vm = {
            entity: {
                province: "北京",
                city: "朝阳"
            }
        };
        // 使用服务获取 省市联动
        provinceCity.province().then(function (data) {
            // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
            $scope.province = data;
            $scope.city = data[0].cities;
            // 省份改变的时候, 选择相应的市
            $scope.provinceChange = function () {
                for (var i = 0; i < data.length; i++) {
                    // 判断如果配置选中的省份,然后获取对应的市的数组
                    if (data[i].name == $scope.vm.entity.province) {
                        $scope.city = data[i].cities;
                        // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
                        $scope.vm.entity.city = data[i].cities[0];
                    }
                }
                if($scope.vm.entity.province == '' || $scope.vm.entity.province == undefined){
                    $scope.vm.entity.city = '';
                }
            }
        });
    }]
});
