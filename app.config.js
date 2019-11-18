'use strict';

angular.
  module('dota2App').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/matches', {
          template: '<match-list></match-list>'
        }).
        when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>'
        }).
        otherwise('/matches');
    }
  ]);

angular.module('dota2App').directive('superColWidthUpdate', ['$timeout', function ($timeout) {
    return {
        'restrict': 'A',
            'link': function (scope, element) {
            var _colId = scope.col.colDef.superCol,
                _el = jQuery(element);
            _el.on('resize', function () {
                _updateSuperColWidth();
            });
            var _updateSuperColWidth = function () {
                $timeout(function () {
                    var _parentCol = jQuery('.ui-grid-header-cell[col-name="' + _colId + '"]');
                    var _parentWidth = _parentCol.outerWidth(),
                        _width = _el.outerWidth();
                    _parentWidth = ((_parentWidth === 1) ? 0 : _parentWidth) + _width + 'px';
                    _parentCol.css({
                        'min-width': _parentWidth,
                        'max-width': _parentWidth
                    });
                }, 0);
            };
            _updateSuperColWidth();
        }
    };
}]);

Date.prototype.format = function(fmt)
{
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}