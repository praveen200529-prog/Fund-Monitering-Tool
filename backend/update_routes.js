const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = [
  'billing.js', 'expenses.js', 'interestPayments.js', 'investments.js', 
  'loans.js', 'machineUsage.js', 'manpowerUsage.js', 'materialUsage.js', 
  'projectProgress.js', 'projectTeam.js'
];

files.forEach(file => {
  const p = path.join(routesDir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  // Replace the exact JOIN structure to inject the AND condition
  content = content.replace(/JOIN projects p ON ([a-zA-Z_]+)\.project_id = p\.project_id/g, 'JOIN projects p ON $1.project_id = p.project_id AND p.is_deleted = 0');
  
  fs.writeFileSync(p, content, 'utf-8');
  console.log(`Updated ${file}`);
});
