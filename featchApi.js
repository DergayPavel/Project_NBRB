fetch('https://www.nbrb.by/api/exrates/currencies')
    .then(r => r.json())
    .then(parse1)
    .then(addSelect)

document
    .querySelector('button')
    .addEventListener('click', main);

var obj;

function parse1(resp){
    const setvals = new Set();
    obj = resp
    .map(({
        Cur_ID:Cur_ID,
        Cur_ParentID:Cur_ParentID,
        Cur_Name:Cur_Name,
        Cur_DateStart:Cur_DateStart,
        Cur_DateEnd:Cur_DateEnd
    }) => {
        return {Cur_ID, Cur_ParentID, Cur_Name, Cur_DateStart, Cur_DateEnd}
    })
    .reduce(
        (acc, el) => {
            if (!acc[el.Cur_ParentID] && !acc[el.Cur_Name]) {
                const arr = [el]
                acc[el.Cur_ParentID] = arr
                acc[el.Cur_Name] = arr;
            }else if (acc[el.Cur_ParentID] && !acc[el.Cur_Name]) {
                acc[el.Cur_Name] = acc[el.Cur_ParentID]
                acc[el.Cur_ParentID].push(el)
            } else if (!acc[el.Cur_ParentID] && acc[el.Cur_Name]) {
                acc[el.Cur_ParentID] = acc[el.Cur_Name]
                acc[el.Cur_ParentID].push(el)
            } else {
                acc [el.Cur_ParentID].push(el)
            }
            return acc;
        },{}
    )
    return obj;
}

function addSelect(obj){
    console.log(obj);
    console.log(Object.keys(obj));
    let name= Object.keys(obj);
    let selectName=[];
    for(let i=0; i<name.length;i++){
        if((Number(name[i])*0)!=0){
            selectName.push(name[i]);
        }
    }
    console.log(selectName);
    for(let i=0; i<selectName.length;i++){
        let optionAdd=document.createElement('option');
        optionAdd.innerHTML=selectName[i];
        currency.append(optionAdd);
    }
}

function timeFrom(){
    return document.querySelector('#dateFrom').value;
}

function timeTo(){
    return document.querySelector('#dateTo').value;
}

function getCurrName(){
    return document.querySelector('#currency').value;
}

function getInfo(name,obj){
    console.log([name,obj]);
    let objArr=Object.entries(obj);
    for(let i=0; i<objArr.length;i++){
        if(objArr[i][0]===name){
            return objArr[i][1]
        }
    }  
}

function getCurrIDs(start,end,currInfo){
    let currIDs=[];
    for(let i=0; i<currInfo.length; i++){
        if(start<=currInfo[i].Cur_DateEnd && currInfo[i].Cur_DateStart<end){
            currIDs.push(currInfo[i].Cur_ID);
            currIDs.push(currInfo[i].Cur_DateStart);
            currIDs.push(currInfo[i].Cur_DateEnd);
        }
    }
    return currIDs;
}

async function addSpan(link){
    fetch(link)
    .then(r => r.json())
    .then((ob)=>{
        console.log(ob.Cur_OfficialRate)
        currSpan.innerHTML = 'Курсc на данную дату: ' + ob.Cur_OfficialRate;
    })
}

function getLinks(info, id, start,end){
    let links=[];
    if(start==end && start!=''){
        chart_div.style.display='none';
        currSpan.style.display='flex';
        console.log('https://www.nbrb.by/api/exrates/rates/'+id[0]+'?ondate='+start)
        addSpan('https://www.nbrb.by/api/exrates/rates/'+id[0]+'?ondate='+start);
        return;

    }
    else{
        chart_div.style.display='flex';
        currSpan.style.display='none';
        let startDate=start;
        let startYear=Number(start.substring(0,4));
        let startDay=start.substring(4,10);
        let lastYear=Number(end.substring(0,4));
        let nextYear=Number(startDate.substring(0,4))+1
        if(nextYear>=lastYear && id.length<4){
            links.push('https://www.nbrb.by/API/ExRates/Rates/Dynamics/'+id[0]+'?startDate='+start+'&endDate='+end);
            return links
        }else{
            for(let i=0; i<id.length; i=i+3){
            let endYearID=Number(id[i+2].substring(0,4));
            while(nextYear < endYearID){
                links.push('https://www.nbrb.by/API/ExRates/Rates/Dynamics/'+id[i]+'?startDate='+startYear+startDay+'&endDate='+nextYear+startDay);
                if(nextYear+1>lastYear){
                    if(Number(startDay.substring(1,3))<end.substring(5,7)){
                        startYear=nextYear;
                    }
                    links.push('https://www.nbrb.by/API/ExRates/Rates/Dynamics/'+id[i]+'?startDate='+startYear+startDay+'&endDate='+end);
                    return links;
                }
                startYear=nextYear;
                nextYear++;
            }
            links.push('https://www.nbrb.by/API/ExRates/Rates/Dynamics/'+id[i]+'?startDate='+startYear+startDay+'&endDate='+(id[i+2]).substring(0,10))
            startDay=(id[i+4]).substring(4,10);
            }
        }
    }
}
var arrDate=[];
async function getDateLinks(links){
    arrDate=[];
    let info=[];
    let i;
    console.log('links: '+links)
    for(i=0; i<links.length;i++){
        info[i]= await fetch(links[i])
            .then(r => r.json())
            .then(parse2)
            .then(console.log);
            console.log('i: '+i)
    }
    if(i===links.length){
        getChart(arrDate);
        return arrDate
    }
}

function parse2(elem){
    for(let i=0; i<elem.length;i++){
        arrDate.push(elem[i].Date)
        arrDate.push(elem[i].Cur_OfficialRate)
    }
    return arrDate;
}

function main(){
    let start=timeFrom();
    let end=timeTo();
    console.log('start: ',start,'end: ',end);
    if(start>end){ 
        chart_div.style.display='none';
        currSpan.style.display='flex';
        currSpan.innerHTML='неверна дата';
        return;
    }
    
    let nameCur=getCurrName();
    console.log('name: ', nameCur);
    let currInfo=getInfo(nameCur,obj);
    console.log(currInfo);
    let currIDs=getCurrIDs(start,end,currInfo);
    console.log('id for info: ',currIDs);
    let dateLinks=getLinks(currInfo,currIDs,start,end);
    console.log('links fo featch: ', [dateLinks]);
    if(start<end){
        getDateLinks(dateLinks);
    }
    return;
}

function getChart(dateChart){
    let dateX=[];
    let dateY=[]
    for(let i=0; i<dateChart.length;i+=2){
        dateX.push(dateChart[i]);
        dateY.push(dateChart[i+1]);
    }
    console.log('dateX: '+ dateX)
    console.log('dateY: '+ dateY)
    grap(dateX,dateY)
}