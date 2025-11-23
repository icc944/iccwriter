app.controller("sheet_controller", function($scope){
    const SHEET = document.querySelector('#sheet');
    const map_types = {
        'scene':'action',
        'action':'character',
        'character':'dialogue',
        'dialogue':'transition',
        'parenthetical':'transition',
        'transition':'shot',
        'shot':'scene'
    };

    $scope.character_names = [];

    //@ === Variables Helpers ====
    const types = Object.keys(map_types);
    const $editor_badge = document.querySelector('#badge');
    $editor_badge.textContent = "scene";
    $box_suggestion = document.getElementById('suggestions');
    $box_sugg_pos = -1; 


    //+ ==== Helpers ====
    function nextType(current_type){
        return map_types[current_type];
    }
    
    function placeCaretEnd(element){
        //* Funcion necesaria para desplazar el cursor
        const range = document.createRange(); 
        range.selectNodeContents(element); 
        range.collapse(false);
        const s = getSelection(); 
        s.removeAllRanges(); 
        s.addRange(range);
    }

    function updateState(state){
        $editor_badge.textContent = state;
    }

    function newCharacter(character){
        if ($scope.character_names.includes(character)){
            return
        }
        $scope.character_names.push(character);
        console.log($scope.character_names);
    }

    //+ === Logica === 
    function getCurrentLine(){
        const selection = window.getSelection();
        if (!selection.anchorNode) return null;
        let node = selection.anchorNode;
        if(node && node.nodeType === 3) node = node.parentElement;
        if (node.className !== 'line') return null; 
        console.log("Devolviendo linea actual:", node);
        return node;
    }


    function makeLine(type, text=''){
        const line = document.createElement('div');
        line.className='line';
        line.dataset.type=type;
    
        switch(type){
            case 'scene':
                const span = ""
                line.appendChild(document.createElement('span'));
                console.log("Haré:", line);
                break;
        }

        line.textContent=text;
        line.contentEditable='true';
        return line
    }
    
    //+ === Eventos ===
    SHEET.addEventListener('click', ()=>{
        const line = getCurrentLine();

        if (!line){
            console.log("Canva vacio!");
            SHEET.appendChild(makeLine('scene','INT. PLACE - DAY'));
        }
        
        updateState(line.dataset.type);
    });
    
    SHEET.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            const line = getCurrentLine(); if (!line) return;
            
            let next_type=null;
            console.log("[VALOR]:",line.textContent," [TIPO]:",line.dataset.type);

            switch(true){
                case line.textContent.trim() === '':
                    next_type = 'action';
                    break;

                case line.dataset.type === 'character':
                    //+ Revisar si selecciono un character ya definido
                    let exist_suggestion = $box_suggestion.querySelector('.highlight');

                    if ((line.textContent.length > 2) && (exist_suggestion === null)){
                        newCharacter(line.textContent);
                    }else if(exist_suggestion){
                        line.textContent = exist_suggestion.textContent;
                    }

                    $box_suggestion.style.display = "none";
                    next_type = 'dialogue';
                    updateState(next_type);
                    break;

                case line.dataset.type === 'dialogue':
                    next_type = 'character';
                    break;
                
                case line.dataset.type === 'parenthetical':
                    next_type = 'dialogue';
                    updateState(next_type);
                    break;

                case (line.dataset.type === 'action') && !(line.textContent.trim() === ''):
                    next_type = 'action';
                    updateState(next_type);
                    break;

                default:
                    next_type = nextType(line.dataset.type);
            }

            const new_line = makeLine(next_type, '');


            line.after(new_line); //* Es como un append child
            
            placeCaretEnd(new_line); //* Mover el apuntador al inicio
            updateState(next_type);
            return;
        }
        
        if(e.key === 'Tab'){
            e.preventDefault();

            const line = getCurrentLine(); if (!line) return;
            const current_type = line.dataset.type;
            let next_type = undefined;
            
            //*+ Revisar que habia antes seleccionado
            switch(current_type){
                case 'dialogue':
                    next_type = 'parenthetical';
                    break;
                default:
                    next_type = nextType(current_type);
                    break;
            }


            line.dataset.type = next_type;
            updateState(next_type);
        }

        if(['ArrowUp','ArrowDown'].includes(e.key)){
            //* Validamos que este posicionado sobre character y que exista una recomendacion abierta
            //* Si es el caso, manejamos el evento
            if(($editor_badge.textContent == 'character') && ($box_suggestion.style.display === "block")){
                e.preventDefault();
                switch(true){
                    case e.key === 'ArrowUp' && $box_sugg_pos >= 1:
                        $box_sugg_pos-=1;
                        break;
                    case e.key === 'ArrowDown' && $box_sugg_pos < ($box_suggestion.childNodes.length - 1):
                        $box_sugg_pos+=1;
                        break;
                }
                
                const items = $box_suggestion.querySelectorAll(".item-suggestion");
                items.forEach((node, idx)=>{
                    idx === $box_sugg_pos ? node.classList.add("highlight"):node.classList.remove("highlight");
                });
            }
        }
    });

    SHEET.addEventListener('keyup',(e)=>{
        if(['ArrowUp','ArrowDown'].includes(e.key)){
            e.preventDefault();
            const line = getCurrentLine(); if (!line) return;
            updateState(line.dataset.type);
        }

        if(e.key === 'Backspace'){
            const line = getCurrentLine(); if (!line) return;
            updateState(line.dataset.type);
        }

        if($editor_badge.textContent == 'character'){
            //+ Usamos condicional para solo filtrar el la seccion de character

            const line = getCurrentLine();
            const text = line.textContent.toLowerCase();
            
            if(text.length < 1){ $box_suggestion.style.display="none"; return }
            
            //* Buscar coincidencias
            const matches = $scope.character_names.filter(x => x.startsWith(text));
            if(matches.length <= 0){$box_suggestion.style.display="none"; return} // No mostrar si no hay
            
            //* Dejar de mostrar si hay coincidencia 100% o no existe
            if(matches.length === 1){
                if (matches[0].length === text.length){
                    $box_suggestion.style.display="none"; 
                    return
                }
            }

            if($box_suggestion.style.display==='block' && ['ArrowUp','ArrowDown'].includes(e.key)){
                //* Evitar que se sobrescriba la caja 
                return
            }

            //* Posicionarlo justo debajo
            const rect = line.getBoundingClientRect();
            $box_suggestion.style.left = rect.left + "px";
            $box_suggestion.style.top = rect.bottom + "px";
            $box_suggestion.style.display = "block";

            //* Añadir sugerencias
            $box_suggestion.innerHTML = "";
            matches.forEach(name => {
                const item = document.createElement('div');
                item.classList.add('item-suggestion');
                item.textContent = name;
                item.style.padding = "4px";

                item.addEventListener("mousedown", ()=>{
                    line.innerHTML = name;
                    $box_suggestion.style.display = "none";
                });

                $box_suggestion.appendChild(item);
            });

            $box_sugg_pos=-1;
        }

    });


    //+ =============================== INICIO =================================
    function init(){
        SHEET.innerHTML = "";
        $editor_badge.textContent = "scene";
        SHEET.appendChild(makeLine('scene','INT. PLACE - DAY'));
    }
    init();
});