var sscApp = angular.module('sscApp', ['ngRoute']);

sscApp.config(function($routeProvider, $locationProvider){
  $routeProvider.when("/",
    {
      templateUrl: "pages/main.html",
      controller: "MainController",
    }
  );

  $routeProvider.when("/files",
    {
      templateUrl: "pages/files.html",
      controller: "FilesController",
    }
  );
  
  $routeProvider.when("/profile",
  {
    templateUrl: "pages/user.html",
    controller: "UserController",
  });
  $routeProvider.when("/login",
  {
    templateUrl: "pages/login.html",
    controller: "LoginController",
  });
    $routeProvider.when("/logout",
  {
    templateUrl: "pages/login.html",
    controller: "LogoutController",
  });
  $routeProvider.when("/register",
  {
    templateUrl: "pages/login.html",
    controller: "RegisterController",
  });

  $locationProvider.html5Mode(true);
});

sscApp.service('Auth', ['$http','$route', function($http,$route){
  var user = false;
  console.log("Initialising Auth Service");
  /*$http({
      method: 'GET',
      url: 'https://ssc.teaser.insomnihack.ch/api/user.php?action=getUser',
      withCredentials: true,
    }).then(function(response) {
      if(response.data.status == 'SUCCESS') {
        user = response.data.name;
        console.log(response.data);
        $route.reload();
      }
    }, function(response) {console.log(response);});*/

  return{
      initAuth : function() {
          return $http({
          method: 'GET',
          url: 'https://ssc.teaser.insomnihack.ch/api/user.php?action=getUser',
          withCredentials: true,
        });
      },
      setUser : function(aUser){
          user = aUser;
      },
      getUser : function() {
        return user;
      },
      isLoggedIn : function(){
        return(user)? user : false;
      }
    }
}]);

sscApp.service('Keys', function() {
  var pubKey ={};
  var privateKey={};
  return {
    getPubKey : function() {
      return pubKey;
    },
    getPrivKey : function() {
      return privateKey;
    },
    setPubKey : function(key) {
      pubKey = key;
    },
    setPrivKey : function(key) {
      privateKey = key;
    }
  }
});

sscApp.controller("MainController", ['$scope','Auth',function MainController($scope,Auth) {
  Auth.initAuth().then(function(response) {
      if(response.data.status == 'SUCCESS') {
        Auth.setUser(response.data.name);
      }
      else {
        Auth.setUser(false);
      }
      
    }, function(response) {console.log(response);});
}]);

sscApp.controller('UserController',['Auth','$location','$scope', function UserController(Auth,$location,$scope) {
    if(!Auth.isLoggedIn()) {
        $location.path("/login");
    }
  else {
    $scope.name = Auth.getUser();
  }
}]);

sscApp.controller('LoginController', function LoginController($scope,$http,$location,Auth) {
    $scope.url = "https://ssc.teaser.insomnihack.ch/api/user.php";
    $scope.button = "Login";
    $scope.msg = "";
  $scope.loginclass = "active";
  $scope.registerclass = "";
    $scope.submitForm = function() {
        $http({
            method: 'POST',
            url: $scope.url,
            data: "action=login&name=" + $scope.user.name + "&password=" + $scope.user.password,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      withCredentials: true,
        }).then(function(response) {
      if(response.data.status == 'SUCCESS') {
        Auth.setUser(response.data.name);
    location.href = "/";
      }
    else {
    $scope.msg = "Authentication error";
    }
        }, function(response) {console.log(response);});
    }

});

sscApp.controller('RegisterController', ['$scope','$http','$location','Auth', function RegisterController($scope,$http,$location,Auth) {
  $scope.url = "https://ssc.teaser.insomnihack.ch/api/user.php";
  $scope.button = "Register";
  $scope.loginclass = "";
  $scope.registerclass = "active";
  $scope.submitForm = function() {
    $http({
      method: 'POST',
      url: $scope.url,
      data: "action=register&name=" + $scope.user.name + "&password=" + $scope.user.password,
      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      withCredentials: true,
    }).then(function(response) {
     if(response.data.status == 'SUCCESS') { 
    $scope.msg = "Registration success, login now";
        $location.path("/login");
      }
    else {
    $scope.msg = "Registration failure";
    }
    }, function(response) {console.log(response);});
  }
}]);

sscApp.controller('LogoutController', ['$http','$location', function LogoutController($http,$location) {
  $http.get("https://ssc.teaser.insomnihack.ch/api/user.php?action=logout",{withCredentials: true}).then(function(response) {
    location.href = "/";
  })
}]);




sscApp.controller('FilesController', ['Auth','$http','$location','$scope','Keys', function FilesController(Auth,$http,$location,$scope,Keys) {
  
  $scope.getFiles = function() {
    $http.get("https://ssc.teaser.insomnihack.ch/api/files.php?action=list",{withCredentials: true}).then(function(response) {
      $scope.files = response.data;
    },function(response){console.log(response);});
  };

  $scope.downloadFile = function(id) {
    console.log("Download file " + id);
    $http.get("https://ssc.teaser.insomnihack.ch/api/files.php?action=download&id="+id,{withCredentials: true}).then(function(response) {
      var name = response.data.name;
      var content = JSON.parse(response.data.content);
      var key = Keys.getPrivKey();
      crypto.subtle.decrypt({name:"RSA-OAEP"},key,$scope._Base64ToArrayBuffer(content.sessionkey)).then(function(sesskey) {
        
        crypto.subtle.importKey('raw', sesskey, {name:"AES-CBC"},true,['encrypt','decrypt']).then(function(realsesskey) {
          console.log("Session key:" + realsesskey);
          window.crypto.subtle.decrypt({name: "AES-CBC", iv: $scope._Base64ToArrayBuffer(content.iv)}, realsesskey, $scope._Base64ToArrayBuffer(content.file)).then(function(dec) {
            console.log(dec);
            var blob = new Blob([dec], {type: 'application/octet-stream'});
            var url = window.URL.createObjectURL(blob);
            var anchor = document.createElement("a");
            anchor.download = name;
            anchor.href = url;
            anchor.click();
            window.URL.revokeObjectURL(url);
            anchor.remove();
          },function(e){console.log(e);});
        },function(e){console.log(e);});
        
      },function(response){console.log(response);});
    }, function(response){console.log(response);});
  }

  $scope._arrayBufferToBase64 = function( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  $scope._Base64ToArrayBuffer = function( buffer ) {
    var binary_string =  window.atob(buffer);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  $scope.submitForm = function() {
    var file = document.getElementById('uploadFile').files[0];
    var reader = new FileReader();
    var pubKey = Keys.getPubKey();
    reader.onload = function(e) {
      var cleartext = e.target.result;
      window.crypto.subtle.generateKey(
          {name: "AES-CBC", length: 128}, 
          true, 
          ["encrypt", "decrypt"]).then(function(key) {
            var iv = window.crypto.getRandomValues(new Uint8Array(16));
            var sessionkey = key;
            window.crypto.subtle.encrypt({name: "AES-CBC", iv: iv}, key, cleartext).then(function(enc) {
              console.log(enc);
              var encfile = enc;
              console.log("sesskey : " + sessionkey);
              crypto.subtle.exportKey('raw', sessionkey).then(function(exportedKey){
                crypto.subtle.encrypt({name:"RSA-OAEP"},pubKey,exportedKey).then(function(encrypted) {
                  var res = {sessionkey: $scope._arrayBufferToBase64(encrypted), iv: $scope._arrayBufferToBase64(iv), file: $scope._arrayBufferToBase64(encfile)};

                  console.log(JSON.stringify(res));
                  $http({
                    method: 'POST',
                    url: "https://ssc.teaser.insomnihack.ch/api/files.php",
                    data: "action=upload&file="+encodeURIComponent(JSON.stringify(res))+"&name="+encodeURIComponent(file.name),
                    headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                    withCredentials: true,
                  }).then(function(response) {
                    if(response.data.status == 'SUCCESS') {
                      $scope.getFiles();
                    }
                  }, function(response) {console.log(response);});
                });
              });
              
            }
          );
          });
        
          

        
      };
    reader.readAsArrayBuffer(file);
  };
  

  if(!Auth.isLoggedIn()) {
      $location.path("/login");
    }
    else {
      $scope.files = $scope.getFiles();
    }
}]);

sscApp.controller('KeyController', ['$scope','$location','Keys', function KeyController($scope,$location,Keys) {
    $scope.keys = "No keys"
    
    $scope.generateKeys = function() {
      console.log("Generating keys");
      window.crypto.subtle.generateKey({
              name: "RSA-OAEP",
              modulusLength: 2048, //can be 1024, 2048, or 4096
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
      )
      .then(function(key){
          window.crypto.subtle.exportKey("jwk",key.publicKey).then(function(key) {
            localStorage.setItem("publicKey",JSON.stringify(key));
          });
          window.crypto.subtle.exportKey("jwk",key.privateKey).then(function(key) {
            localStorage.setItem("privateKey",JSON.stringify(key));
          });
          
      })
      .catch(function(err){
          console.error(err);
      });
    };
    try {
      $scope.keys = "Fetching keys, please wait...";
      keys = {privateKey: JSON.parse(localStorage.getItem("privateKey")), pubKey : JSON.parse(localStorage.getItem("publicKey"))};
      window.crypto.subtle.importKey("jwk",keys.privateKey,{name:"RSA-OAEP", hash: {name: "SHA-256"},},true,["decrypt"]).then(function(privateKey){
        $scope.privateKey = privateKey;
        Keys.setPrivKey(privateKey);
        //$scope.$apply();
      }).catch(function(err) {
        console.log(err);
        $scope.keys = "Error getting your keys, generating new ones.";
        $scope.generateKeys();
      });
      window.crypto.subtle.importKey("jwk",keys.pubKey,{name:"RSA-OAEP", hash: {name: "SHA-256"},},true,["encrypt"]).then(function(publicKey){
        $scope.pubKey = publicKey;
        Keys.setPubKey(publicKey);
        $scope.keys = "You have a key pair, you can send files securely.";
        $scope.$apply();

      }).catch(function(err) {
        console.log(err);
        $scope.keys = "Error getting your keys, generating new ones.";
        $scope.generateKeys();
      });
      //$scope.pubKey = window.crypto.subtle.importKey("jwk",keys.publicKey);

    }
    catch(err) {
      console.log(err);
      $scope.keys = "Error getting your keys, generating new ones.";
      $scope.generateKeys();
    }
}]);