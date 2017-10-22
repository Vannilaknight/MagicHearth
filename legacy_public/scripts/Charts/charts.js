var manaCountCTX = document.getElementById("manaCount");
var manaSymbolCountCTX = document.getElementById("manaSymbolCount");

function createChart(manaCountData, manaSymbolCountData) {
    var manaCount = new Chart(manaCountCTX, {
        type: 'bar',
        data: {
            labels: ["0 cost", "1 cost", "2 cost", "3 cost", "4 cost", "5 cost", "6 cost", "7 cost", "8 cost"],
            datasets: [{
                label: 'Card Count',
                data: manaCountData,
                backgroundColor: [
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.4)'
                ],
                borderColor: [
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var manaSymbolCount = new Chart(manaSymbolCountCTX, {
        type: 'doughnut',
        data: {
            labels: ["Blue Mana", "White Mana", "Black Mana", "Red Mana", "Green Mana"],
            datasets: [{
                label: 'Card Count',
                data: manaSymbolCountData,
                backgroundColor: [
                    'rgba(0, 0, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(0, 0, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 0, 1)',
                ],
                borderColor: [
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                    'rgba(0,0,0,1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}
