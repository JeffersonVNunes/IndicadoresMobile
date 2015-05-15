angular.module('indimobile.controllers',[])

.controller('EntradaCtrl', function($scope, $state, TaskServer) {

  $scope.submitForm = function(id_projeto) {
    TaskServer.autenticar(id_projeto).then(function(res){

      TaskServer.id = res.data.Id;
      TaskServer.descricao = res.data.Descricao;
      TaskServer.data_inicio = res.data.DataInicio;
      TaskServer.data_termino = res.data.DataTermino;

      $state.go('indi-menu');

    }, function() {
      // error handling here
      alert('Projeto não encontrado');
    });
  }
})
.controller('MenuCtrl', function($scope, $state, projeto) {
  $scope.projeto = projeto;
  $scope.dados = 'Não Carregado';

  $scope.getIndicadores = function(){
    projeto.getIndicadores().then(function(res){

      $scope.dados = res.data;

    }, function() {
      // error handling here
      alert('Projeto não encontrado');
    });
  }
});
