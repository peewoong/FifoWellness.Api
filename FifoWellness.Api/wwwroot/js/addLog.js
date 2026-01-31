
async function addLog() {
    const name = document.getElementById('newName').value.trim();
    const shift = document.getElementById('newShift').value;
    const sleep = parseFloat(document.getElementById('newSleep').value);
    const intake = parseInt(document.getElementById('newIntake').value) || 0;
    const burned = parseInt(document.getElementById('newBurned').value) || 0;
    const steps = parseInt(document.getElementById('newSteps').value) || 0;

    if (!name || isNaN(sleep)) {
        alert("Please enter both name and sleep hours.");
        return;
    }

    const newLog = {
        workerName: name,
        shiftType: shift,
        sleepHours: sleep,
        calorieIntake: intake,
        caloriesBurned: burned,
        steps: steps
    };

    const response = await fetch('/api/Wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
    });

    if (response.ok || response.status == 200 || response.status == 201) {
        alert("New log added!");
        document.querySelectorAll('input').forEach(input => { if (input.type !== 'date') input.value = ''; });
        await loadDashboard();
    }
    else {
        alert("Error: " + (errorData.errors?.SleepHours || "Failed to add log"));
    }
}
