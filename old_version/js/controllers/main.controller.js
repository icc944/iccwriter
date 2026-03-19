app.controller("main_controller", function($scope){

    $scope.saveSheet = function(){
        const pages = [];
        Array.from(document.getElementsByClassName('sheet')).forEach((sheet)=>{
            lines_in_sheet = Array.from(sheet.querySelectorAll('.line')).map(line=>{
                return {
                    type: line.dataset.type, 
                    text: line.textContent
                }
            });
            pages.push(lines_in_sheet);
        });

        console.log(pages);
    }
});