angular.module('testApp', ['ui.tree', 'ui.bootstrap', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log("app...");

        $routeProvider
            .when('/test', {
                controller: 'TestCtrl',
                templateUrl: 'test-view.html'
            })
            .otherwise({
                redirectTo: '/test'
            });

        console.log("app... done.");
    }]);

var SAMPLE_TYPE_MAPPING = {
    "": {
        "enabled": true,
    },
    "brewery": {
        "enabled": true,
        "properties": {
            "name": {
                "fields":[{"name":"name","type":"text","analyzer":"en"}],
                "display_order": 2
            },
            "address": {
                "enabled": true,
                "properties": {
                    "city": {
                        "fields":[{"name":"city","type":"text"}]
                    }
                },
                "display_order": 1
            }
        },
        "display_order":"10"
    },
    "beer":{
        "enabled": true,
        "properties": {
            "name": {
                "fields":[{"name":"name","type":"text"}]
            }
        },
        "display_order":"5"
    }
};

angular.
    module('testApp').
    controller('TestCtrl', ['$scope', '$http', '$log', '$uibModal',
    function($scope, $http, $log, $uibModal) {
        $scope.index_mapping_html =
            "mapping_static/partials/mapping/index-mapping.html";
        $scope.type_mapping_html =
            "mapping_static/partials/mapping/type-mapping.html";
        $scope.type_mapping_tree_html =
            "mapping_static/partials/mapping/type-mapping-tree.html";
        $scope.analyzers_html =
            "mapping_static/partials/analysis/analyzers.html";

        initBleveTypeMappingController(
            $scope,
            ['en', 'es', 'keyword'],
            ['julien', 'gregorian', 'yyyymmdd'],
            SAMPLE_TYPE_MAPPING);

        AnalysisCtrl($scope, $http, $log, $uibModal);
    }]);
