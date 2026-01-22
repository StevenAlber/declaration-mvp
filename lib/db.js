import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DECLARATIONS_FILE = path.join(DATA_DIR, 'declarations.json');

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DECLARATIONS_FILE)) {
    fs.writeFileSync(DECLARATIONS_FILE, JSON.stringify({ declarations: [] }, null, 2));
  }
}

// Generate unique ID
function generateId() {
  return 'DEC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Get all declarations
export function getAllDeclarations() {
  ensureDataFile();
  const data = JSON.parse(fs.readFileSync(DECLARATIONS_FILE, 'utf-8'));
  return data.declarations;
}

// Get public declarations only
export function getPublicDeclarations() {
  const all = getAllDeclarations();
  return all
    .filter(d => d.publicOptIn && d.status === 'completed')
    .map(d => ({
      displayName: d.displayName || 'Anonymous',
      country: d.country || null,
      date: d.createdAt,
      tier: d.tier
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Add new declaration
export function addDeclaration(data) {
  ensureDataFile();
  const fileData = JSON.parse(fs.readFileSync(DECLARATIONS_FILE, 'utf-8'));
  
  const declaration = {
    id: generateId(),
    email: data.email,
    displayName: data.displayName || null,
    country: data.country || null,
    tier: data.tier,
    amount: data.amount,
    publicOptIn: data.publicOptIn || false,
    stripeSessionId: data.stripeSessionId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  fileData.declarations.push(declaration);
  fs.writeFileSync(DECLARATIONS_FILE, JSON.stringify(fileData, null, 2));
  
  return declaration;
}

// Update declaration status
export function updateDeclarationStatus(stripeSessionId, status) {
  ensureDataFile();
  const fileData = JSON.parse(fs.readFileSync(DECLARATIONS_FILE, 'utf-8'));
  
  const index = fileData.declarations.findIndex(d => d.stripeSessionId === stripeSessionId);
  if (index !== -1) {
    fileData.declarations[index].status = status;
    fileData.declarations[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(DECLARATIONS_FILE, JSON.stringify(fileData, null, 2));
    return fileData.declarations[index];
  }
  return null;
}

// Get declaration by session ID
export function getDeclarationBySessionId(stripeSessionId) {
  const all = getAllDeclarations();
  return all.find(d => d.stripeSessionId === stripeSessionId) || null;
}

// Get declaration by ID
export function getDeclarationById(id) {
  const all = getAllDeclarations();
  return all.find(d => d.id === id) || null;
}

// Update declaration public opt-in
export function updatePublicOptIn(id, publicOptIn, displayName, country) {
  ensureDataFile();
  const fileData = JSON.parse(fs.readFileSync(DECLARATIONS_FILE, 'utf-8'));
  
  const index = fileData.declarations.findIndex(d => d.id === id);
  if (index !== -1) {
    fileData.declarations[index].publicOptIn = publicOptIn;
    if (displayName !== undefined) fileData.declarations[index].displayName = displayName;
    if (country !== undefined) fileData.declarations[index].country = country;
    fileData.declarations[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(DECLARATIONS_FILE, JSON.stringify(fileData, null, 2));
    return fileData.declarations[index];
  }
  return null;
}

// Get statistics
export function getStats() {
  const all = getAllDeclarations();
  const completed = all.filter(d => d.status === 'completed');
  
  return {
    total: completed.length,
    byTier: {
      witness: completed.filter(d => d.tier === 'witness').length,
      steward: completed.filter(d => d.tier === 'steward').length,
      founder: completed.filter(d => d.tier === 'founder').length
    },
    public: completed.filter(d => d.publicOptIn).length
  };
}

// Export for admin
export function exportCSV() {
  const all = getAllDeclarations();
  const headers = ['ID', 'Email', 'Display Name', 'Country', 'Tier', 'Amount', 'Public', 'Status', 'Created At'];
  
  const rows = all.map(d => [
    d.id,
    d.email,
    d.displayName || '',
    d.country || '',
    d.tier,
    d.amount,
    d.publicOptIn ? 'Yes' : 'No',
    d.status,
    d.createdAt
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
