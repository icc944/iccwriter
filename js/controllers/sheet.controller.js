app.controller("sheet_controller", function($scope){
    const SHEET = document.querySelector('#sheet');
    const map_types = {
        'scene':'action',
        'action':'character',
        'character':'parenthetical',
        'parenthetical':'dialogue',
        'dialogue':'transition',
        'transition':'shot',
        'shot':'scene'
    };

    const types = Object.keys(map_types);
    const $editor_badge = document.querySelector('#badge');
    $editor_badge.textContent = "scene";
    
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

            switch(line.dataset.type){
                case 'dialogue':
                    next_type = 'character';
                    break;
                
                case 'parenthetical':
                    if (line.textContent === ''){
                        console.log("Entro en case");
                        line.dataset.type = 'dialogue';
                        updateState('dialogue');
                        return;
                    }

                default:
                    next_type = nextType(line.dataset.type);
            }

            const new_line = makeLine(next_type, '');


            line.after(new_line); //* Es como un append child
            
            placeCaretEnd(new_line); //* Mover el apuntador al inicio
            updateState(next_type);
            return;
        }
        
        if (e.key === 'Tab'){
            //+ 1.- Tab despues de terminar un dialogo => action
            
            e.preventDefault();
            const line = getCurrentLine(); if (!line) return;
            const current_type = line.dataset.type;
            const next_type = nextType(current_type);
            line.dataset.type = next_type;
        }

    });

    SHEET.addEventListener('keyup',(e)=>{
        if(['ArrowUp','ArrowDown'].includes(e.key)){
            e.preventDefault();
            const line = getCurrentLine(); if (!line) return;
            
            updateState(line.dataset.type);
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