function BleveWordListModalCtrl($scope, $modalInstance,
                                name, words, mapping, static_prefix) {
    $scope.name = name;
    $scope.origName = name;
    $scope.errorMessage = "";
    $scope.newWord = "";
    $scope.words = words.slice(0); // create copy
    $scope.selectedWords = [];
    $scope.mapping = mapping;
    $scope.static_prefix = static_prefix;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addWord = function(newWord) {
        newWord = newWord || $scope.newWord;
        if (newWord) {
            $scope.words.push(newWord);
            $scope.newWord = "";
        }
    };

    $scope.removeWord = function() {
        // sort the selected word indexes into descending order
        // so we can delete items without having to adjust indexes
        $scope.selectedWords.sort(function(a,b){ return b - a; });
        for (var index in $scope.selectedWords) {
            $scope.words.splice($scope.selectedWords[index], 1);
        }
        $scope.selectedWords = [];
    };

    $scope.build = function(name) {
        if (!name) {
            $scope.errorMessage = "Name is required";
            return;
        }

        // name must not already be used
        if (name != $scope.origName &&
            $scope.mapping.analysis.token_maps[name]) {
            $scope.errorMessage = "Word list named '" + name + "' already exists";
            return;
        }

        result = {};
        result[name] = {
            "type": "custom",
            "tokens": $scope.words
        };

        $modalInstance.close(result);
    };
};