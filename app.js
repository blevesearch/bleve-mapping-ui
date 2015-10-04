angular.module('myApp', ['ui.tree', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log("app...");

        $routeProvider
            .when('/basic', {
                controller: 'BasicCtrl',
                templateUrl: 'basic-view.html'
            })
            .when('/groups', {
                controller: 'GroupsCtrl',
                templateUrl: 'groups-view.html'
            })
            .when('/hier', {
                controller: 'HierCtrl',
                templateUrl: 'hier-view.html'
            })
            .otherwise({
                redirectTo: '/basic'
            });

        console.log("app... done.");
    }]);
