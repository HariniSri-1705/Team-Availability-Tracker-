async function fetchUsers() {
  const res = await fetch('/api/users');
  const data = await res.json();
  return data.users;
}

function createRow(user) {
  const row = document.createElement('div');
  row.className = 'row' + (user.available ? ' available-row' : '');
  row.setAttribute('role', 'listitem');

  const left = document.createElement('div');
  left.className = 'user';
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = user.name;
  const role = document.createElement('div');
  role.className = 'role';
  role.textContent = user.role;
  left.appendChild(name);
  left.appendChild(role);

  const right = document.createElement('div');
  right.className = 'status';

  const pill = document.createElement('div');
  pill.className = 'pill ' + (user.available ? 'available' : 'busy');
  const dot = document.createElement('span');
  dot.className = 'dot';
  const label = document.createElement('span');
  label.textContent = user.available ? 'AVAILABLE' : 'BUSY';
  pill.appendChild(dot);
  pill.appendChild(label);

  const btn = document.createElement('button');
  btn.className = 'toggle-btn';
  btn.textContent = user.available ? 'Set Busy' : 'Set Available';
  btn.setAttribute('aria-pressed', String(user.available));
  btn.setAttribute('aria-label', `Toggle availability for ${user.name}`);
  btn.onclick = async () => {
    btn.disabled = true;
    try {
      const res = await fetch(`/api/users/${user.id}/toggle`, { method: 'POST' });
      const data = await res.json();
      updateRow(row, data.user);
      user.available = data.user.available;
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    } finally {
      btn.disabled = false;
    }
  };

  right.appendChild(pill);
  right.appendChild(btn);

  row.appendChild(left);
  row.appendChild(right);
  return row;
}

function updateRow(row, user) {
  const label = row.querySelector('.pill span:last-child');
  const dot = row.querySelector('.pill .dot');
  const pill = row.querySelector('.pill');
  const btn = row.querySelector('.toggle-btn');
  label.textContent = user.available ? 'AVAILABLE' : 'BUSY';
  pill.className = 'pill ' + (user.available ? 'available' : 'busy');
  btn.textContent = user.available ? 'Set Busy' : 'Set Available';
  btn.setAttribute('aria-pressed', String(user.available));
  if (user.available) row.classList.add('available-row'); else row.classList.remove('available-row');
}

async function init() {
  const container = document.getElementById('list');
  container.innerHTML = '';
  const users = await fetchUsers();
  for (const u of users) {
    container.appendChild(createRow(u));
  }
}

window.addEventListener('DOMContentLoaded', init);
