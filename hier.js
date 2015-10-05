angular.module('myApp')
    .controller('HierCtrl', ['$scope', function ($scope) {
        console.log("HierCtrl...");

        $scope.removeField = function(scope) {
            scope.remove();
        };

        $scope.removeMapping = function(scope) {
            scope.remove();
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        $scope.addChildField = function(scope) {
            var mapping = scope.$modelValue;
            mapping.fields.push({
                type: 'field',
                name: mapping.name + "-" + mapping.fields.length,
            });
        };

        $scope.addChildMapping = function(scope) {
            var mapping = $scope;
            if (scope != null) {
                mapping = scope.$modelValue;
            }

            mapping.mappings.push({
                type: mapping == $scope ? 'mappingType' : 'mapping',
                name: mapping.name + "-" + mapping.mappings.length,
                fields: [],
                mappings: []
            });
        };

        $scope.editMapping = function(mapping) {
            mapping.editing = true;
            mapping.nameError = null;
        }

        $scope.editMappingDone = function(mapping) {
            if (mapping.name == null || mapping.name.length <= 0) {
                mapping.nameError = "name required";
                return;
            }

            mapping.nameError = null;
            mapping.editing = false;
        }

        $scope.options = {
            accept: function(sourceAccept, destAccept, destIndex) {
                var sourceData = sourceAccept.$modelValue;
                var destType = destAccept.$element.attr('data-type');

                var acceptable = (sourceData.type+"Container") == destType;
                console.log("accept", sourceData, destType, acceptable);
                return acceptable;
            },
            dropped: function(event) {
                console.log("dropped", event);
            }
        };

        $scope.mappings = [{
            'type': 'mappingType',
            'name': null, // Represents the default mapping.
            'fields': [],
            'mappings': [],

            'enabled': true,
            'dynamic': true,
            'defaultAnalyzer': "",
        }, {
            'type': 'mappingType',
            'name': 'user',
            'fields': [
                {'type': 'field', 'property': 'fullName', "name": "fullName_en"},
                {'type': 'field', 'property': 'fullName', "name": "fullName_es"},
            ],
            'mappings': [
                {
                    'type': 'mapping',
                    'name': 'address',
                    'fields': [
                        {'type': 'field', 'property': 'city', "name": "city_en"},
                        {'type': 'field', 'property': 'city', "name": "city_es"},
                    ],
                    'mappings': [
                    ]
                },
                {
                    'type': 'mapping',
                    'name': 'inventory',
                    'fields': [
                        {'type': 'field', 'property': 'description', "name": "description"},
                    ],
                    'mappings': [
                    ]
                }
            ]
        }, {
            'type': 'mappingType',
            'name': 'item',
            'fields': [
                {'type': 'field', 'property': 'description', "name": "description_en"},
                {'type': 'field', 'property': 'description', "name": "description_es"},
            ],
            'mappings': [
                {
                    'type': 'mapping',
                    'name': 'comments',
                    'fields': [
                        {'type': 'field', 'property': 'msg', "name": "msg_en"},
                        {'type': 'field', 'property': 'msg', "name": "msg_es"},
                    ],
                    'mappings': [
                    ]
                },
            ]
        }, {
            'type': 'mappingType',
            'name': 'area',
            'fields': [
                {'type': 'field', 'property': 'description', "name": "description_en"},
                {'type': 'field', 'property': 'description', "name": "description_es"},
            ],

            'mappings': [
                {
                    'type': 'mapping',
                    'name': 'node3.1',
                    'fields': [
                    ],
                    'mappings': []
                }
            ]
        }];
    }]);
