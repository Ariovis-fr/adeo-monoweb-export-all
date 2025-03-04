// Inject button
const onExportAll = () => {
  // disable button
  const btn = document.getElementById('export-all-btn')
  btn.disabled = true
  btn.innerText = 'Exporting...'
  btn.classList.add('disabled')

  // get min & max date
  const minDate = document.getElementById('dateDu-xs').value 
  const maxDate = document.getElementById('dateAu-xs').value

  // send message to background
  chrome.runtime.sendMessage({
    type: 'exportAll',
    minDate,
    maxDate
  })
}

// on document load. Too lazy to use a proper hook
setInterval(() => {
  if (document.getElementById('export-all-btn')) return
  if (!document.getElementsByClassName('filters')[0]) return

  const button = document.createElement('button')
  button.className = 'btn btn-primary btn-md btn-block text-uppercase'
  button.id = "export-all-btn"
  button.innerText = 'Export all'
  button.onclick = onExportAll
  button.style = "margin-top: 12px;"
  document.getElementsByClassName('filters')[0].appendChild(button)
}, 1000)
