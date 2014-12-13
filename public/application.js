var prodMgmtApp = (function() {

    var mainModuleName = 'prodMgmtApp',
        mainModuleDependencies = ['ngRoute', 'ngResource'];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(mainModuleName).requires.push(moduleName);
    };

    var config = function($routeProvider) {
        // Setup the routes
        $routeProvider.when("/home",{
            templateUrl: "modules/core/views/home.html"
        }).when("/saveCategory/:categoryId",{
            templateUrl: "modules/categories/views/save-category.client.view.html"
        }).otherwise({redirectTo: "/home"});
    };

    // init the main app module
    angular
        .module(mainModuleName, mainModuleDependencies)
        .config(config);

    return {
        moduleName: mainModuleName,
        registerModule: registerModule
    };
})();