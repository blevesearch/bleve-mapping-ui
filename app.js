angular.module('myApp', ['ui.tree', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log("app...");

        $routeProvider
            .when('/hier', {
                controller: 'HierCtrl',
                templateUrl: 'hier-view.html'
            })
            .otherwise({
                redirectTo: '/hier'
            });

        console.log("app... done.");
    }]);
