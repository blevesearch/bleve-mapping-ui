function initBleveIndexMappingController(
    $scope, $http, $log, $uibModal,
    analyzerNames, dateTimeParserNames, byteArrayConverterNames,
    indexMappingIn) {
    $scope.static_prefix = $scope.static_prefix || 'mapping_static';

    $scope.analyzerNames = analyzerNames;
    $scope.dateTimeParserNames = dateTimeParserNames;
    $scope.byteArrayConverterNames = byteArrayConverterNames;

	var indexMapping =
        $scope.indexMapping = JSON.parse(JSON.stringify(indexMappingIn));

    indexMapping.types =
        indexMapping.types || {};
    indexMapping.analysis =
        indexMapping.analysis || {};
	indexMapping.analysis.analyzers =
        indexMapping.analysis.analyzers || {};
	indexMapping.analysis.char_filters =
        indexMapping.analysis.char_filters || {};
	indexMapping.analysis.tokenizers =
        indexMapping.analysis.tokenizers ||{};
	indexMapping.analysis.token_filters =
        indexMapping.analysis.token_filters || {};
	indexMapping.analysis.token_maps =
        indexMapping.analysis.token_maps || {};

    if (indexMapping["default_mapping"]) {
        indexMapping.types[""] = indexMapping["default_mapping"];
    }

    initBleveTypeMappingController($scope, indexMapping.types);

    BleveAnalysisCtrl($scope, $http, $log, $uibModal);
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
