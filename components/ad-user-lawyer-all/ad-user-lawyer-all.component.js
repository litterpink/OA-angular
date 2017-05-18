/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 全部律师
 */
angular.module('byComponent').component('adUserLawyerAll', {
    templateUrl: '../components/ad-user-lawyer-all/ad-user-lawyer-all.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'provinceCity','queryData','$http', '$state', function ($rootScope, $scope, $stateParams, provinceCity,queryData,$http, $state) {
        $scope.lawyer = {
            province: '',
            city: ''
        };
        /**
         *  获取省市联动
         */
        provinceCity.province().then(function (data) {
            // 首先路由加载的时候显示省份信息, 和第一个省份(北京)对应的市信息
            $scope.province = data;
            $scope.city = data[0].cities;

            // 省份改变的时候, 选择相应的市
            $scope.provinceChange = function () {
                for (var i = 0; i < data.length; i++) {
                    // 判断如果配置选中的省份,然后获取对应的市的数组
                    if (data[i].name == $scope.lawyer.province) {
                        $scope.city = data[i].cities;
                        // 设置默认值, 切换省份的时候, 市级默认选择数组里面的第一个
                        $scope.lawyer.city = data[i].cities[0];
                    }
                }
                if($scope.lawyer.province == '' || $scope.lawyer.province == undefined){
                    $scope.lawyer.city = '';
                }
            }
        });
        /* 写到各自的控制器中,要不然一次付给好多court种 */
        /* 搜索到法院,单击赋值 */
        $scope.changeVal = function (newVal, pro) {
            $scope.searchVal = newVal;
            $scope.lawyer.court = newVal;
            $scope.matchingprovince = pro;
            $(".resultList").hide();
        };
        $scope.showList = function () {
            $(".resultList").show();
            $(".search").focus();
            $scope.searchVal = "";
        };
        //查询全部信息
        var user_id= JSON.parse(sessionStorage.getItem('userInfo')).user_id;
        var provinceMap = sessionStorage.getItem('provinceMap');
      
        $scope.lawyer.province = provinceMap;

        $scope.$watch('lawyer',function () {
            var params = $scope.lawyer;
            if (params.judicial_type == "1") {
                params.court = $scope.lawyer.court
            }
            if (params.judicial_type == "2") {
                params.procuratorate = $scope.lawyer.procuratorate
            }
            if (params.judicial_type == "3") {
                params.police = $scope.lawyer.police
            }
            if (params.judicial_type == "4") {
                params.organi_name = $scope.lawyer.organi_name
            }
            params.uid = user_id;
            console.log(params);
            queryData.getData('User_lawyer/lawyers',params).then(function (data) {
                console.log(data);
                sessionStorage.removeItem('provinceMap');
                if(data.status == true){
                    $scope.infos = data.data.data;

                    $scope.maxItems = data.data.maxRows;
                    $scope.maxPage = data.data.maxPage;

                    // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
                    $scope.maxSize = 5; // 显示最大页数
                    $scope.bigTotalItems = $scope.maxItems;
                    $scope.bigCurrentPage = 1;
                }else {
                    alert(data.message);
                }
            });
        },true);
        //点击分页
        $scope.pageChanged = function (page) {
            var params = $scope.lawyer;
            params.uid = user_id;
            params.page = page;
            console.log(params);
            queryData.getData('User_lawyer/lawyers',params).then(function (data) {
                $scope.infos = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;
            });

        };
    }]
});
