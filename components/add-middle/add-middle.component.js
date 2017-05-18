/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目人员统计组件
 */
angular.module('byComponent').component('addMiddle', {
    bindings: {
        middleId: '=',
        nextStep: '&',
        //下一步标题, 默认为下一步
        buttonTitle: '@',
        //来源,默认是创建项目中的添加渠道; 传了source值, 则是普通的创建渠道
        source: '@',
        //跳过
        skipStep: '&'
    },
    templateUrl: '../components/add-middle/add-middle.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity', 'middle', '$timeout', function ($rootScope, $scope, $stateParams, provinceCity, middle, $timeout) {
        /**
         * 1. 初始化, 获取缓存值
         */
        var self = this;
        //默认的按钮标题
        self.buttonTitle = "下一步";

        /**
         * 当缓存值存在时, 则取缓存, 否则默认
         */
        var middleInfo = getObjectFromSessionStorage(SaveMiddleInfoKey);
        if(middleInfo == undefined) {
            //填写渠道默认值
            $scope.middle = {
                type: '',
                sex: '',
                province: '',
                city: ''
            };
        }
        else {
            $scope.middle = $.extend(true, {}, middleInfo);
            self.cacheMiddleInfo = middleInfo;
        }

        /**
         * 2. 事件/网络请求
         */
        //选择省市联动
        provinceCity.province().then(function (data) {
            // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
            $scope.province = data;
            $scope.city = data[0].cities;

            // 省份改变的时候, 选择相应的市
            $scope.provinceChange = function () {
                for (var i = 0; i < data.length; i++) {
                    // 判断如果配置选中的省份,然后获取对应的市的数组
                    if (data[i].name == $scope.middle.province) {
                        $scope.city = data[i].cities;
                        // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
                        $scope.middle.city = data[i].cities[0];
                    }
                }
                if($scope.middle.province == '' || $scope.middle.province == undefined){
                    $scope.middle.city = '';
                }
            }
        });

        //添加渠道
        $scope.addMiddle = function (middleInfo) {
            //未传source, 普通的添加渠道, 直接添加渠道
            if(self.source) {
                console.log(middleInfo);
                middle.add(middleInfo).then(function (data) {
                    console.log(data);
                    self.middleId = data.data.middle_id;
                    //下一步
                    $timeout(function () {
                        self.nextStep();
                    });
                });
            }
            else { //创建项目的添加渠道
                //通过渠道手机号和姓名是否一样来进行判断添加渠道还是更新渠道
                if(self.cacheMiddleInfo == undefined || self.cacheMiddleInfo.middle_id == undefined
                    || self.cacheMiddleInfo.name != middleInfo.name || self.cacheMiddleInfo.phone != middleInfo.phone) {
                    middle.add(middleInfo).then(function (data) {
                        self.middleId = data.data.middle_id;
                        middleInfo.middle_id = data.data.middle_id;
                        //缓存到本地
                        saveObjectToSessionStorage(SaveMiddleInfoKey, middleInfo);
                        //下一步
                        $timeout(function () {
                            self.nextStep();
                        });
                    });
                }
                else {
                    //copy一份新的数据
                    var tmpMiddleInfo = $.extend(true, {}, middleInfo);
                    tmpMiddleInfo.type = userTypeStringFromNumber(tmpMiddleInfo.type);
                    tmpMiddleInfo.sex = sexStringFromNumber(tmpMiddleInfo.sex);
                    //更新修改渠道信息
                    middle.put(tmpMiddleInfo).then(function (data) {
                        self.middleId = middleInfo.middle_id;
                        //缓存到本地
                        saveObjectToSessionStorage(SaveMiddleInfoKey, middleInfo);
                        $timeout(function () {
                            self.nextStep();
                        });
                    });
                }
            }
        };

        //跳过渠道添加
        $scope.skipStep = function () {
            self.skipStep();
        };

        // /**
        //  * 3. 监听middle
        //  */
        // $scope.$watch('middle', function (value) {
        //     saveObjectToSessionStorage(SaveMiddleInfoKey, value);
        // }, true);

    }]
});
