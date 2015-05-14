angular.module('indimobile.services',[])

.factory('TaskServer', function($http, SERVER) {

  var projeto = {
    id: -1,
    descricao: '',
    data_inicio: '',
    data_termino: ''
  }

  projeto.autenticar = function(projeto) {
    return $http.get(SERVER.url + '/taskserver/rest/TControllerDM/Projeto/'+projeto);
   }

  return projeto;
});


