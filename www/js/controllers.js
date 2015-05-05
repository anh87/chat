angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $state) {
  $scope.logout = function() {
    Parse.User.logOut();
    $rootScope.user = null;
    $rootScope.isLoggedIn = false;
    $state.go('signin', {
      clear: true
    });
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('SignInCtrl', function($scope, $state, $ionicLoading, $rootScope) {

  $scope.user = {
    username: null,
    password: null
  };

  $scope.error = {};

  $scope.signUp = function() {
    $state.go('signup');
  };

  $scope.signIn = function() {
    $scope.loading = $ionicLoading.show({
        content: 'Logging in',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var user = $scope.user;
    Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
        success: function(user) {
            $ionicLoading.hide();
            $rootScope.user = user;
            $rootScope.isLoggedIn = true;
            $state.go('tab.dash', {
                clear: true
            });
        },
        error: function(user, err) {
            $ionicLoading.hide();
            // The login failed. Check error to see why.
            if (err.code === 101) {
                $scope.error.message = 'Invalid login credentials';
            } else {
                $scope.error.message = 'An unexpected error has ' +
                    'occurred, please try again.';
            }
            $scope.$apply();
        }
    });
  };
})

.controller('RegisterController', function($scope, $state, $ionicLoading, $rootScope) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function() {

        // TODO: add age verification step

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.username);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('tab.dash', {
                    clear: true
                });
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
});