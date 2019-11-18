'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.module('phoneList').component('matchList', {
    templateUrl: 'match-list/match-list.template.html',
    controller: ['Phone',
      function PhoneListController(Phone) {
        this.phones = Phone.query();
        this.orderProp = 'age';
      }
    ]
  });
