angular.module('myApp')
    .controller('HierCtrl', ['$scope', function ($scope) {
        $scope.editing = false;

        $scope.removeField = function(scope) {
            scope.remove();
        };

        $scope.removeMapping = function(scope) {
            scope.remove();
        };

        $scope.addChildField = function(mapping) {
            mapping.fields.push({
                type: 'field',
                name: "",
                editing: true
            });

            $scope.editing = true;
        };

        $scope.addChildMapping = function(mapping) {
            if (mapping == null) {
                mapping = $scope;
            }

            mapping.mappings.push({
                type: mapping == $scope ? 'mappingType' : 'mapping',
                name: "",
                fields: [],
                mappings: [],
                editing: true
            });

            $scope.editing = true;
        };

        $scope.editAttr = function(obj, attr) {
            $scope.editing = true;

            obj.editing = true;
            obj[attr + "Error"] = null;
        }

        $scope.editAttrDone = function(obj, attr) {
            if (obj[attr] == null || obj[attr].length <= 0) {
                obj[attr + "Error"] = attr + " required";
                return;
            }

            obj[attr + "Error"] = null;
            obj.editing = false;

            $scope.editing = false;
        }

        $scope.options = {
            accept: function(sourceAccept, destAccept, destIndex) {
                var sourceData = sourceAccept.$modelValue;
                var destType = destAccept.$element.attr('data-type');

                return (sourceData.type+"Container") == destType;
            },
            dropped: function(event) {
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
