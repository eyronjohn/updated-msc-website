//Students by College
async function renderStudentsPerCollegeChart() {
    try {
        const res = await fetch(`${API_BASE}/students/college-distribution`, { credentials: "include" });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        const labels = data.data.map(item => item.college);
        const values = data.data.map(item => item.total);

        const ctx = document.getElementById('studentsPerCollegeChart').getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'No. of Students',
                    data: values,
                    backgroundColor: [
                        '#60A5FA', '#34D399', '#FBBF24', '#F87171',
                        '#A78BFA', '#F472B6', '#4ADE80', '#818CF8'
                    ],
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    // title: {
                    //     display: true,
                    //     text: 'Students per College'
                    // }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Chart error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderStudentsPerCollegeChart();
});

async function renderStudentsPerYearLevelChart() {
    try {
        const res = await fetch(`${API_BASE}/students/yearLevel-distribution`, { credentials: "include" });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        const labels = data.data.map(item => item.year_level);
        const values = data.data.map(item => item.total);

        const ctx = document.getElementById('studentsPerYearLevelChart').getContext('2d');

        new Chart(ctx, {
            type: 'bar', //pie, bar
            data: {
                labels: labels,
                datasets: [{
                    label: 'No. of Students',
                    data: values,
                    backgroundColor: [
                        '#60A5FA', '#34D399', '#FBBF24', '#F87171', //1st - 4th Year
                    ],
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    // title: {
                    //     display: true,
                    //     text: 'Students per Year Level'
                    // }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Chart error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderStudentsPerYearLevelChart();
});