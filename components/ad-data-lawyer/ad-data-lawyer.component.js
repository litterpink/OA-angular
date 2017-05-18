/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 律师统计
 */
angular.module('byComponent').component('adDataLawyer', {
    templateUrl: '../components/ad-data-lawyer/ad-data-lawyer.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'queryData',function ($rootScope, $scope, $stateParams,queryData) {
        /**
         * 1.  配置菜单
         */
        $scope.menuOptions = [
            {
                name: '增加情况'
            },
            {
                name: '全部律师'
            },
            {
                name: '大律师'
            }
        ];
        $scope.selectedIndex = 0;

        queryData.getData('Count/add').then(function (data) {
            console.log(data);
            $scope.countDay = data.data.day;
            $scope.countWeek = data.data.week;
            $scope.countMonth = data.data.month;
        });
        $scope.selectIndex = function (index) {
            if(index == 1){
                //全部律师地域统计
                queryData.getData('count/lawyer_china').then(function (data) {
                    if(data.status == true){
                        console.log(data);
                        //统计表数据
                        $scope.zw = data.data.zw;
                        $scope.total = data.data.total.num;

                        //中国地图数据
                        var dom = document.getElementById("chinaMap");
                        var myChart = echarts.init(dom);

                        var app = {};
                        var option = null;
                        option = {
                            title : {
                                text: ' ',
                                subtext: ' ',
                                x:'center'
                            },
                            tooltip : {
                                trigger: 'item'
                            },
                            dataRange: {
                                show:false,              //false就隐藏了
                                min: 0,
                                max: 7,
                                x: 'left',
                                y: 'bottom',
                                text: ['高', '低'],
                                calculable: true,
                                color:["red","white"]
                            },
                            toolbox: {
                                show: true,
                                orient : 'vertical',
                                x: 'right',
                                y: 'center',
                                feature : {
                                    mark : {show: true},
                                    dataView : {show: true, readOnly: false},
                                    restore : {show: true},
                                    saveAsImage : {show: true}
                                }
                            },

                            series : [
                                {
                                    name: '律师人数',
                                    type: 'map',
                                    mapType: 'china',
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    itemStyle:{
                                        normal: {
                                            label: {
                                                show: true,
                                                textStyle: {
                                                    //fontWeight:'bold',
                                                    color: "#231816"
                                                }
                                            }
                                        },
                                        emphasis:{label:{show:true}}
                                    },


                                    data:[
                                        {name: '北京',value: data.data.china.beijing.value},
                                        {name: '安徽',value: data.data.china.anhui.value},
                                        {name: '重庆',value: data.data.china.chongqing.value},
                                        {name: '福建',value: data.data.china.fujian.value},
                                        {name: '甘肃',value: data.data.china.gansu.value},
                                        {name: '广东',value: data.data.china.guangdong.value},
                                        {name: '广西',value: data.data.china.guangxi.value},
                                        {name: '贵州',value: data.data.china.guizhou.value},
                                        {name: '海南',value: data.data.china.hainan.value},
                                        {name: '河北',value: data.data.china.hebei.value},
                                        {name: '黑龙江',value: data.data.china.heilongjiang.value},
                                        {name: '河南',value: data.data.china.henan.value},
                                        {name: '香港',value: data.data.china.hongkong.value},
                                        {name: '湖北',value: data.data.china.hubei.value},
                                        {name: '湖南',value: data.data.china.hunan.value},
                                        {name: '江苏',value: data.data.china.jiangsu.value},
                                        {name: '江西',value: data.data.china.jiangxi.value},
                                        {name: '吉林',value: data.data.china.jilin.value},
                                        {name: '辽宁',value: data.data.china.liaoning.value},
                                        {name: '澳门',value: data.data.china.macau.value},
                                        {name: '内蒙古',value: data.data.china.neimongol.value},
                                        {name: '宁夏',value: data.data.china.ningxia.value},
                                        {name: '青海',value: data.data.china.qinghai.value},
                                        {name: '陕西',value: data.data.china.shaanxi.value},
                                        {name: '山东',value: data.data.china.shandong.value},
                                        {name: '上海',value: data.data.china.shanghai.value},
                                        {name: '山西',value: data.data.china.shanxi.value},
                                        {name: '四川',value: data.data.china.sichuan.value},
                                        {name: '台湾',value: data.data.china.taiwan.value},
                                        {name: '天津',value: data.data.china.tianjin.value},
                                        {name: '新疆',value: data.data.china.xinjiang.value},
                                        {name: '西藏',value: data.data.china.xizang.value},
                                        {name: '云南',value: data.data.china.yunnan.value},
                                        {name: '浙江',value: data.data.china.zhejiang.value},

                                    ]
                                }

                            ]
                        };
                        myChart.showLoading();//加载数据前显示的动画效果
                        myChart.hideLoading();//加载数据完成后隐藏动画
                        myChart.setOption(option);
                        //注入信息
                        if (option && typeof option === "object") {
                            myChart.setOption(option, true);
                        }
                        //添加点击事件
                        myChart.on('click', function (params) {
                            var city = params.name;
                            var value = params.value;
                            if(isNaN(value) || value == 0){
                                console.log("失败");
                            }else {
                                sessionStorage.setItem('provinceMap',city);
                                window.location = "#/user/lawyer/all";
                            }
                        });


                    }else {
                        alert(data.message);
                    }
                });
            }else if(index == 2){
                //大律师地域统计
                queryData.getData('count/lawyer_china',{judicial_type: 1}).then(function (data) {
                    if(data.status == true){
                        console.log(data);
                        //统计表数据
                        $scope.zw2 = data.data.zw;
                        $scope.total2 = data.data.total.num;

                        //中国地图数据
                        var dom2 = document.getElementById("chinaMap2");
                        var myChart2 = echarts.init(dom2);

                        var app = {};
                        var option = null;
                        option = {
                            title : {
                                text: ' ',
                                subtext: ' ',
                                x:'center'
                            },
                            tooltip : {
                                trigger: 'item'
                            },
                            dataRange: {
                                show:false,              //false就隐藏了
                                min: 0,
                                max: 7,
                                x: 'left',
                                y: 'bottom',
                                text: ['高', '低'],
                                calculable: true,
                                color:["red","#9cd2f4","white"]
                            },
                            toolbox: {
                                show: false,
                                orient : 'vertical',
                                x: 'right',
                                y: 'center',
                                feature : {
                                    mark : {show: true},
                                    dataView : {show: true, readOnly: false},
                                    restore : {show: true},
                                    saveAsImage : {show: true}
                                }
                            },

                            series : [
                                {
                                    name: '大律师人数',
                                    type: 'map',
                                    mapType: 'china',
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    itemStyle:{
                                        normal: {
                                            label: {
                                                show: true,
                                                textStyle: {
                                                    //fontWeight:'bold',
                                                    color: "#231816"
                                                }
                                            }
                                        },
                                        emphasis:{label:{show:true}}
                                    },


                                    data:[
                                        {name: '北京',value: data.data.china.beijing.value},
                                        {name: '安徽',value: data.data.china.anhui.value},
                                        {name: '重庆',value: data.data.china.chongqing.value},
                                        {name: '福建',value: data.data.china.fujian.value},
                                        {name: '甘肃',value: data.data.china.gansu.value},
                                        {name: '广东',value: data.data.china.guangdong.value},
                                        {name: '广西',value: data.data.china.guangxi.value},
                                        {name: '贵州',value: data.data.china.guizhou.value},
                                        {name: '海南',value: data.data.china.hainan.value},
                                        {name: '河北',value: data.data.china.hebei.value},
                                        {name: '黑龙江',value: data.data.china.heilongjiang.value},
                                        {name: '河南',value: data.data.china.henan.value},
                                        {name: '香港',value: data.data.china.hongkong.value},
                                        {name: '湖北',value: data.data.china.hubei.value},
                                        {name: '湖南',value: data.data.china.hunan.value},
                                        {name: '江苏',value: data.data.china.jiangsu.value},
                                        {name: '江西',value: data.data.china.jiangxi.value},
                                        {name: '吉林',value: data.data.china.jilin.value},
                                        {name: '辽宁',value: data.data.china.liaoning.value},
                                        {name: '澳门',value: data.data.china.macau.value},
                                        {name: '内蒙古',value: data.data.china.neimongol.value},
                                        {name: '宁夏',value: data.data.china.ningxia.value},
                                        {name: '青海',value: data.data.china.qinghai.value},
                                        {name: '陕西',value: data.data.china.shaanxi.value},
                                        {name: '山东',value: data.data.china.shandong.value},
                                        {name: '上海',value: data.data.china.shanghai.value},
                                        {name: '山西',value: data.data.china.shanxi.value},
                                        {name: '四川',value: data.data.china.sichuan.value},
                                        {name: '台湾',value: data.data.china.taiwan.value},
                                        {name: '天津',value: data.data.china.tianjin.value},
                                        {name: '新疆',value: data.data.china.xinjiang.value},
                                        {name: '西藏',value: data.data.china.xizang.value},
                                        {name: '云南',value: data.data.china.yunnan.value},
                                        {name: '浙江',value: data.data.china.zhejiang.value},

                                    ]
                                }

                            ]
                        };
                        myChart2.showLoading();//加载数据前显示的动画效果
                        myChart2.hideLoading();//加载数据完成后隐藏动画
                        myChart2.setOption(option);
                        //注入信息
                        if (option && typeof option === "object") {
                            myChart2.setOption(option, true);
                        }
                        //添加点击事件
                        myChart2.on('click', function (params) {
                            var city = params.name;
                            var value = params.value;
                            if(isNaN(value)){
                                console.log("失败");
                            }else {
                                sessionStorage.setItem('provinceMap',city);
                                window.location = "#/user/lawyer/all";
                            }
                        });


                    }else {
                        alert(data.message);
                    }
                });

            }
        };



    }]
});
