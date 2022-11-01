// function grap(dateX, dateY){
    // let ctx = document.getElementById('myChart').getContext('2d');
    // new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: dateX,
    //         datasets: [{ // График зелёного цвета
    //             label: 'Курс',
    //             backgroundColor: 'transparent',
    //             borderColor: 'green',
    //             data: dateY,
    //         }],
    //     },
    // });
// }

google.charts.load('current', {'packages':['corechart']});

function grap(dateX,dateY) {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Time of Day');
    data.addColumn('number', 'Curr');

    let info=[];
    for(let i=0; i<dateX.length;i++){
        info[i]=[new Date(dateX[i]),dateY[i]];
    }
    data.addRows(info);
    var options = {
        // width: document.body.style.width,
        // height: 500,
        hAxis: {
            format: 'M/d/yy',
            gridlines: {count: 15}
        },
        vAxis: {
            gridlines: {color: 'none'},
            minValue: 0
        }
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}