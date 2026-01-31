let allLogs = [];
const pageSize = 10;
let currentPage = 1;

loadDashboard();

async function loadDashboard() {
    try {
        const response = await fetch('/api/Wellness');
        allLogs = await response.json();
        applyFiltersAndRender();
    } catch (err) {
        console.error("Failed to load dashboard:", err);
    }
}

function applyFiltersAndRender() {
    const searchTerm = document.getElementById('workerSearch').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let filtered = allLogs;

    if (searchTerm) {
        filtered = filtered.filter(log => log.workerName.toLowerCase().includes(searchTerm));
    }
    if (startDate) {
        filtered = filtered.filter(log => new Date(log.createdDate) >= new Date(startDate));
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        filtered = filtered.filter(log => new Date(log.createdDate) <= end);
    }

    filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    updateRiskSummary(filtered);
    renderChart(filtered.slice(0, 7).reverse());
    renderTable(filtered);
}

function updateRiskSummary(logs) {
    const riskLogs = logs.filter(l => l.sleepHours < 6);
    const riskNames = [...new Set(riskLogs.map(l => l.workerName))];
    const summary = document.getElementById('riskSummary');

    if (riskNames.length === 0) {
        summary.innerHTML = "✅ All workers are within safe fatigue limits.";
        return;
    }

    let nameDisplay = "";
    if (riskNames.length <= 3) {
        nameDisplay = `(${riskNames.join(', ')})`;
    } else {
        nameDisplay = `(${riskNames.slice(0, 3).join(', ')} 외 ${riskNames.length - 3}명)`;
    }

    summary.innerHTML = `<strong style="color: #e74c3c;">⚠️ High Risk: ${riskNames.length} persons</strong> ${nameDisplay}`;
}

function renderTable(logs) {
    const tableBody = document.getElementById('logTableBody');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pagedLogs = logs.slice(start, end);

    pagedLogs.forEach(log => {
        const row = `<tr>
            <td style="padding:10px;">${log.workerName} (${log.shiftType || '-'})</td>
            <td style="padding:10px;">${log.sleepHours}h</td>
            <td style="padding:10px;">${log.calorieIntake}/${log.caloriesBurned}</td>
            <td style="padding:10px;">${log.steps}</td>
            <td style="padding:10px;">${new Date(log.createdDate).toLocaleDateString()}</td>
            <td style="padding:10px;"><button onclick="deleteLog(${log.id})" style="color:red; cursor:pointer; border:none; background:none;">Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    renderPaginationControls(logs.length);
}

function renderPaginationControls(totalCount) {
    let paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) {
        paginationDiv = document.createElement('div');
        paginationDiv.id = 'pagination';
        paginationDiv.style.textAlign = 'center';
        paginationDiv.style.marginTop = '20px';
        document.querySelector('.dashboard-card').appendChild(paginationDiv);
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    paginationDiv.innerHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
        <span style="margin: 0 15px;">Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
}

function changePage(page) {
    currentPage = page;
    applyFiltersAndRender();
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const activeId = document.activeElement.id;
        if (['newName', 'newSleep', 'newIntake', 'newBurned', 'newSteps'].includes(activeId)) {
            addLog();
        }
    }
});

async function addLog() {
    const name = document.getElementById('newName').value.trim();
    const shift = document.getElementById('newShift').value;
    const sleep = parseFloat(document.getElementById('newSleep').value);
    const intake = parseInt(document.getElementById('newIntake').value) || 0;
    const burned = parseInt(document.getElementById('newBurned').value) || 0;
    const steps = parseInt(document.getElementById('newSteps').value) || 0;

    if (!name || isNaN(sleep)) {
        alert("Please enter Name and Sleep Hours.");
        return;
    }

    const newLog = { workerName: name, shiftType: shift, sleepHours: sleep, calorieIntake: intake, caloriesBurned: burned, steps: steps };

    const response = await fetch('/api/Wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
    });

    if (response.ok) {
        alert("✅ Log added!");
        ['newName', 'newSleep', 'newIntake', 'newBurned', 'newSteps'].forEach(id => document.getElementById(id).value = '');
        currentPage = 1;
        await loadDashboard();
    }
}

function renderChart(recentData) {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    const labels = recentData.map(log => new Date(log.createdDate).toLocaleDateString());
    const sleepData = recentData.map(log => log.sleepHours);
    const burnedData = recentData.map(log => log.caloriesBurned);

    if (window.myChart) { window.myChart.destroy(); }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Sleep (h)', data: sleepData, backgroundColor: 'rgba(75, 192, 192, 0.6)', yAxisID: 'y' },
                { label: 'Burned (kcal)', type: 'line', data: burnedData, borderColor: '#e67e22', yAxisID: 'y1' }
            ]
        },
        options: { scales: { y: { beginAtZero: true }, y1: { beginAtZero: true, position: 'right' } } }
    });
}

async function deleteLog(id) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/Wellness/${id}`, { method: 'DELETE' });
    loadDashboard();
}

function downloadCSV() {
    let csv = "Name,Sleep,In/Out,Steps,Date\n";
    allLogs.forEach(log => {
        csv += `${log.workerName},${log.sleepHours},${log.calorieIntake}/${log.caloriesBurned},${log.steps},${new Date(log.createdDate).toLocaleDateString()}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "Wellness_Report.csv"; a.click();
}