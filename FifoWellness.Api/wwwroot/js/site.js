// 페이지가 열리자마자 실행되는 함수입니다.
async function loadDashboard() {
    // 1. 우리가 만든 API에서 데이터를 가져옵니다.
    const response = await fetch('/api/Wellness');
    const data = await response.json();

    // 2. 그래프에 표시할 데이터만 골라냅니다. (최근 7개)
    const recentLogs = data.slice(-7);

    // x축: 날짜 (가독성 있게 변환)
    const labels = recentLogs.map(log => new Date(log.createdDate).toLocaleDateString());

    // y축: 수면 시간
    const sleepHours = recentLogs.map(log => log.sleepHours);

    // 3. HTML에 있는 'sleepChart'라는 공간에 그래프를 그립니다.
    const ctx = document.getElementById('sleepChart').getContext('2d');

    new Chart(ctx, {
        type: 'line', // 선 그래프 형태
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Sleep Hours',
                data: sleepHours,
                borderColor: '#4bc0c0', // 선 색상
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // 선 아래 채우기 색상
                borderWidth: 3,
                fill: true,
                tension: 0.4 // 선을 부드럽게 곡선으로 만듦
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true, // 0부터 시작
                    max: 12,           // 수면 시간이니 12시간을 최대로 설정
                    title: { display: true, text: 'Hours' }
                }
            }
        }
    });
}

loadDashboard();