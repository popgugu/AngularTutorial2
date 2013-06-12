/*
var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            otherwise({ redirectTo: '/' });
    });
*/

var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
            when('/edit/:editId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });
    })
    .directive('greet', function () {
        return {
            template: '<h2>Greetings from {{from}} to my dear {{to}}</h2>',
            controller: function ($scope, $element, $attrs) {
                $scope.from = $attrs.from;
                $scope.to = $attrs.greet;
            }
        };
    });

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } }); // $resource in Angular documentation ... default is POST, but we use it for create already in web api.
});

var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add";
    // item.Text, item.DueDate and item.Priority that are in details.html are created in $scope automatically when it is under ng-model if there is no existing object.
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };
};

var EditCtrl = function ($scope, $location, $routeParams, Todo) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.item = Todo.get({ id: id });

    $scope.save = function () {
        Todo.update({ id: id }, $scope.item, function () {
            $location.path('/');
        });
    };
};

var ListCtrl = function ($scope, $location, Todo) {
    $scope.test = "Testing";
    //    $scope.items = Todo.query();

    $scope.sort_order = "Priority";
    $scope.is_desc = false; // low order is considered more important.

    $scope.search = function () {
        //        $scope.items = Todo.query({ sort: $scope.sort_order, desc: $scope.is_desc });
        //$scope.items = 
        Todo.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            offset: $scope.offset,
            limit: $scope.limit
        }, function (data) {
            $scope.more = data.length === 20;
            $scope.items = $scope.items.concat(data);
        });
    };

    $scope.sort = function (col) {
        if ($scope.sort_order === col) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        $scope.reset();
    };

    $scope.reset = function () {
        //debugger;
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.items = [];
        $scope.more = true;
        $scope.search();
    };

    $scope.show_more = function () {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.has_more = function () {
        return $scope.more;
    };

    $scope.delete = function () {
        var itemId = this.Todo.Id;
        Todo.delete({ id: itemId }, function () {
            $("#todo_" + itemId).fadeOut();
        });
    };

    $scope.reset();
};
