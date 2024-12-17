async function fetchUsers() {
  const url = 'https://13.60.73.151:8000/api/guests'
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')
      const users = await response.json()
      document.getElementById('count').innerText = users.length 
    return users
  } catch (error) {
    console.error('Error fetching users:', error.message)
    return []
  }
}

function filterUsers(users, query, filterKey) {
  let filtered = users

  if (filterKey === 'confirmed-true') {
    filtered = filtered.filter(user => user.confirmed === true)
  } else if (filterKey === 'confirmed-false') {
    filtered = filtered.filter(user => user.confirmed === false)
  } else if (filterKey === 'is_plus_one-true') {
    filtered = filtered.filter(user => user.is_plus_one === true)
  } else if (filterKey === 'is_plus_one-false') {
    filtered = filtered.filter(user => user.is_plus_one === false)
  }

  if (query) {
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  return filtered
}

function displayUsers(users) {
  const root = document.getElementById('root')
  root.innerHTML = ''
  if (users.length === 0) {
    root.innerHTML = '<p>No users found</p>'
    return
  }

  const div = document.createElement('div')
  div.classList.add('grid')
  users.forEach(user => {
    const section = document.createElement('section')
    section.innerHTML = `<h3>${user.name}</h3> <div class="ellipsis"></div> <p>${user.phone_number}</p>`
    div.appendChild(section)
  })

  root.appendChild(div)
}

async function main() {
  const users = await fetchUsers()
  displayUsers(users)

  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Search users by name...'

  const select = document.createElement('select')
  const options = [
    { value: '', text: 'All Users' },
    { value: 'confirmed-true', text: 'Подтвержденный' },
    { value: 'confirmed-false', text: 'Не подтвержденный' },
    { value: 'is_plus_one-true', text: 'плюс один' },
    { value: 'is_plus_one-false', text: 'не плюс один' },
  ]

  options.forEach(option => {
    const opt = document.createElement('option')
    opt.value = option.value
    opt.textContent = option.text
    select.appendChild(opt)
  })

  const updateDisplay = () => {
    const query = input.value
    const filterKey = select.value
    const filteredUsers = filterUsers(users, query, filterKey)
    displayUsers(filteredUsers)
  }

  input.addEventListener('input', updateDisplay)
  select.addEventListener('change', updateDisplay)

  document.body.insertBefore(input, document.getElementById('root'))
  // document.body.insertBefore(select, document.getElementById('root'))
}

main()


