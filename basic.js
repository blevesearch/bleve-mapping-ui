angular.module('myApp')
    .controller('BasicCtrl', ['$scope', function ($scope) {
        console.log("BasicCtrl...");

        $scope.remove = function (scope) {
            scope.remove();
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBeginning = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };

        $scope.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            nodeData.nodes.push({
                id: nodeData.id * 10 + nodeData.nodes.length,
                title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                nodes: []
            });
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('collapseAll');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('expandAll');
        };

        $scope.options = {
            accept: function(sourceNode, destNodes, destIndex) {
                var sourceData = sourceNode.$modelValue;
                var destType = destNodes.$element.attr('data-type');
                console.log("accept", sourceData, destType);
                return (sourceData.type == destType); // only accept the same type
            },
            dropped: function(event) {
                console.log("dropped", event);

                var sourceNode = event.source.nodeScope;
                var destNodes = event.dest.nodesScope;

                // update changes to server
                if (destNodes.isParent(sourceNode) &&
                    destNodes.$element.attr('data-type') == 'category') {
                    // If it moves in the same group, then only update group
                    var group = destNodes.$nodeScope.$modelValue;
                    // group.save();
                } else { // save all
                    // $scope.saveGroups();
                }
            }
        };

        $scope.data = [{
            'id': 1,
            'type': 'top',
            'title': 'node1',
            'nodes': [
                {
                    'id': 11,
                    'title': 'node1.1',
                    'nodes': [
                        {
                            'id': 111,
                            'title': 'node1.1.1',
                            'nodes': []
                        }
                    ]
                },
                {
                    'id': 12,
                    'title': 'node1.2',
                    'nodes': []
                }
            ]
        }, {
            'id': 2,
            'type': 'top',
            'title': 'node2',
            'nodrop': true, // Arbitrary property to check in custom template for nodrop-enabled
            'nodes': [
                {
                    'id': 21,
                    'title': 'node2.1',
                    'nodes': []
                },
                {
                    'id': 22,
                    'title': 'node2.2',
                    'nodes': []
                }
            ]
        }, {
            'id': 3,
            'type': 'top',
            'title': 'node3',
            'nodes': [
                {
                    'id': 31,
                    'title': 'node3.1',
                    'nodes': []
                }
            ]
        }];
    }]);
