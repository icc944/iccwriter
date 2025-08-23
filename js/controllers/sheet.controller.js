app.controller("sheet_controller", function($scope){

    const SHEET = document.querySelector('#sheet');
    const map_types = {
        'scene':'action',
        'action':'character',
        'character':'dialogue',
        'dialogue':'transition',
        'transition':'shot',
        'show':'scene'
    };
    const types = Object.keys(map_types);

    
    //+ === HELPERS ===
    function nextType(current_type){
        return map_types[current_type];
    }
    
    function placeCaretEnd(element){
        const range = document.createRange(); 
        range.selectNodeContents(element); 
        range.collapse(false);
        const s = getSelection(); 
        s.removeAllRanges(); 
        s.addRange(range);
    }

    
    function getCurrentLine(){
        const selection = window.getSelection();
        if (!selection.anchorNode) return null;
        
        let node = selection.anchorNode;
        if(node && node.nodeType === 3) node = node.parentElement;
        
        if (node.className !== 'line') return null; 
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
    
    SHEET.addEventListener('click', ()=>{
        const line = getCurrentLine();
        console.log(line);

        if (!line){
            console.log("Canva vacio!");
            SHEET.appendChild(makeLine('scene','INT. PLACE - DAY'));
        }
        
        $scope.setState(line);
    });
    
    SHEET.addEventListener('keydown', (e)=>{
        const line = getCurrentLine(); if (!line) return;

        if(e.key==='Enter'){
            e.preventDefault();
            const next_type = nextType(line.dataset.type);
            const new_line = makeLine(next_type, '');
            $scope.setState(new_line);
            line.after(new_line);
            placeCaretEnd(new_line);
            return;
        }
    });

    function init(){
        SHEET.innerHTML = "";
    }
});