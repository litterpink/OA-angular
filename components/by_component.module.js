/**
 * Created by liuchungui on 16/8/24.
 */
//创建模块
var byComponent = angular.module('byComponent', ["ui.router", "w5c.validator","mix.service","mix.directive", "mix.filter", "ngFileUpload", "project.service", "user.service", "ae-datetimepicker", "angular-md5"]);
// 配置表单验证
// byComponent.config(function (w5cValidatorProvider) {
//     // 全局配置
//     w5cValidatorProvider.config({
//         blurTrig: true,
//         showError: true,
//         removeError: true
//
//     });
//     w5cValidatorProvider.setRules({
//         name: {
//             required: "姓名不能为空"
//         },
//         phone: {
//             required: "输入手机号码不能为空",
//             number: "手机号码格式不正确"
//         },
//         firm: {
//             required: "机构名称不能为空"
//         }
//     });
// });