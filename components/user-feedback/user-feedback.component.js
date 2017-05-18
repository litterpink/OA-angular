/**
 * 意见反馈
 */
'use strict';

angular.module('byComponent').component('userFeedback', {
    templateUrl: '../components/user-feedback/user-feedback.template.html',
    controller: ['$scope', 'queryData','toast', '$state', function ($scope, queryData,toast, $state) {
        var userInfo = getUserInfo();
        var user_id = userInfo.user_id;
        var type = userInfo.type;
        $scope.submitFeedback = function (feedback) {
            var params = {
                user_id: user_id,
                feedback_info: feedback,
                type: type
            };
            queryData.postData('Comment/feedback',params).then(function (data) {
                toast.show('提交反馈成功', 2000, function () {
                    window.location.href = "#";
                });
            });
        }
    }]
});
