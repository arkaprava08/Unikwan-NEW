var app = angular
        .module('app', ['ngRoute', 'ui.bootstrap', 'ngSanitize'])
        .config(config)
        .run(run)
        .controller('appController', function ($rootScope, $scope, $location) {
            $scope.$location = {};
            $scope.$location['path'] = function () {
                var result = $location['path'].call($location);
                return angular.isObject(result) ? angular.toJson(result) : result;
            };
        })
        .controller('WorkDetailCtrl', function ($scope, $uibModal, $compile) {

            $scope.filterLoad = function (category) {
                deletePreviousLoad();

                $.ajax({
                    url: "data.json"
                }).done(function (data) {
                    $scope.work = [];
                    for (var i = 0; i < data.length; i++) {
                        if (category === 'All') {
                            $scope.work.push(data[i]);
                        } else if (category === data[i]["category"]) {
                            $scope.work.push(data[i]);
                        }
                    }
                    total = $scope.work.length;
                    load();
                });
            };


            $scope.animationsEnabled = true;

            $scope.open = function (size, index) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modal/workDetailModal.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    backdrop: false,
                    resolve: {
                        work: function () {
                            return $scope.work;
                        },
                        index: index
                    }
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            };

            //loading logic
            var total;
            var loaded = 0;
            var toLoad = 8;
            var deletePreviousLoad = function () {
                loaded = 0;
                toLoad = 8;
                $('#loading-area').html('');
                $('#load-more').show();
            };
            var load = function () {
                for (var i = loaded; i < loaded + toLoad && i < total; i++)
                {
                    var folderName = $scope.work[i]["folderName"];
                    var projectName = $scope.work[i]["projectName"];

                    var $wrapper = $('<div class=" col-sm-6 col-md-3 col-lg-3" style="padding:0;">');
                    var $grid = $('<div class="grid">');
                    var $fig = $('<figure class="effect-apollo">');
                    $grid.append($fig);
                    var $figcap = $('<figcaption>');
                    $figcap.append('<h2><span>' + projectName + '</span></h2>');
                    //$figcap.append('<p>Apollo\'s last game of pool was so strange.</p>');
                    $figcap.append('<a  ng-click="open(\'lg\', ' + i + ')">View more</a>');
                    $fig.append($figcap);

                    var $img = $('<img class="bttrlazyloading">');

                    $fig.append($img);
                    $wrapper.append($grid);
                    //$wrapper.append($img);

                    $compile($wrapper)($scope);
                    $('#loading-area').append($wrapper);
                    $img.bttrlazyloading({
                        container: '#loading-area',
                        delay: 1000,
                        lg: {
                            src: "./images/work/" + folderName + "/Thumbnail.jpg"
                        }
                    });
                }

                loaded += toLoad;

                if (loaded >= total) {
                    $('#load-more').hide();
                }
            };
            $('#load-more').click(function (e) {
                load();
            });
            // Initial load
            $.ajax({
                url: "data.json"
            }).done(function (data) {
                $scope.work = data;
                total = $scope.work.length;
                load();
            });

        })
        .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, work, index, $sce) {
            $scope.index = index;
            $scope.work = work;


            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            //carousel
            $scope.myInterval = 2000;
            $scope.noWrapSlides = false;
            $scope.active = 0;
            var slides = $scope.slides = [];
            var currIndex = 0;

            var folder = work[index]['folderName'];
            $scope.addSlide = function () {
                slides.push({
                    image: 'images/work/' + folder + '/' + (currIndex + 1) + '.jpg',
                    id: currIndex++
                });
            };

            var noOfItems = work[index]['images'];

            for (var i = 0; i < noOfItems; i++) {
                $scope.addSlide();
            }
        })
        .directive('fluidvids', function () {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    video: '@'
                },
                template: '<div class="fluidvids">' +
                        '<iframe ng-src="{{ video }}" frameborder=\'0\'></iframe>' +
                        '</div>',
                link: function (scope, element, attrs) {
                    var ratio = (attrs.height / attrs.width) * 100;
                    element[0].style.paddingTop = ratio + '%';
                }
            };
        })
        .controller('ContactCtrl', function ($scope, $uibModal, $compile) {
            $scope.open = function (size) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modal/careerDetail.html',
                    controller: 'CareerDetailModalInstanceCtrl',
                    size: size,
                    backdrop: false
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            };
        })
        .controller('CareerDetailModalInstanceCtrl', function ($scope, $uibModalInstance) {
            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .controller('HomepageCtrl', function ($scope, $uibModal, $compile) {
            $scope.open = function (size) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modal/careerDetail.html',
                    controller: 'CareerDetailModalInstanceCtrl',
                    size: size,
                    backdrop: false
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            };
        });


config.$inject = ['$routeProvider', '$sceDelegateProvider'];
function config($routeProvider, $sceDelegateProvider) {

    $routeProvider
            .when('/homepage', {
                controller: 'HomePageController',
                templateUrl: 'views/homepage.view.html',
                controllerAs: 'vm'
            })
            .when('/about', {
                controller: 'AboutController',
                templateUrl: 'views/about.view.html',
                controllerAs: 'vm'
            })
            .when('/contact', {
                controller: 'ContactController',
                templateUrl: 'views/contact.view.html',
                controllerAs: 'vm'
            })
            .when('/work', {
                controller: 'WorkController',
                templateUrl: 'views/work.view.html',
                controllerAs: 'vm'
            })
            .when('/workDetail', {
                templateUrl: 'views/workDetail.view.html'
            })
            .otherwise({redirectTo: '/homepage'});


    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://player.vimeo.com/video/**']);
}

run.$inject = ['$rootScope', '$location'];
function run($rootScope, $location) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        console.log("restriction here: " + $location.path());

        $rootScope.isLoading = true;
    });
}