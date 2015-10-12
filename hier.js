var SAMPLE_MAPPINGS = [
    {
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
    }
];

angular.module('myApp')
    .controller('HierCtrl', ['$scope', function($scope) {
        initMappingController(
            $scope,
            ['en', 'es', 'keyword'],
            ['julien', 'gregorian', 'yyyymmdd'],
            SAMPLE_MAPPINGS);
    }]);
