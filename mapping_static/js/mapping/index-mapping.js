function initBleveIndexMappingController(
    $scope, $http, $log, $uibModal,
    analyzerNames, dateTimeParserNames,
    indexMappingIn) {
    $scope.static_prefix = $scope.static_prefix || 'mapping_static';

	var indexMapping =
        $scope.indexMapping = JSON.parse(JSON.stringify(indexMappingIn));

    indexMapping.types = indexMapping.types || {};

    if (indexMapping["default_mapping"]) {
        indexMapping.types[""] = indexMapping["default_mapping"];
    }

    initBleveTypeMappingController($scope,
                                   analyzerNames, dateTimeParserNames,
                                   indexMapping.types);

    AnalysisCtrl($scope, $http, $log, $uibModal);
}

function IndexMappingController($scope, $http) {
	$scope.analyzerNames = [];

	$scope.loadAnalyzerNames = function() {
        $http.post('/api/_analyzerNames', $scope.mapping).
        success(function(data) {
            $scope.analyzerNames = data.analyzers;
        }).
        error(function(data, code) {
			$scope.errorMessage = data;
        });
	};

	$scope.loadAnalyzerNames();

	$scope.datetimeParserNames = [];

	$scope.loadDatetimeParserNames = function() {
        $http.post('/api/_datetimeParserNames', $scope.mapping).
        success(function(data) {
            $scope.datetimeParserNames = data.datetime_parsers;
        }).
        error(function(data, code) {
			$scope.errorMessage = data;
        });
	};

	$scope.loadDatetimeParserNames();
}
