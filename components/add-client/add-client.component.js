/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 添加客户组件
 */
angular.module('byComponent').component('addClient', {
    bindings: {
        clientId: '=',
        nextStep: '&',
        /**
         * 下一步标题, 默认为下一步
         */
        buttonTitle: '@',
        //来源,默认是创建项目中的添加客户; 传了source值, 则是普通的创建客户
        source: '@'
    },
    templateUrl: '../components/add-client/add-client.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity', 'client', '$timeout', function ($rootScope, $scope, $stateParams, provinceCity, client, $timeout) {
        var self = this;
        /**
         * 1. 设置默认值,配置富文本
         */
        //查看缓存中是否有此对象, 有的话, 取缓存使用, 无则给默认值
        var clientInfo = getObjectFromSessionStorage(SaveClientInfoKey);
        if(clientInfo != undefined) {
            $scope.client = $.extend(true, {}, clientInfo);
            //copy一个原始数据
            self.cacheClientInfo = clientInfo;
        }
        else {
            $scope.client = {
                type: '4',
                level: '3'
            };
        }

        if(self.buttonTitle == undefined) {
            self.buttonTitle = "下一步";
        }

        //传了source值, 则说明是普通的创建客户
        if(self.source) {
            $scope.client.level = '1';
        }

        /**
         * 2. 获取省市联动
         */
        provinceCity.province().then(function (data) {
            // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
            $scope.province = data;
            $scope.city = data[0].cities;

            // 省份改变的时候, 选择相应的市
            $scope.provinceChange = function () {
                for (var i = 0; i < data.length; i++) {
                    // 判断如果配置选中的省份,然后获取对应的市的数组
                    if (data[i].name == $scope.client.province) {
                        $scope.city = data[i].cities;
                        // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
                        $scope.client.city = data[i].cities[0];
                    }
                }
                if($scope.client.province == '' || $scope.client.province == undefined){
                    $scope.client.city = '';
                }
            }
        });

        /**
         * 3. 事件处理
         */
        $scope.saveEntity = function (clientInfo) {
            console.log(clientInfo);
            //未传source, 则直接添加客户
            if(self.source) {
                client.add(clientInfo).then(function (data) {
                    self.clientId = data.data.client_id;
                    $timeout(function () {
                        self.nextStep();
                    });
                });
            }
            else { //添加项目时的录入客户
                //判断是更新用户还是添加用户
                if(self.cacheClientInfo == undefined || self.cacheClientInfo.client_id == undefined
                    || clientInfo.name != self.cacheClientInfo.name || clientInfo.phone != self.cacheClientInfo.phone) {
                    client.add(clientInfo).then(function (data) {
                        self.clientId = data.data.client_id;
                        clientInfo.client_id = self.clientId;
                        //缓存到本地
                        saveObjectToSessionStorage(SaveClientInfoKey, clientInfo);
                        $timeout(function () {
                            self.nextStep();
                        });
                    });
                }
                else {
                    //copy一份
                    var tmpClientInfo = $.extend(true, {}, clientInfo);
                    tmpClientInfo.level = levelStringFromNumber(tmpClientInfo.level);
                    tmpClientInfo.type = userTypeStringFromNumber(tmpClientInfo.type);
                    tmpClientInfo.sex = sexStringFromNumber(tmpClientInfo.sex);
                    client.put(tmpClientInfo).then(function (data) {
                        self.clientId = clientInfo.client_id;
                        //缓存到本地
                        saveObjectToSessionStorage(SaveClientInfoKey, clientInfo);
                        $timeout(function () {
                            self.nextStep();
                        });
                    })
                }
            }
        };

        // //监听client, 并进行保存
        // $scope.$watch('client', function (client) {
        //     saveObjectToSessionStorage(SaveClientInfoKey, client);
        // }, true);

        //选择客户类型
        $scope.selectClientType = function (type) {
            $scope.client.type = type;
        };
    }]
});
