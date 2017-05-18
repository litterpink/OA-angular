/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 风控人员信息
 */
angular.module('byComponent').component('adDataWindowControlInfo', {
    templateUrl: '../components/ad-data-window-control-info/ad-data-window-control-info.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {
        var user_id = $stateParams.id;
        //获取风控人员基本信息
        //风控经理
        //风控总监
        //分析师
        var countUserType = sessionStorage.getItem('countUserType');

        switch (countUserType){
            case "风控经理" :
                queryData.getData('count/controller',{controller_id: user_id}).then(function (data) {
                    console.log(data);
                    $scope.windInfo = data.data;
                    getData('count/controller',1);
                });
                break;
            case "风控总监" :
                queryData.getData('count/cd',{c_director_id: user_id}).then(function (data) {
                    console.log(data);
                    $scope.windInfo = data.data;
                    getData('count/cd',2);
                });
                break;
            case "市场分析师" :
                queryData.getData('count/analyst',{analyst_id: user_id}).then(function (data) {
                    console.log(data);
                    $scope.windInfo = data.data;
                    getData('count/analyst',3);
                });
                break;
        }

            //周
            function weekData(url,data) {
                $.ajax({
                    type: "get",
                    url: ServerURL + url,
                    data: data,
                    success: function (data) {
                        console.log(data);
                        var weekname1 = data.data.week[3].time;
                        var weekname2 = data.data.week[2].time;
                        var weekname3 = data.data.week[1].time;
                        var weekname4 = data.data.week[0].time;

                        var weeknum1 = parseInt(data.data.week[3].num);
                        var weeknum2 = parseInt(data.data.week[2].num);
                        var weeknum3 = parseInt(data.data.week[1].num);
                        var weeknum4 = parseInt(data.data.week[0].num);


                        console.log(data);
                        var series = [{
                            name: 'Brands',
                            colorByPoint: true,
                            data: [
                                {
                                    name: weekname1,
                                    color: "#ec6b27",
                                    y: weeknum1
                                },
                                {
                                    name: weekname2,
                                    color: "#f5b32b",
                                    y: weeknum2
                                },
                                {
                                    name: weekname3,
                                    color: "#25b38b",
                                    y: weeknum3
                                },
                                {
                                    name: weekname4,
                                    color: "#5c69ad",
                                    y: weeknum4
                                }
                            ]
                        }];
                        $('#windcontrol').highcharts({
                            chart: {
                                type: 'column',
                                backgroundColor: 'rgba(255, 255, 255, 0)'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                type: 'category'
                            },
                            yAxis: {
                                title: {
                                    text: '案件数量'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    }
                                }
                            },
                            credits: {
                                enabled:false
                            },
                            tooltip: {
                                headerFormat: '{point.y}',
                                // 经过的显示的内容
                                pointFormat: ''
                            },
                            // 这是动态数据,统计图的,以后要在前面angularJS获取定义变量,在这里调用.
                            series: series
                        });
                    }
                })
            }
            //月
            function monthData(url,data) {
                $.ajax({
                    type: "get",
                    url: ServerURL + url,
                    data: data,
                    success: function (data) {
                        var monthname1 = data.data.month[3].time;
                        var monthname2 = data.data.month[2].time;
                        var monthname3 = data.data.month[1].time;
                        var monthname4 = data.data.month[0].time;

                        var monthnum1 = parseInt(data.data.month[3].num);
                        var monthnum2 = parseInt(data.data.month[2].num);
                        var monthnum3 = parseInt(data.data.month[1].num);
                        var monthnum4 = parseInt(data.data.month[0].num);


                        console.log(data);
                        var series = [{
                            name: 'Brands',
                            colorByPoint: true,
                            data: [
                                {
                                    name: monthname1,
                                    color: "#ec6b27",
                                    y: monthnum1
                                },
                                {
                                    name: monthname2,
                                    color: "#f5b32b",
                                    y: monthnum2
                                },
                                {
                                    name: monthname3,
                                    color: "#25b38b",
                                    y: monthnum3
                                },
                                {
                                    name: monthname4,
                                    color: "#5c69ad",
                                    y: monthnum4
                                }
                            ]
                        }];
                        $('#windcontrol').highcharts({
                            chart: {
                                type: 'column',
                                backgroundColor: 'rgba(255, 255, 255, 0)'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                type: 'category'
                            },
                            yAxis: {
                                title: {
                                    text: '案件数量'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    }
                                }
                            },
                            credits: {
                                enabled:false
                            },
                            tooltip: {
                                headerFormat: '{point.y:}',
                                // 经过的显示的内容
                                pointFormat: ''
                            },
                            // 这是动态数据,统计图的,以后要在前面angularJS获取定义变量,在这里调用.
                            series: series
                        });
                    }
                })
            }
            //季
            function seasonData(url,data) {
                $.ajax({
                    type: "get",
                    url: ServerURL + url,
                    data: data,
                    success: function (data) {
                        var seasonname1 = data.data.season[3].time;
                        var seasonname2 = data.data.season[2].time;
                        var seasonname3 = data.data.season[1].time;
                        var seasonname4 = data.data.season[0].time;

                        var seasonnum1 = parseInt(data.data.season[3].num);
                        var seasonnum2 = parseInt(data.data.season[2].num);
                        var seasonnum3 = parseInt(data.data.season[1].num);
                        var seasonnum4 = parseInt(data.data.season[0].num);


                        console.log(data);
                        var series = [{
                            name: 'Brands',
                            colorByPoint: true,
                            data: [
                                {
                                    name: seasonname1,
                                    color: "#ec6b27",
                                    y: seasonnum1
                                },
                                {
                                    name: seasonname2,
                                    color: "#f5b32b",
                                    y: seasonnum2
                                },
                                {
                                    name: seasonname3,
                                    color: "#25b38b",
                                    y: seasonnum3
                                },
                                {
                                    name: seasonname4,
                                    color: "#5c69ad",
                                    y: seasonnum4
                                }
                            ]
                        }];
                        $('#windcontrol').highcharts({
                            chart: {
                                type: 'column',
                                backgroundColor: 'rgba(255, 255, 255, 0)'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                type: 'category'
                            },
                            yAxis: {
                                title: {
                                    text: '案件数量'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    }
                                }
                            },
                            credits: {
                                enabled:false
                            },
                            tooltip: {
                                headerFormat: '{point.y}',
                                // 经过的显示的内容
                                pointFormat: ''
                            },
                            // 这是动态数据,统计图的,以后要在前面angularJS获取定义变量,在这里调用.
                            series: series
                        });
                    }
                })
            }
            //1.风控经理  2.风控总监  3.分析师
            function getData(url,type) {
                var object = {};
                object.type = 'week';
                switch (type) {
                    case 1:
                        object.controller_id = user_id;
                        break;
                    case 2:
                        object.c_director_id = user_id;
                        break;
                    case 3:
                        object.analyst_id = user_id;
                        break;
                }
                weekData(url,object);
                $(".week").click(function () {
                    object.type = 'week';
                    weekData(url,object);
                });
                $(".month").click(function () {
                    object.type = 'month';
                    monthData(url, object);
                });
                $(".season").click(function () {
                    object.type = 'season';
                    seasonData(url,object);
                });
            }
    }]
});
