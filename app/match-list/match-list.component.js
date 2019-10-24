'use strict';

angular.module('dota2App').component('matchList', {
    templateUrl: 'match-list/match-list.template.html',
    controller: ['$scope', '$http', 'uiGridConstants',
    function MatchListController($scope, $http, uiGridConstants) {

        var highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if(col.filters[0].term){
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            paginationPageSizes: [20, 50, 100],
            paginationPageSize: 50,
            columnDefs: [
                {field: '_id', displayName: '序号', enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'},
                {field: 'match_id', displayName: '比赛ID', headerCellClass: highlightFilteredHeader},
                {
                    field: 'getDate()',
                    displayName: '日期',
                    type: 'date',
                    cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',
                    filters: [
                        {
                            condition: function(searchTerm, cellValue) {
                                var d = new Date(searchTerm.replace(/\\/g, ''));
                                return isNaN(d) ? true : d.getTime() < cellValue.getTime();
                              },
                            placeholder: '大于(yyyy-MM-dd HH:mm:ss)'
                        }
                    ],
                    headerCellClass: highlightFilteredHeader},
//                {field: 'radiantTeam()', displayName: '天辉', headerCellClass: highlightFilteredHeader},
//                {field: 'direTeam()', displayName: '夜魇', headerCellClass: highlightFilteredHeader},
                {field: 'teams()', displayName: '队伍', headerCellClass: highlightFilteredHeader, width: '15%'
//                    filters: [
//                        {
//                            condition: function(searchTerm, cellValue) {
//                                if(searchTerm.indexOf('-') == -1){
//                                    return cellValue.toUpperCase().indexOf(searchTerm.toUpperCase()) != -1;
//                                }
//                                var teams = searchTerm.replace(/\\/g, '').split('-');
//                                return cellValue.toUpperCase().indexOf(teams[0].toUpperCase()) != -1
//                                    && cellValue.toUpperCase().indexOf(teams[1].toUpperCase()) != -1;
//                            },
//                            placeholder: 'Team-Team'
//                        },
//                        {
//                          condition: uiGridConstants.filter.CONTAINS,
//                          placeholder: ''
//                        }
//                    ]
                },
                {field: 'kills()', displayName: '人头比', headerCellClass: highlightFilteredHeader},
                {field: 'firstBloodTeam()', displayName: '首杀', headerCellClass: highlightFilteredHeader},
                {field: 'firstBloodTime()', displayName: '首杀时间(s)', filters: [
                        {
                          condition: uiGridConstants.filter.LESS_THAN,
                          placeholder: '小于'
                        }
                    ],
                    headerCellClass: highlightFilteredHeader
                },
                {field: 'durationTime()', displayName: '持续时间(min)', headerCellClass: highlightFilteredHeader,
                    filters: [
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: '小于'
                        }
                    ]
                },
                {field: 'getWinner()', displayName: '获胜', headerCellClass: highlightFilteredHeader},
                {field: 'getLeague()', displayName: '联赛', headerCellClass: highlightFilteredHeader}
            ]
        }

        var getTeamTag = function(team){
            return team ? (team.tag ? team.tag : team.name) : '';
        }

        var set_kills_log = function(match){
            var kills_log = []
            $.each(match.players, function(i, player){
                $.each(player.kills_log, function(j, log){
                    log['is_radiant'] = player.player_slot > 127.5
                });
                kills_log = kills_log.concat(player.kills_log);
            });
            match['kills_log'] = kills_log;
        }

        $http({
            method: 'GET',
            url: 'data/matches.json'
        }).then(function success(res) {
                //console.log(res);
                $.each(res.data, function(i, row){
                    set_kills_log(row);
                    row.getDate = function(){
                        return new Date(this.start_time * 1000);
                    }
                    row.getWinner = function(){
                        if(this.radiant_win){
                            return getTeamTag(this.radiant_team) + '(天辉)';
                        }
                        return getTeamTag(this.dire_team) + '(夜魇)';
                    }
                    //query syntax: (*aster*eh*)|(*ehome*as*)
                    row.teams = function(){
                        return getTeamTag(this.radiant_team) + ' - ' + getTeamTag(this.dire_team);
                    }
                    row.radiantTeam = function(){
                        return getTeamTag(this.radiant_team);
                    }
                    row.direTeam = function(){
                        return getTeamTag(this.dire_team);
                    }
                    row.kills = function(){
                        return this.radiant_score + ' - ' + this.dire_score;
                    }
                    row.getLeague = function(){
                        return this.league.name;
                    }
                    row.five_fill = function(){

                    }
                    // 0-127 are Radiant, 128-255 are Dire
                    row.firstBloodTeam = function(){
                        if(!!!this.objectives || this.objectives.length == 0){
                            return '';
                        }
                        var fb;
                        if(this.objectives[0].player_slot < 127.5){
                            fb = getTeamTag(this.radiant_team) + '(天辉)';
                        }else{
                            fb = getTeamTag(this.dire_team) + '(夜魇)';
                        }
                        return fb;
                    }
                    row.firstBloodTime = function(){
                        if(!!!this.objectives || this.objectives.length == 0){
                            return this.first_blood_time;
                        }
                        return this.objectives[0].time;
                    }
                    row.durationTime = function(){
                        return parseFloat((this.duration/60).toFixed(2));
                    }
                });
                $scope.gridOptions.data = res.data;
            }, function error(res) {

            });
      }
    ]
  });
