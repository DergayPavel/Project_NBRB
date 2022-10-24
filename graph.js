function grap(dateX, dateY){
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateX,
            datasets: [{ // График зелёного цвета
                label: 'Курс',
                backgroundColor: 'transparent',
                borderColor: 'green',
                data: dateY,
            }],
        },
    });
}
