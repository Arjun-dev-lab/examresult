let excelData = [];
let currentIndex = 0;

const fileInput = document.getElementById('excelFile');
const nameColumnSelect = document.getElementById('nameColumn');
const phoneColumnSelect = document.getElementById('phoneColumn');
const subjectsArea = document.getElementById('subjectsArea');
const examNameInput = document.getElementById('examName');
const previewHeading = document.getElementById('previewHeading');
const previewMeta = document.getElementById('previewMeta');
const previewSubjects = document.getElementById('previewSubjects');
const rawMessage = document.getElementById('rawMessage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
const addSubjectBtn = document.getElementById('addSubjectBtn');

fileInput.addEventListener('change', handleFile);

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(sheet);

        populateColumnSelects();
        updatePreview();
    };
    reader.readAsArrayBuffer(file);
}

function populateColumnSelects() {
    const columns = Object.keys(excelData[0]);
    [nameColumnSelect, phoneColumnSelect].forEach(select => {
        select.innerHTML = '';
        columns.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            select.appendChild(option);
        });
    });
}

addSubjectBtn.addEventListener('click', () => {
    if (!excelData.length) return;

    const columns = Object.keys(excelData[0]);
    const rowDiv = document.createElement('div');
    rowDiv.className = 'subject-row';

    const colSelect = document.createElement('select');
    columns.forEach(col => {
        const opt = document.createElement('option');
        opt.value = col;
        opt.textContent = col;
        colSelect.appendChild(opt);
    });

    const subjNameInput = document.createElement('input');
    subjNameInput.type = 'text';
    subjNameInput.placeholder = 'Subject Name';

    const totalMarksInput = document.createElement('input');
    totalMarksInput.type = 'number';
    totalMarksInput.placeholder = 'Total Marks';

    rowDiv.appendChild(colSelect);
    rowDiv.appendChild(subjNameInput);
    rowDiv.appendChild(totalMarksInput);

    subjectsArea.appendChild(rowDiv);
});

function updatePreview() {
    if (!excelData.length) return;

    const student = excelData[currentIndex];
    const examName = examNameInput.value.trim() || "CHAPTERWISE DESCRIPTIVE EXAMINATION-1";
    const studentName = student[nameColumnSelect.value] || "Unknown";

    previewHeading.textContent = examName;
    previewMeta.textContent = `Name: ${studentName}`;

    let subjectsText = '';
    previewSubjects.innerHTML = '';

    const subjectRows = subjectsArea.querySelectorAll('.subject-row');
    subjectRows.forEach(row => {
        const col = row.querySelector('select').value;
        const subjName = row.querySelector('input[type="text"]').value.trim();
        const total = row.querySelector('input[type="number"]').value.trim();
        if (col && subjName && total) {
            const mark = student[col] !== undefined ? student[col] : '';
            const line = `•${subjName.padEnd(15)} -   ${mark}/${total}`;
            subjectsText += line + '\n';

            const div = document.createElement('div');
            div.className = 'subject-line';
            div.innerHTML = `<span>${subjName}</span><span>${mark}/${total}</span>`;
            previewSubjects.appendChild(div);
        }
    });

    const message = `*${examName}*\n\nName: ${studentName}\n\n${subjectsText}`.trim();
    rawMessage.textContent = message;
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updatePreview();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < excelData.length - 1) {
        currentIndex++;
        updatePreview();
    }
});

sendWhatsappBtn.addEventListener('click', () => {
    const student = excelData[currentIndex];
    const phone = student[phoneColumnSelect.value];
    if (!phone) {
        alert('Phone number is missing for this student.');
        return;
    }
    const msg = encodeURIComponent(rawMessage.textContent);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
});

examNameInput.addEventListener('input', updatePreview);
subjectsArea.addEventListener('input', updatePreview);
nameColumnSelect.addEventListener('change', updatePreview);
phoneColumnSelect.addEventListener('change', updatePreview);
