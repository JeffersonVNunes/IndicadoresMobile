angular.module('indimobile.controllers',[])

.controller('EntradaCtrl', function($scope, $state, TaskServer) {

  $scope.submitForm = function(id_projeto) {
    TaskServer.autenticar(id_projeto).then(function(res){

      TaskServer.id = res.data.id;
      TaskServer.descricao = res.data.Descricao;
      TaskServer.data_inicio = res.data.DataInicio;
      TaskServer.data_termino = res.data.DataTermino;

      $state.go('indi.menu');

    }, function() {
      // error handling here
      alert('Projeto não encontrado');
    });
  }
})
.controller('MenuCtrl', function($scope, $state, TaskServer) {

});
