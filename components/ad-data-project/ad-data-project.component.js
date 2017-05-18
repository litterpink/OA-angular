/**
 * Created by liuchungui on 16/8/31.
 */
'use strict';
/**
 * 项目统计
 */
angular.module('byComponent').component('adDataProject', {
    templateUrl: '../components/ad-data-project/ad-data-project.template.html',
    controller: ['$rootScope', '$scope', '$stateParams', 'queryData', function ($rootScope, $scope, $stateParams,queryData) {
        //项目统计数据
        queryData.getData('count/project_brief',{type: 'week'}).then(function (data) {
            console.log(data);
            $scope.total = data.data;
            $scope.proportion = data.data.proportion;
            //项目状态分布饼状图
       /*     var series = [{
                    type: 'pie',
                    name: '人数',
                    data: [
                        [$scope.proportion[0].status,$scope.proportion[0].num*1],
                        {
                            name: $scope.proportion[1].status,
                            y: $scope.proportion[1].num*1,
                            sliced: true,
                            selected: true
                        }
                        //[$scope.proportion[2].status,$scope.proportion[2].num*1],
                    ]
                }];
            $('#project2').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: ' '
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                credits: {
                    enabled:false
                },
                series: series
            });*/
        });
    }]
});
