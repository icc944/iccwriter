angular.module('Writter')
.controller('main_controller', ['$rootScope','$scope','ManageProject','$mdDialog', '$timeout', '$location','AdviceService','DateTimeService','UrlService',
    mainControllerHandler]);

function mainControllerHandler($rootScope, $scope, ManageProject, $mdDialog, $timeout, $location, AdviceService, DateTimeService, UrlService) {
    console.log('✅ main_controller loaded!');

    $scope.clockApi = {};
    DateTimeService.load();
    UrlService.load();
    AdviceService.load();

    $scope.projects_metadata = ManageProject.load() || [];
    $scope.projects_metadata.forEach(project => {
        project.last_modificated = new Date(project.last_modificated);
    });


    $scope.onBlur = function($event, project) {
      `This function disabled edit mode and not save nothing`
      if (project.isEditing == false) return
      
      const next = $event.relatedTarget;    
      if (next && next.classList.contains('editable')) {
        return;
      }
      
      // Advice exit without save
      Swal.fire({
        title: "¿Guardar cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No Guardar`
      }).then((result) => {
        if (result.isConfirmed) {
          $scope.toggleEdit(project,'save');
          Swal.fire("¡Cambio guardado!", "", "success");
        } else if (result.isDenied) {
          project.isEditing = false;

          //* If this is executed, no saving nothing
          document.getElementById(`project_name_${project.id}`).innerHTML = project.name;
          document.getElementById(`project_category_${project.id}`).innerHTML = project.category;
          document.getElementById(`project_gender_${project.id}`).innerHTML = project.gender;
          document.getElementById(`project_description_${project.id}`).innerHTML = project.description;

          AdviceService.toastAdvice({ message: 'No se han realizado cambios' });
          Swal.fire("No se ha guardado", "", "info");
        }
      });

      
    };
    
    $scope.onKeyDown = function(event, project){
      if(event.key === "Enter"){
        `This function help to validate where the user
         made clic and decide if is need save or do nothing.
        `
        event.preventDefault();
        $scope.onBlur( event, project);
      }
    };

    $scope.toggleEdit = function(project, status){
      `This function change the project status as editable or
       not editable, and save the changes made in the DOM into
       the array object values.`

      if(status=='edit'){
          project.isEditing = true;
          AdviceService.toastAdvice({message:'Habilitado para Editar'});

      }else if(status=='save'){
        project.isEditing = false;

        // 🔑 LEER EL DOM ANTES
        const $name = document.getElementById(`project_name_${project.id}`);
        const $category = document.getElementById(`project_category_${project.id}`);
        const $gender = document.getElementById(`project_gender_${project.id}`);
        const $description = document.getElementById(`project_description_${project.id}`);

        if (!$name || !$category || !$gender || !$description) return;

        const name = $name.textContent.trim();
        const category = $category.textContent.trim();
        const gender = $gender.textContent.trim();
        const description = $description.textContent.trim();

        const hasChanges =
        project.name !== name ||
        project.category !== category ||
        project.gender !== gender ||
        project.description !== description;

        // Comparación correcta
        if (hasChanges) {
          project.name = name;
          project.category = category;
          project.gender = gender;
          project.description = description;
          project.last_modificated = new Date();
          
          AdviceService.toastAdvice({
            message: 'Cambios Guardados',
            btn_close: true
          });

          ManageProject.save($scope.projects_metadata);
        } else {
          AdviceService.toastAdvice({ message: 'No se han realizado cambios' });
        }
    
      }
    }

    $scope.deleteProject = function(project){
      project.isDeleting=true;
      $timeout(() => {
        $scope.projects_metadata =
          $scope.projects_metadata.filter(p => p.id !== project.id);
          ManageProject.save($scope.projects_metadata);
      }, 500); 
    };

    $scope.openNewProjectModal = function (ev) {
      $mdDialog.show({
        controller: NewProjectDialogController,
        templateUrl: '/static/templates/modals/new_project.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false
      })
      .then(function(project){
        $scope.projects_metadata.push(project);
      });
    };
  
    $scope.openProject = function(project){
      $location.path('/project/'+ project.id)
    }

    //+ Controlador del pop up
    function NewProjectDialogController($scope, $mdDialog) {
      $scope.is_saving_project=false;
      $scope.project = {
        id: crypto.randomUUID().split('-')[0],
        name: '',
        category: '',
        gender: '',
        description: '',
        icon:'/static/src/icons/film.svg',
        isEditing:false,
        isDeleting:false,
        created: new Date(),
        last_modificated: new Date()
      };
  
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
  
      $scope.save = function () {
        $scope.is_saving_project = true;
        if(($scope.project.name.trim() == '') || ($scope.project.category.trim() == '') || ($scope.project.gender.trim() == '') || ($scope.project.description.trim() == '')){
          $scope.is_saving_project=false;
          AdviceService.toastAdvice({message:'No puedes dejar campos vacios'});
        }else{
          $mdDialog.hide($scope.project);
        }
      };
    }
}
