async function loadDashboard() {
    // 1. Get data form the API we created
    const response = await fetch('/api/Wellness');
    const data = await response.json();

    // Get the search term from the input field
    const searchInput = document.getElementById('workerSearch');

    // Data filtering based on search term
    let filteredData = data;

    if (searchInput && searchInput.value.trim() !== "") {
        const searchTerm = searchInput.value.toLowerCase();
        filteredData = data.filter(log =>
            log.workerName && log.workerName.toLowerCase().includes(searchTerm)
        );
    }

    const summaryDiv = document.getElementById('riskSummary');
    if (filteredData.length === 0) {
        if (summaryDiv) summaryDiv.innerHTML = "❌ No data found for this worker.";
        if (window.myChart) { window.myChart.destroy(); }
        return;
    }

    // 2. Select only the data to display on the grap (the last 7 data)
    const recentLogs = filteredData.slice(-7);

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

    const ctx = document.getElementById('sleepChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    const intakeData = recentLogs.map(log => log.calorieIntake);
    const burnedData = recentLogs.map(log => log.caloriesBurned);
    const stepsData = recentLogs.map(log => log.steps);

    window.myChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sleep Hours (h)',
                    data: sleepHours,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: '#4bc0c0',
                    borderWidth: 1,
                    yAxisID: 'y', 
                    order: 2 
                },
                {
                    label: 'Calories Burned (kcal)',
                    type: 'line', 
                    data: burnedData,
                    borderColor: '#e67e22',
                    backgroundColor: '#e67e22',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1', 
                    order: 1 
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { // left axis : sleep hours (0~12)
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    max: 12,
                    title: { display: true, text: 'Sleep Hours' }
                },
                y1: { // right axis : calorie (0~4000)
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false }, // 격자선 중복 방지
                    title: { display: true, text: 'Calories (kcal)' }
                }
            }
        }
    });

    // [ADD] Call the summary update function
    updateRiskSummary(recentLogs);

    // [ADD] Render the log table
    renderTable(recentLogs);
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

function renderTable(logs) {
    const tableBody = document.getElementById('logTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    logs.reverse().forEach(log => { 
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #eee";

        row.innerHTML = `
            <td style="padding: 10px;">${log.workerName} (${log.shiftType || 'N/A'})</td>
            <td style="padding: 10px;">${log.sleepHours}h</td>
            <td style="padding: 10px;">${log.calorieIntake} / ${log.caloriesBurned} kcal</td>
            <td style="padding: 10px;">${log.steps.toLocaleString()} steps</td>
            <td style="padding: 10px;">${new Date(log.createdDate).toLocaleDateString()}</td>
            <td style="padding: 10px;">
                <button onclick="deleteLog(${log.id})" style="color: #e74c3c; border: none; background: none; cursor: pointer; font-weight: bold;">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function deleteLog(id) {
    if (!confirm("Are you sure you want to delete this log?")) return;

    const response = await fetch(`/api/Wellness/${id}`, {
        method: 'DELETE'
    });

    if (response.ok)
    {
        alert("Deleted successfully!");
        loadDashboard(); 
    }
    else
    {
        alert("Failed to delete.");
    }
}

function downloadCSV() { 
    const table = document.getElementById('logTableBody');
    const rows = table.querySelectorAll('tr');

    if (rows.length === 0) {
        alert("No data available to download.");
        return;
    }

    let csvContent = "Worker Name,Sleep Hours,Date\n";

    rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        const rowData = Array.from(cols)
            .slice(0, 3) 
            .map(col => col.innerText.replace('h', '')) // 'h' 글자 제거
            .join(",");
        csvContent += rowData + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `FIFO_Wellness_Report_${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}