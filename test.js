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

var SAMPLE_INDEX_MAPPING = {
    "types": SAMPLE_TYPE_MAPPING,
    "default_mapping": {
        "enabled": true,
    },
    "type_field": "_type",
    "default_type": "_default",
    "default_analyzer": "standard",
    "default_datetime_parser": "dateTimeOptional",
    "default_field": "_all",
    "byte_array_converter": "json",
    "analysis": {
    }
};

angular.module('testApp').
    controller('TestCtrl', ['$scope', '$http', '$log', '$uibModal',
    function($scope, $http, $log, $uibModal) {
        initBleveIndexMappingController(
            $scope, $http, $log, $uibModal,
            ['en', 'es', 'keyword', 'standard'],
            ['julien', 'gregorian', 'yyyymmdd', 'dateTimeOptional'],
            ['json'],
            SAMPLE_INDEX_MAPPING);
    }]);

angular.module('testApp').
    controller('AnalyzerModalCtrl', AnalyzerModalCtrl).
    controller('CharFilterModalCtrl', CharFilterModalCtrl).
    controller('TokenizerModalCtrl', TokenizerModalCtrl).
    controller('TokenFilterModalCtrl', TokenFilterModalCtrl).
    controller('WordListModalCtrl', WordListModalCtrl);