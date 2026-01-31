async function loadDashboard() {
    // 1. Get data form the API we created
    const response = await fetch('/api/Wellness');
    const data = await response.json();

    // 2. Select only the data to display on the grap (the last 7 data)
    const recentLogs = data.slice(-7);

    // x : date
    const labels = recentLogs.map(log => new Date(log.createdDate).toLocaleDateString());

    // y : sleep hours
    const sleepHours = recentLogs.map(log => log.sleepHours);

    const pointColors = recentLogs.map(log => {
        if ((log.fatigueStatus && log.fatigueStatus.includes("Risk")) || log.sleepHours < 6) {
            return '#e74c3c'; // red
        }
        return '#4bc0c0'; // blue
    });

    // 3. Draw a graph in the 'sleepChart' in HTML
    const ctx = document.getElementById('sleepChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line', // line graph form
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Sleep Hours',
                data: sleepHours,
                borderColor: '#4bc0c0', // line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // color under the line
                pointBackgroundColor: pointColors,
                pointBorderColor: pointColors,
                pointRadius : 6,
                borderWidth: 3,
                fill: true,
                tension: 0.4 // make the line into a smooth curve
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max : 12 }
            }
        }
    });

    // [ADD] Call the summary update function
    updateRiskSummary(recentLogs);
}

function updateRiskSummary(logs) {
    const riskWorkers = logs
        .filter(log => log.fatigueStatus && log.fatigueStatus.includes("Risk"))
        .map(log => log.workerName);

    const summaryDiv = document.getElementById('riskSummary');
    if (!summaryDiv) return;

    // Remove duplicates using Set
    const uniqueRisks = [...new Set(riskWorkers)];

    if (uniqueRisks.length > 0) {
        summaryDiv.innerHTML = `<strong style="color: #e74c3c;">⚠️ High Risk Alert:</strong> ${uniqueRisks.join(', ')} (Requires Attention)`;
    } else {
        summaryDiv.innerHTML = `<strong style="color: #27ae60;">✅ Status:</strong> All monitored workers are within safe fatigue limits.`;
    }
}


loadDashboard();