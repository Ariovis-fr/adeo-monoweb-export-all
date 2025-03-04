
const getCookies = async () => {
  return browser.cookies.getAll({url: "https://adeo.moneweb.fr"})
    .then((cookies) => {
      let fullCookieString = cookies.map(cookie => 
        `${cookie.name}=${cookie.value}`).join('; ');
      return fullCookieString
    });
}  

const getTickets = async ({
  minDate,
  maxDate,  
  cookie,
}) => {
  const data = await fetch("https://adeo.moneweb.fr/clients/api/compte/dashboard", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-jes-accept-notification": "1",
      "cookie": cookie,
      "Referer": "https://adeo.moneweb.fr/clients",
      "Referrer-Policy": "same-origin"
    },
    "body": "{\"LastTicketInstant\":null,\"LastVersementInstant\":null}",
    "method": "POST"
  }).then(a => a.json())

  const tickets = data.Tickets.List.filter(ticket => {
    const date = new Date(ticket.DateTicket)
    return date >= minDate && date <= maxDate
  })

  return tickets
}

const downloadPdf = async (id, name, cookie) => {
  const data = await fetch("https://adeo.moneweb.fr/clients/api/ticket/print/" + id, {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-jes-accept-notification": "1",
      "cookie": cookie,
      "Referer": "https://adeo.moneweb.fr/clients",
      "Referrer-Policy": "same-origin"
    },
    "referrer": "https://adeo.moneweb.fr/clients",
    "method": "POST",
    "mode": "cors"
  })

  // base 64 to pdf
  const blob = await data.blob()

  // download
  browser.downloads.download({
    url: URL.createObjectURL(blob),
    filename: name + '.pdf',
    saveAs: false
  })
}

const main = async ({
  minDate,
  maxDate
}) => {
  console.log('start')

  const cookies = await getCookies()
  console.log('got cookie')
  
  let tickets = await getTickets({
    minDate: new Date(minDate),
    maxDate: new Date(maxDate),
    cookie: cookies
  })
  console.log('got tickets (', tickets.length, ')')

  tickets.forEach(async ticket => {
    await downloadPdf(ticket.IdTicket, ticket.Activite + '_' + ticket.IdTicket, cookies)
  })

  console.log('all done')
}

// wait for content script message
browser.runtime.onMessage.addListener(async (message) => {
  if (message?.type === 'exportAll') {
    console.log(message)
    await main({
      minDate: message.minDate,
      maxDate: message.maxDate
    })
  }
})

