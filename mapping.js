function initMappingController(
    $scope, analyzerNames, dateTimeParserNames, mappingsIn) {
    $scope.analyzerNames = analyzerNames;

    $scope.dateTimeParserNames = dateTimeParserNames;

    $scope.fieldTypes = ['text', 'number', 'datetime', 'disabled'];

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

    // -------------------------------------------------------

    $scope.mappings = mappingsIn;

    $scope.editing = null;

    $scope.popup = null;

    $scope.popupToggle = function(obj) {
        $scope.popup = ($scope.popup == obj) ? null : obj;
    }

    $scope.removeFromParent = function(obj, scope) {
        $scope.editAttrsDone(obj, false); // Cancel any edits.

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
        mapping.fields.unshift(f);

        $scope.editing = f;
        $scope.popup = null;
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
        mapping.mappings.unshift(m);

        $scope.editing = m;
        $scope.popup = null;
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
}
