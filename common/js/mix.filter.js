angular.module("mix.filter", [])
.filter("homeFilter", function() {
    return function() {

    }
})
// splitArr
.filter('splitArr', function () {
    return function (str) {
        // 刚加载 先判断一下 如果为空 那么就停止执行, 如果有值,那么菜分割
        if (str == undefined) {
            return "";
        }
        var splitArr = str.split("##");
        return splitArr;
    }
})
//to html
.filter('toHtml', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
}])
//钱的单位格式化
.filter('formatMoney', function () {
    return function (money) {
        if(!money) {
            return "";
        }
        if(money > 10000) {
            return money/10000 + '亿';
        }
        else {
            return money + '万';
        }
    }
});