angular.module('myApp')
    .controller('HierCtrl', ['$scope', function ($scope) {
        var kindAttrs = {
            "field": {
                'property': null,
                'name': validateString,
                'type': null,
                'analyzer': null,
                'store': null,
                'index': null,
                'include_term_vectors': null,
                'include_in_all': null,
                'date_format': null,
            },
            "mapping": {
                'name': validateString,
                'enabled': null,
                'dynamic': null,
                'default_analyzer': null
            }
        };

        kindAttrs['mappingType'] = kindAttrs['mapping'];

        $scope.analyzerNames = ['en', 'es', 'keyword'];

        $scope.fieldTypes = ['text', 'number', 'datetime', 'disable'];

        // -------------------------------------------------------

        $scope.editing = null;

        $scope.removeFromParent = function(scope) {
            scope.remove();
        };

        $scope.addChildField = function(mapping) {
            if ($scope.editing) {
                return;
            }

            var f = {
                _kind: 'field',
                property: "",
                name: "",
                type: "text",
                analyzer: "",
                store: true,
                index: true,
                include_term_vectors: true,
                include_in_all: true,
                date_format: null,
            };
            f._editing = function() { removeEntry(mapping.fields, f); };
            mapping.fields.push(f);

            $scope.editing = f;
        };

        $scope.addChildMapping = function(mapping) {
            if ($scope.editing) {
                return;
            }

            if (mapping == null) {
                mapping = $scope;
            }

            var m = {
                _kind: mapping == $scope ? 'mappingType' : 'mapping',
                name: "",
                fields: [],
                mappings: []
            };
            m._editing = function() { removeEntry(mapping.mappings, m); };
            mapping.mappings.push(m);

            $scope.editing = m;
        };

        $scope.editAttrs = function(obj) {
            var attrs = kindAttrs[obj._kind];
            for (var attr in attrs) {
                obj["_" + attr + "_ERR"] = null;
                obj["_" + attr + "_PREV"] = obj[attr];
            }

            obj._editing = true;
            $scope.editing = obj;
        }

        $scope.editAttrsDone = function(obj, ok) {
            var valid = true;

            var attrs = kindAttrs[obj._kind];
            for (var attr in attrs) {
                var attrValidator = attrs[attr];

                if (ok) {
                    // Validation.
                    if (attrValidator) {
                        valid = attrValidator(obj, attr) && valid;
                    }
                } else { // Cancelled.
                    obj[attr] = obj["_" + attr + "_PREV"];
                }
            }

            if (!valid) {
                return;
            }

            for (var attr in attrs) {
                delete obj["_" + attr + "_ERR"];
                delete obj["_" + attr + "_PREV"];
            }

            if (!ok && typeof(obj._editing) == 'function') {
                obj._editing(); // Invoke editing cancellation callback.
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

                return (sourceData._kind+"Container") == destType;
            },
            dropped: function(event) {
            }
        };

        function validateString(obj, attr) {
            if (obj[attr] != null && obj[attr].length <= 0) {
                obj["_" + attr + "_ERR"] = attr + " required";
                return false;
            }
            return true;
        }

        function removeEntry(arr, entry) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === entry) {
                    arr.splice(i, 1);
                }
            }
        }

        $scope.mappings = [{
            '_kind': 'mappingType',
            'name': null, // Represents the default mapping.
            'fields': [],
            'mappings': [],

            'enabled': true,
            'dynamic': true,
            'default_analyzer': "",
        }, {
            '_kind': 'mappingType',
            'name': 'user',
            'fields': [
                {'_kind': 'field', 'property': 'fullName', "name": "fullName_en"},
                {'_kind': 'field', 'property': 'fullName', "name": "fullName_es"},
            ],
            'mappings': [
                {
                    '_kind': 'mapping',
                    'name': 'address',
                    'fields': [
                        {'_kind': 'field', 'property': 'city', "name": "city_en"},
                        {'_kind': 'field', 'property': 'city', "name": "city_es"},
                    ],
                    'mappings': [
                    ]
                },
                {
                    '_kind': 'mapping',
                    'name': 'inventory',
                    'fields': [
                        {'_kind': 'field', 'property': 'description', "name": "description"},
                    ],
                    'mappings': [
                    ]
                }
            ]
        }, {
            '_kind': 'mappingType',
            'name': 'item',
            'fields': [
                {'_kind': 'field', 'property': 'description', "name": "description_en"},
                {'_kind': 'field', 'property': 'description', "name": "description_es"},
            ],
            'mappings': [
                {
                    '_kind': 'mapping',
                    'name': 'comments',
                    'fields': [
                        {'_kind': 'field', 'property': 'msg', "name": "msg_en"},
                        {'_kind': 'field', 'property': 'msg', "name": "msg_es"},
                    ],
                    'mappings': [
                    ]
                },
            ]
        }];
    }]);
