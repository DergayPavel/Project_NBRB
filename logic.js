document
    .querySelector('button')
    .addEventListener('click', main);

function main(){
    let dateOne=timeFrom();
    let dateTwo=timeTo();
    let nameCurr=getNameCurr();
    let idCurr=getCurrID(nameCurr);
    if(dateOne==='' && dateTwo===''){
        let currToday=getCurr(idCurr,0,0);
        currSpan.style.display='flex';
        myChart.style.display='none';
    }
    else{
        getCurr(idCurr,dateOne,dateTwo);
        myChart.style.display='flex';
        currSpan.style.display='none';
    }
    
}

function timeFrom(){
    return document.querySelector('#dateFrom').value;
}

function timeTo(){
    return document.querySelector('#dateTo').value;
}

function getNameCurr(){
    return document.querySelector('select').value;
}

function getCurrID(name){
    let id;
    currArray.forEach(el=>{
        if(el[0]===name){
            id=el[1];
        }
    });
    return id;
}

