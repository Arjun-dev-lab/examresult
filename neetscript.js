let students = [];
let currentIndex = 0;

function loadCSV() {
    const file = document.getElementById('csvFile').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const lines = e.target.result.split('\n').filter(Boolean);
            students = lines.map(line => {
                const [name, batch, chemistry, maths, botany, physics, zoology] = line.split(',');
                return { name, batch, chemistry, maths, botany, physics, zoology };
            });
            currentIndex = 0;
            showStudent();
        };
        reader.readAsText(file);
    }
}

function showStudent() {
    if (students.length === 0) return;
    const student = students[currentIndex];
    document.getElementById('student-name').innerText = `Name : ${student.name}`;
    document.getElementById('chemistry-mark').innerText = `• CHEMISTRY - ${student.chemistry}/15`;
    document.getElementById('physics-mark').innerText = student.physics.trim() ? `•PHYSICS - ${student.physics}/15` : `•PHYSICS - `;
    document.getElementById('zoology-mark').innerText = `• ZOOLOGY - ${student.zoology}/15`;
    document.getElementById('botany-mark').innerText = `• BOTANY - ${student.botany}/15`;
    document.getElementById('maths-mark').innerText = `• MATHS - ${student.maths}/15`;
}

function next() {
    if (currentIndex < students.length - 1) {
        currentIndex++;
        showStudent();
    }
}

function previous() {
    if (currentIndex > 0) {
        currentIndex--;
        showStudent();
    }
}



function copyText() {
    const student = students[currentIndex];
    const heading = document.getElementById('exam-heading').value;
    const text = `${heading}\nName : ${student.name}\n•CHEMISTRY - ${student.chemistry}/15\n•ZOOLOGY - ${student.zoology}/15\n•BOTANY - ${student.botany}/15\n•MATHS - ${student.maths}/15\n•PHYSICS - ${student.physics.trim() ? student.physics : ''}/15`;
    navigator.clipboard.writeText(text);
}