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
    }

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
    }

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
            enabled: true,
            dynamic: true,
            fields: [],
            mappings: []
        };
        m._editing = function() { removeEntry(mapping.mappings, m); };
        mapping.mappings.unshift(m);

        $scope.editing = m;
        $scope.popup = null;
    }

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
        }
    }

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

// Convert from a near-bleve-friendly TypeMapping data structure to a
// UI-friendly data structure.  By "near", an entry with null key
// represents the default type mapping.
function convertFromTypeMapping(typeMapping) {
    var mappings = [];

    typeMapping = JSON.parse(JSON.stringify(typeMapping));
    for (var type in typeMapping) {
        var mapping = typeMapping[type];

        mappings.push(mapping);
        mapping._kind = 'mappingType';
        mapping.name = type;

        convert(mapping);
    }

    mappings.sort(displayOrderComparator);

    return mappings;

    function displayOrderComparator(a, b) {
        return (a.display_order || 0) - (b.display_order || 0);
    }

    function convert(mapping) {
        var mappings = [];
        var fields = [];

        mappings.sort(displayOrderComparator);
        fields.sort(displayOrderComparator);

        mapping.mappings = mappings;
        mapping.fields = fields;
    }
}

// Convert froma UI-friendly data structure to a near-bleve-friendly
// TypeMapping data structure.  By "near", an entry with null key
// represents the default type mapping.
function convertToTypeMapping(mappings) {
    var typeMapping = {};

    mappings = scrub(JSON.parse(JSON.stringify(mappings)));
    for (var i in mappings) {
        var mapping = mappings[i];

        typeMapping[mapping.name] = mapping; // The mapping.name may be null.

        delete mapping["name"];

        convertPropertiedFields(mapping);

        mapping.display_order = i;
    }

    return typeMapping;

    // Recursively remove every entry with '_' prefix.
    function scrub(m) {
        if (typeof(m) == "object") {
            for (var k in m) {
                if (typeof(k) == "string" && k.charAt(0) == "_") {
                    delete m[k];
                    continue;
                }

                m[k] = scrub(m[k]);
            }
        }

        return m;
    }

    // Recursively convert fields with "property" attribute into a
    // document mapping in the properties map.
    function convertPropertiedFields(m) {
        var properties = {};
        var fields = [];

        for (var i in m.fields) {
            var field = m.fields[i];
            if (field.property && field.property.length > 0) {
                var property = properties[field.property];
                if (property == null) {
                    property = properties[field.property] = {
                        enabled: true,
                        dynamic: false,
                        properties: {},
                        fields: []
                    };
                }

                property.fields.push(field);
            } else {
                fields.push(field);
            }

            delete field["property"];
            field.display_order = i;
        }

        for (var i in m.mappings) {
            var mapping = m.mappings[i];

            properties[mapping.name] = mapping;

            delete mapping["name"];
            mapping.display_order = i;

            convertPropertiedFields(mapping);
        }

        m.properties = properties;
        m.fields = fields;
    }
}
