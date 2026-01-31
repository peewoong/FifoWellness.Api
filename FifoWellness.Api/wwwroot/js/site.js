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
            <td style="padding: 10px;">${log.workerName}</td>
            <td style="padding: 10px;">${log.sleepHours}h</td>
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

    if (response.ok) {
        alert("Deleted successfully!");
        loadDashboard(); 
    } else {
        alert("Failed to delete.");
    }
}