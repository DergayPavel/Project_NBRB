const linkCurr='https://www.nbrb.by/api/exrates/currencies';
getNameInfo(linkCurr);
var currArray=[];


async function getNameInfo(linkInfo){
    let info = await fetch(linkInfo);
    let date = await info.text();
    date=JSON.parse(date);
    if (info.ok){
        for(let i=0; i<date.length;i++){
            currArray[i]=[date[i].Cur_Name,date[i].Cur_ID];
            let nameCur=date[i].Cur_Name;
            let optionAdd=document.createElement('option');
            optionAdd.innerHTML=nameCur;
            currency.append(optionAdd);
        }
    }
}


async function getCurr(id,dateFrom,dateTo){
    let linkCurrDate;
    if(dateFrom===0 && dateTo===0){
        linkCurrDate='https://www.nbrb.by/api/exrates/rates?periodicity=0';
    }
    else{
        linkCurrDate='https://www.nbrb.by/API/ExRates/Rates/Dynamics/'+id+'?startDate='+dateFrom+'&endDate='+dateTo;
        console.log(linkCurrDate);
        console.log('www.nbrb.by/API/ExRates/Rates/Dynamics/190?startDate=2016-6-1&endDate=2016-6-30');
    }
    let info = await fetch(linkCurrDate);
    let date = await info.text();
    date=JSON.parse(date);
    if (info.ok){
        if(dateFrom===0 && dateTo===0){
            let currToday=0;
            date.forEach(el=>{       
                if (el.Cur_ID===id){
                    currSpan.style.display='flex';
                    currToday=el.Cur_OfficialRate;
                    currSpan.innerHTML = 'Cегодняшний курсc: ' + currToday; 
                }
                if(!currToday){
                    currSpan.innerHTML="Сегодняшнего курса нет."
                    currSpan.style.display='flex';
                }
            });
        }
        else if(date.length===0){ 
            myChart.style.display='none';
            currSpan.style.display='flex';
            currSpan.innerHTML="Таких данных курса нет."
        }
        else{
            let infoCurr=[];
            let infoDate=[];
            for(let i=0; i<date.length; i++){
                infoCurr[i]=date[i].Cur_OfficialRate;
                infoDate[i]=date[i].Date
            }
            console.log(infoDate)
            grap(infoDate,infoCurr);
        }
    }
    else{
        console.log('not good link')
    }    
}
