app.controller("sheet_controller", function($scope){
    const SHEET = document.querySelector('#sheet');
    const map_types = {
        'scene':'action',
        'action':'character',
        'character':'parenthetical',
        'parenthetical':'dialogue',
        'dialogue':'transition',
        'transition':'shot',
        'show':'scene'
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

    function updateState(line){
        $editor_badge.textContent = line.dataset.type;
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
        
        updateState(line);
    });
    
    SHEET.addEventListener('keydown', (e)=>{
        if(e.key==='Enter'){
            e.preventDefault();
            const line = getCurrentLine(); if (!line) return;
            
            //* Generar casos para cuando
            //* 1.- Termina un dialogo y sigue otro personaje
            //* 2.- 
            let next_type = line.dataset.type === 'dialogue' ? 'character':nextType(line.dataset.type);
            const new_line = makeLine(next_type, '');
            line.after(new_line);
            placeCaretEnd(new_line);
            
            updateState(line);
            return;
        }

    });

    SHEET.addEventListener('keyup',(e)=>{
        if(['ArrowUp','ArrowDown'].includes(e.key)){
            e.preventDefault();
            const line = getCurrentLine(); if (!line) return;
            updateState(line);
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