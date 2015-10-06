angular.module('myApp')
    .controller('HierCtrl', ['$scope', function ($scope) {
        var typeAttrs = {
            "field": {'name': 'string'},
            "mapping": {'name': 'string'},
            "mappingType": {'name': 'string'},
        };

        $scope.editing = null;

        $scope.removeFromParent = function(scope) {
            scope.remove();
        };

        $scope.addChildField = function(mapping) {
            if ($scope.editing) {
                return;
            }

            var field = {
                type: 'field',
                _editing: true,
                name: "",
                property: "",
                store: true,
                index: true,
                include_term_vectors: true,
                include_in_all: true
            };

            mapping.fields.push(field);

            $scope.editing = field;
        };

        $scope.addChildMapping = function(mapping) {
            if ($scope.editing) {
                return;
            }

            if (mapping == null) {
                mapping = $scope;
            }

            var m = {
                type: mapping == $scope ? 'mappingType' : 'mapping',
                _editing: true,
                name: "",
                fields: [],
                mappings: []
            };

            mapping.mappings.push(m);

            $scope.editing = m;
        };

        $scope.editAttrs = function(obj) {
            var attrs = typeAttrs[obj.type];
            for (var attr in attrs) {
                obj[attr + "Error"] = null;
                obj[attr + "Prev"] = obj[attr];
            }

            obj._editing = true;
            $scope.editing = obj;
        }

        $scope.editAttrsDone = function(obj, ok) {
            var attrs = typeAttrs[obj.type];
            for (var attr in attrs) {
                var kind = attrs[attr];

                if (ok) {
                    // Validation.
                    if (kind == "string" &&
                        obj[attr] != null && obj[attr].length <= 0) {
                        obj[attr + "Error"] = attr + " required";
                        return;
                    }
                } else { // Cancelled.
                    obj[attr] = obj[attr + "Prev"];
                }
            }

            for (var attr in attrs) {
                delete obj[attr + "Error"];
                delete obj[attr + "Prev"];
            }

            delete obj._editing;
            $scope.editing = null;
        }

        $scope.options = {
            accept: function(sourceAccept, destAccept, destIndex) {
                if ($scope.editing) {
                    return false;
                }

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
            'default_analyzer': "",
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
        }];
    }]);
