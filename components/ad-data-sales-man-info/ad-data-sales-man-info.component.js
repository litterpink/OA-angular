/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 销售人员信息
 */
angular.module('byComponent').component('adDataSalesManInfo', {
    templateUrl: '../components/ad-data-sales-man-info/ad-data-sales-man-info.template.html',
    controller: ['$rootScope', '$scope', '$stateParams','queryData', function ($rootScope, $scope, $stateParams,queryData) {
        //获取销售人员基本信息
        queryData.getData('count/sales_brief',{sales_id: $stateParams.id}).then(function (data) {
            $scope.salesInfo = data.data; 
            console.log(data);
        });
        //案件状态饼状图
        queryData.getData('count/sales_case_status',{sales_id: $stateParams.id}).then(function (data) {
            console.log(data);
            $scope.already_knot = data.data.already_knot;
            $scope.contract_in = data.data.contract_in;
            $scope.in_evaluated = data.data.in_evaluated;
            $scope.not_evaluated = data.data.not_evaluated;
            $scope.not_through = data.data.not_through;
            $scope.successful_signing = data.data.successful_signing;
            $scope.supervision = data.data.supervision;
        });
        
        //更新柱形图
        function updateColumnDiagram(columnId, data) {
            console.log(data);
            var series = [{
                name: 'Brands',
                colorByPoint: true,
                data: [
                    {
                        name: data[3].time,
                        color: "#ec6b27",
                        y: parseInt(data[3].num)
                    },
                    {
                        name: data[2].time,
                        color: "#f5b32b",
                        y: parseInt(data[2].num)
                    },
                    {
                        name: data[1].time,
                        color: "#25b38b",
                        y: parseInt(data[1].num)
                    },
                    {
                        name: data[0].time,
                        color: "#5c69ad",
                        y: parseInt(data[0].num)
                    }
                ]
            }];
            $('#' + columnId).highcharts({
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

        //请求案件提交统计
        function loadCaseSubmit(type) {
            console.log(type);
            //选择的type
            $scope.submitType = type;
            queryData.getData('count/sales_case_submit', {
                type: type,
                sales_id: $stateParams.id
            }).then(function (data) {
                console.log(data);
                switch (type) {
                    case 'week':
                        updateColumnDiagram('saleman2', data.data.week)
                        break;
                    case 'month':
                        updateColumnDiagram('saleman2', data.data.month);
                        break;
                    case 'season':
                        updateColumnDiagram('saleman2',data.data.season);
                        break;
                }
            });
        }

        //请求签约案件统计
        function loadCaseSign(type) {
            $scope.signType = type;
            queryData.getData('count/sales_case_sign', {
                type: type,
                sales_id: $stateParams.id
            }).then(function (data) {
                console.log(data);
                switch (type) {
                    case 'week':
                        updateColumnDiagram('saleman3', data.data.week)
                        break;
                    case 'month':
                        updateColumnDiagram('saleman3', data.data.month);
                        break;
                    case 'season':
                        updateColumnDiagram('saleman3',data.data.season);
                        break;
                }
            });
        }

        //默认显示周的数量
        loadCaseSubmit('week');
        loadCaseSign('week');

        $(".week1").click(function () {
            console.log('点击周');
            loadCaseSubmit('week');
        });
        $(".month1").click(function () {
            loadCaseSubmit('month');
        });
        $(".season1").click(function () {
            loadCaseSubmit('season')
        });

        $(".week2").click(function () {
            loadCaseSign('week');
        });
        $(".month2").click(function () {
            loadCaseSign('month');
        });
        $(".season2").click(function () {
            loadCaseSign('season');
        });
    }]
});
