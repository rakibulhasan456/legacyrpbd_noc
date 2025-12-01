/****************************************************************************
 * IMPORTANT:
 * - Replace placeholder paths under `users` with your actual PNG signatures.
 * - Replace assets/watermark.png and assets/seal.png with the PNGs you will upload.
 * - This is a frontend-only app (no backend). Credentials are stored in the file.
 ****************************************************************************/

// --- Hardcoded credentials (max 5) ---
const users = {
    "demo":{
        password:"demo123",
        fullName:"Your Name",
        designation:"Your Designation",
        signature:"assets/img/sign_placeholder.png"
    },
    "onizuka":{
        password:"onizuka456",
        fullName:"Ryuujin Onizuka",
        designation:"Governor",
        signature:"assets/img/sign_ryuujin.png"
    },
    "ishid":{
        password:"33vDtkg",
        fullName:"Ishid Lucrenze",
        designation:"Vice Governor",
        signature:"assets/img/sign_ishid.png"
    }
};

// DOM refs
const loginPanel = document.getElementById('loginPanel');
const formPanel = document.getElementById('formPanel');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const fillDemo = document.getElementById('fillDemo');
const loggedAs = document.getElementById('loggedAs');

const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');

let currentUserKey = null; // store logged in user key

function showPanel(){
    loginPanel.classList.add('hidden');
    formPanel.classList.remove('hidden');
}

function showLogin(){
    loginPanel.classList.remove('hidden');
    formPanel.classList.add('hidden');
    loggedAs.textContent = 'Not logged in';
    currentUserKey = null;
    // clear fields
    usernameEl.value = '';
    passwordEl.value = '';
}

// demo fill
fillDemo.addEventListener('click',()=>{
    usernameEl.value = 'demo';
    passwordEl.value = 'demo123';
});

loginBtn.addEventListener('click',()=>{
    const u = usernameEl.value.trim();
    const p = passwordEl.value;
    if(!u||!p){alert('Enter username and password');return}
    if(!users[u]||users[u].password!==p){alert('Invalid credentials');return}
    // success
    currentUserKey = u;
    const udata = users[u];
    loggedAs.textContent = `Logged as ${udata.fullName}`;
    // set issuer info in preview
    document.getElementById('issuerName').textContent = udata.fullName;
    document.getElementById('issuerDesignation').textContent = udata.designation;
    document.getElementById('signatureImg').src = udata.signature;
    // show user in top-right
    document.getElementById('loggedAs').textContent = udata.fullName;
    showPanel();
});

logoutBtn.addEventListener('click',()=>{
    showLogin();
});

// Update preview with form data
document.getElementById('updatePreview').addEventListener('click',updatePreview);

function formatDateISOToDMY(iso){
    if(!iso) return '[DD/MM/YYYY]';
    const d = new Date(iso);
    if(isNaN(d)) return '[DD/MM/YYYY]';
    // Use UTC date methods to avoid timezone issues when parsing simple date strings
    const dd = String(d.getUTCDate()).padStart(2,'0');
    const mm = String(d.getUTCMonth()+1).padStart(2,'0');
    const yy = d.getUTCFullYear();
    return `${dd}/${mm}/${yy}`;
}

function updatePreview(){
    const date = document.getElementById('nocDate').value;
    const fullName = document.getElementById('fullName').value || '[Full Name]';
    const cid = document.getElementById('cid').value || '[CID]';
    const contact = document.getElementById('contact').value || '[Contact]';
    const dob = document.getElementById('dob').value;
    const address = document.getElementById('address').value || '[Address]';

    // purposes
    const checked = Array.from(document.querySelectorAll('.purposeChk:checked')).map(n=>n.value);
    const purposes = checked.length?checked.join(', '):'[Purposes]';

    document.getElementById('pvDate').textContent = formatDateISOToDMY(date);
    document.getElementById('pvName').textContent = fullName;
    document.getElementById('pvCID').textContent = cid;
    document.getElementById('pvContact').textContent = contact;
    document.getElementById('pvDOB').textContent = formatDateISOToDMY(dob);
    document.getElementById('pvAddress').textContent = address;
    document.getElementById('pvPurposes').textContent = purposes;

    // update issuer details (in case they changed)
    if(currentUserKey){
        const u = users[currentUserKey];
        document.getElementById('issuerName').textContent = u.fullName;
        document.getElementById('issuerDesignation').textContent = u.designation;
        document.getElementById('signatureImg').src = u.signature;
    }

}

// Download preview as PNG
document.getElementById('downloadPNG').addEventListener('click',()=>{
    // ensure preview up-to-date
    updatePreview();

    const container = document.getElementById('nocContainer');
    // temporarily increase background to white for clear capture
    const origBg = container.style.background;
    container.style.background = '#fff';

    // The scale property is crucial for getting a high-resolution, readable image
    html2canvas(container, {scale:1, useCORS:true, allowTaint:true}).then(canvas=>{
        const link = document.createElement('a');
        link.download = `NOC_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        container.style.background = origBg;
    }).catch(err=>{
        alert('Export failed. Check console for details.');
        console.error(err);
        container.style.background = origBg;
    });
});

// Auto-set today's date in the form
document.getElementById('nocDate').valueAsDate = new Date();

// initialize as login visible
showLogin();

// Accessibility: allow Enter key on password to login
passwordEl.addEventListener('keyup',(e)=>{if(e.key==='Enter')loginBtn.click()});

// Set default preview on load
updatePreview();