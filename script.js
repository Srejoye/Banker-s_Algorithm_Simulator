let simulationSpeed = 1000;

// Scrolls to a section by ID, alerts if the element is hidden or not found
function scrollToSection(id) {
    let el = document.getElementById(id);
    if (!el || el.style.display === 'none') {
        alert('Run the simulator first to see this section.');
        return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Generates allocation, maximum, available, and need matrix tables based on process and resource inputs
function generateTables() {
    let p = parseInt(document.getElementById('processes').value);
    let r = parseInt(document.getElementById('resources').value);
    if (isNaN(p) || isNaN(r) || p <= 0 || r <= 0) {
        alert("Please enter valid positive numbers for processes and resources.");
        return;
    }
    let section = document.getElementById('tables-section');
    section.innerHTML = '';
    let lbl = document.createElement('div');
    lbl.className = 'section-label';
    lbl.innerHTML = '02 &nbsp; Matrix Inputs';
    section.appendChild(lbl);
    let grid = document.createElement('div');
    grid.className = 'matrices-grid';
    grid.appendChild(createMatrixPanel('Allocation', p, r));
    grid.appendChild(createMatrixPanel('Maximum', p, r));
    section.appendChild(grid);
    let lbl2 = document.createElement('div');
    lbl2.className = 'section-label';
    lbl2.style.marginTop = '6px';
    lbl2.innerHTML = '03 &nbsp; Available Resources & Need Matrix';
    section.appendChild(lbl2);
    section.appendChild(createAvailCard(r));
    section.appendChild(createNeedPanel(p, r));
    generateRequestSection(p, r);
    document.getElementById('sim-section').style.display = 'block';
    document.getElementById('output').style.display = 'none';
    const simCard = document.getElementById('sim-controls-card');
    const reqCard = document.getElementById('req-card');
    simCard.style.display = 'block';
    reqCard.style.display = 'block';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        simCard.style.opacity = '1';
        simCard.style.transform = 'translateY(0)';
        reqCard.style.opacity = '1';
        reqCard.style.transform = 'translateY(0)';
    }));
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

// Builds a matrix table with headers and input cells for each process and resource
function buildMatrixTable(id, p, r, editable) {
    let table = document.createElement('table'); table.id = id;
    let thead = document.createElement('thead');
    let hr = document.createElement('tr'); hr.appendChild(document.createElement('th'));
    for (let j = 0; j < r; j++) { let th = document.createElement('th'); th.innerText = 'R' + j; hr.appendChild(th); }
    thead.appendChild(hr); table.appendChild(thead);
    let tbody = document.createElement('tbody');
    for (let i = 0; i < p; i++) {
        let row = document.createElement('tr');
        let ltd = document.createElement('td'); ltd.className = 'row-lbl'; ltd.innerText = 'P' + i; row.appendChild(ltd);
        for (let j = 0; j < r; j++) {
            let td = document.createElement('td');
            let inp = document.createElement('input');
            if (editable) { inp.type = 'number'; inp.min = '0'; inp.value = '0'; inp.oninput = updateNeedMatrix; }
            else { inp.disabled = true; inp.value = '0'; }
            td.appendChild(inp); row.appendChild(td);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    return table;
}

// Creates a styled matrix panel card with a header badge and an editable matrix table
function createMatrixPanel(title, p, r) {
    let div = document.createElement('div');
    div.className = 'matrix-card'; div.id = title.toLowerCase() + '-section';
    let hdr = document.createElement('div'); hdr.className = 'matrix-header';
    let badge = document.createElement('span');
    badge.className = 'matrix-badge ' + (title === 'Allocation' ? 'badge-alloc' : 'badge-max');
    badge.innerText = title + ' Matrix';
    let desc = document.createElement('span'); desc.className = 'matrix-desc';
    desc.innerText = title === 'Allocation' ? 'Resources held by process' : 'Maximum ever needed';
    hdr.appendChild(badge); hdr.appendChild(desc);
    div.appendChild(hdr);
    let wrap = document.createElement('div'); wrap.className = 'tbl-wrap';
    wrap.appendChild(buildMatrixTable(title.toLowerCase() + '-table', p, r, true));
    div.appendChild(wrap);
    return div;
}

// Creates the auto-computed Need Matrix panel displaying Maximum minus Allocation for each process
function createNeedPanel(p, r) {
    let div = document.createElement('div'); div.className = 'need-card'; div.id = 'need-section';
    let hdr = document.createElement('div'); hdr.className = 'matrix-header';
    let badge = document.createElement('span'); badge.className = 'matrix-badge badge-need'; badge.innerText = 'Need Matrix';
    let auto = document.createElement('span'); auto.className = 'matrix-auto-tag'; auto.innerText = 'AUTO-COMPUTED';
    hdr.appendChild(badge); hdr.appendChild(auto); div.appendChild(hdr);
    let pill = document.createElement('div'); pill.className = 'formula-pill';
    pill.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>Need = Maximum − Allocation`;
    div.appendChild(pill);
    let wrap = document.createElement('div'); wrap.className = 'tbl-wrap';
    wrap.appendChild(buildMatrixTable('need-table', p, r, false));
    div.appendChild(wrap);
    return div;
}

// Creates the Available Resources card with individual number inputs for each resource
function createAvailCard(r) {
    let div = document.createElement('div'); div.className = 'avail-card'; div.id = 'available-section';
    let hdr = document.createElement('div'); hdr.className = 'matrix-header';
    let badge = document.createElement('span'); badge.className = 'matrix-badge badge-avail'; badge.innerText = 'Available Resources';
    let desc = document.createElement('span'); desc.className = 'matrix-desc'; desc.innerText = 'Free resources in the system';
    hdr.appendChild(badge); hdr.appendChild(desc); div.appendChild(hdr);
    let wrap = document.createElement('div'); wrap.className = 'avail-inputs';
    for (let i = 0; i < r; i++) {
        let g = document.createElement('div'); g.className = 'avail-group';
        let l = document.createElement('span'); l.className = 'avail-rlabel'; l.innerText = 'R' + i;
        let inp = document.createElement('input'); inp.type = 'number'; inp.min = '0'; inp.value = '0'; inp.className = 'avail-input';
        g.appendChild(l); g.appendChild(inp); wrap.appendChild(g);
    }
    div.appendChild(wrap);
    return div;
}

// Recalculates the Need Matrix as Maximum minus Allocation and highlights invalid cells in red
function updateNeedMatrix() {
    let at = document.getElementById('allocation-table');
    let mt = document.getElementById('maximum-table');
    let nt = document.getElementById('need-table');
    if (!at || !mt || !nt) return;
    let aInputs = at.querySelectorAll('input');
    let mInputs = mt.querySelectorAll('input');
    let nInputs = nt.querySelectorAll('input');
    let isValid = true;
    for (let i = 0; i < nInputs.length; i++) {
        let alloc = parseInt(aInputs[i].value);
        let max = parseInt(mInputs[i].value);
        if (isNaN(alloc) || isNaN(max) || alloc < 0 || max < 0) { isValid = false; }
        let need = max - alloc;
        nInputs[i].value = need;
        if (need < 0) {
            isValid = false;
            aInputs[i].style.border = "2px solid red";
            mInputs[i].style.border = "2px solid red";
            nInputs[i].style.border = "2px solid red";
            nInputs[i].style.background = "#ffe5e5";
        } else {
            // BUG 4 FIX: removed incorrect green background; just reset styles
            aInputs[i].style.border = "";
            mInputs[i].style.border = "";
            nInputs[i].style.border = "";
            nInputs[i].style.background = "";
        }
    }
    toggleSimulationButtons(isValid);
}

// Enables or disables simulation buttons based on whether matrix inputs are valid
function toggleSimulationButtons(isValid) {
    let runBtn = document.getElementById('runBtn');
    let reqBtn = document.querySelector('#req-card button');
    if (!isValid) {
        runBtn.disabled = true;
        if (reqBtn) reqBtn.disabled = true;
        showStatus("❌ Invalid input: Allocation cannot exceed Maximum", false);
    } else {
        runBtn.disabled = false;
        if (reqBtn) reqBtn.disabled = false;
        clearStatus();
    }
}

// Displays a success or error status message in the status box
function showStatus(msg, ok) {
    let b = document.getElementById('statusBox');
    b.innerText = msg;
    b.classList.remove('status-success', 'status-error');
    b.classList.add(ok ? 'status-success' : 'status-error');
}

// Clears the status box message and removes any status styling
function clearStatus() {
    let b = document.getElementById('statusBox');
    b.innerText = '';
    b.classList.remove('status-success', 'status-error');
}

// Populates the process dropdown and request input fields based on process and resource count
function generateRequestSection(p, r) {
    let sel = document.getElementById('processSelect'); sel.innerHTML = '';
    for (let i = 0; i < p; i++) {
        let o = document.createElement('option'); o.value = i; o.innerText = 'P' + i; sel.appendChild(o);
    }
    let rd = document.getElementById('requestInputs'); rd.innerHTML = '';
    for (let i = 0; i < r; i++) {
        let inp = document.createElement('input'); inp.type = 'number'; inp.min = '0'; inp.value = '0'; rd.appendChild(inp);
    }
}

// Reads a matrix table by ID and returns its values as a 2D array
function getMatrix(id) {
    let t = document.getElementById(id), m = [];
    for (let i = 0; i < t.tBodies[0].rows.length; i++) {
        let row = [], cells = t.tBodies[0].rows[i].cells;
        for (let j = 1; j < cells.length; j++) row.push(parseInt(cells[j].children[0].value) || 0);
        m.push(row);
    }
    return m;
}

// Returns the current available resources as an array from the available inputs
function getAvailable() {
    return Array.from(document.querySelectorAll('#available-section .avail-input')).map(i => parseInt(i.value) || 0);
}

// Validates and processes a resource request using the Banker's Algorithm safety check
function handleRequest() {
    let pi = parseInt(document.getElementById('processSelect').value);
    let allocBefore = getMatrix('allocation-table'), max = getMatrix('maximum-table'), availBefore = getAvailable();
    let req = Array.from(document.querySelectorAll('#requestInputs input')).map(i => parseInt(i.value) || 0);
    let p = allocBefore.length, r = availBefore.length;
    let needBefore = allocBefore.map((row, i) => row.map((v, j) => max[i][j] - v));
    let alloc = allocBefore.map(r => [...r]);
    let avail = [...availBefore];
    let need  = needBefore.map(r => [...r]);
    for (let j = 0; j < r; j++) { if (req[j] > need[pi][j]) { showStatus('✕  Request exceeds process need!', false); return; } }
    for (let j = 0; j < r; j++) { if (req[j] > avail[j])    { showStatus('✕  Not enough available resources!', false); return; } }
    for (let j = 0; j < r; j++) { avail[j] -= req[j]; alloc[pi][j] += req[j]; need[pi][j] -= req[j]; }
    let needAfter = alloc.map((row, i) => row.map((v, j) => max[i][j] - v));
    if (checkSafety(alloc, need, avail)) {
        showStatus('✓  Request GRANTED — system remains safe.', true);
        renderDiff(pi, allocBefore, alloc, needBefore, needAfter, availBefore, avail);
    } else {
        showStatus('✕  Request DENIED — system would become unsafe.', false);
        renderDiff(pi, allocBefore, alloc, needBefore, needAfter, availBefore, avail, true);
    }
}

// Renders a visual diff panel showing matrix and available resource changes after a resource request
function renderDiff(pi, allocBefore, allocAfter, needBefore, needAfter, availBefore, availAfter, denied = false) {
    let p = allocBefore.length, r = availBefore.length;
    let panel = document.getElementById('diffPanel');
    panel.style.display = 'block';
    panel.innerHTML = '';
    let inner = document.createElement('div'); inner.className = 'diff-panel';
    let header = document.createElement('div'); header.className = 'diff-header';
    let title = document.createElement('div');
    title.className = 'card-title';
    title.style.cssText = 'margin:0;padding:0;border:none;';
    title.innerHTML = `<span class="card-title-dot"></span>Matrix Changes After Request`;
    let legend = document.createElement('div'); legend.className = 'diff-legend';
    legend.innerHTML = `
        <div class="legend-item"><span class="legend-dot legend-green"></span>Increased</div>
        <div class="legend-item"><span class="legend-dot legend-red"></span>Decreased</div>
        <div class="legend-item"><span class="legend-dot legend-same"></span>Unchanged</div>`;
    header.appendChild(title); header.appendChild(legend);
    inner.appendChild(header);
    let tag = document.createElement('div'); tag.className = 'diff-process-tag';
    tag.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>Process P${pi} ${denied ? '(DENIED — preview only)' : '— Changes Applied'}`;
    inner.appendChild(tag);
    let container = document.createElement('div'); container.className = 'diff-matrices';
    inner.appendChild(container);
    const matrices = [
        { title: 'Allocation', before: allocBefore, after: allocAfter },
        { title: 'Maximum',    before: allocBefore.map((row, i) => row.map((v, j) => v + needBefore[i][j])),
                               after:  allocAfter.map((row, i)  => row.map((v, j) => v + needAfter[i][j])) },
        { title: 'Need',       before: needBefore,  after: needAfter },
    ];
    matrices.forEach(m => {
        let hasChanges = m.before.some((row, i) => row.some((v, j) => v !== m.after[i][j]));
        let card = document.createElement('div');
        card.className = 'diff-matrix-card' + (hasChanges ? ' has-changes' : '');
        let titleEl = document.createElement('div'); titleEl.className = 'diff-matrix-title';
        titleEl.innerText = m.title; card.appendChild(titleEl);
        let table = document.createElement('table'); table.className = 'diff-table';
        let thead = document.createElement('thead');
        let hr = document.createElement('tr');
        let eth = document.createElement('th'); hr.appendChild(eth);
        for (let j = 0; j < r; j++) { let th = document.createElement('th'); th.innerText = 'R' + j; hr.appendChild(th); }
        thead.appendChild(hr); table.appendChild(thead);
        let tbody = document.createElement('tbody');
        for (let i = 0; i < p; i++) {
            let row = document.createElement('tr');
            let ltd = document.createElement('td'); ltd.className = 'diff-row-lbl'; ltd.innerText = 'P' + i; row.appendChild(ltd);
            for (let j = 0; j < r; j++) {
                let td = document.createElement('td'); td.className = 'diff-cell';
                let bv = m.before[i][j], av = m.after[i][j];
                let changed = bv !== av;
                let valDiv = document.createElement('div');
                valDiv.className = 'diff-val' + (!changed ? ' unchanged' : (av > bv ? ' changed-up' : ' changed-down'));
                if (changed) {
                    let os = document.createElement('span'); os.className = 'old-val'; os.innerText = bv;
                    let ns = document.createElement('span'); ns.className = 'new-val'; ns.innerText = av;
                    valDiv.appendChild(os); valDiv.appendChild(ns);
                } else {
                    let ns = document.createElement('span'); ns.className = 'new-val'; ns.innerText = av;
                    valDiv.appendChild(ns);
                }
                td.appendChild(valDiv); row.appendChild(td);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody); card.appendChild(table);
        container.appendChild(card);
    });
    let availHdr = document.createElement('div');
    availHdr.style.cssText = 'width:100%;font-family:var(--f-mono);font-size:9px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:var(--ink3);margin-bottom:4px;margin-top:12px;';
    availHdr.innerText = 'Available Resources';
    inner.appendChild(availHdr);
    let availContainer = document.createElement('div'); availContainer.className = 'avail-diff-row';
    for (let j = 0; j < r; j++) {
        let bv = availBefore[j], av = availAfter[j];
        let changed = bv !== av;
        let chip = document.createElement('div'); chip.className = 'avail-diff-chip';
        let lbl = document.createElement('span'); lbl.className = 'avail-diff-label'; lbl.innerText = 'R' + j;
        let val = document.createElement('div');
        val.className = 'avail-diff-val' + (!changed ? ' unchanged' : (av > bv ? ' changed-up' : ' changed-down'));
        if (changed) {
            let os = document.createElement('span'); os.className = 'old-val'; os.innerText = bv;
            let ns = document.createElement('span'); ns.className = 'new-val'; ns.innerText = av;
            val.appendChild(os); val.appendChild(ns);
        } else {
            let ns = document.createElement('span'); ns.className = 'new-val'; ns.innerText = av;
            val.appendChild(ns);
        }
        chip.appendChild(lbl); chip.appendChild(val);
        availContainer.appendChild(chip);
    }
    inner.appendChild(availContainer);
    panel.appendChild(inner);
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
