import argsParser from 'args-parser'

export interface DashboardResult {
  Solde: number
  DateDernierPassage: string
  Tickets: Tickets
  CGVValidees: boolean
  Versements: Versements
  Messages: any[]
  ImmediateShowMessage: boolean
  SubModels: SubModels
  Id: number
}

export interface Tickets {
  Delta: boolean
  List: Ticket[]
}

export interface Ticket {
  IdTicket: number
  IdCommande: number
  IdCompte: number
  DateTicket: string
  Activite: string
  AncienSolde: number
  NouveauSolde: number
  TotalFinancier: number
  TotalTTC: number
  TotalPlateau: number
}

export interface Versements {
  Delta: boolean
  List: List2[]
}

export interface List2 {
  Id: number
  DateCreation: string
  DateReponse: string
  Montant: number
  EtatTransaction: number
  Enregistre: boolean
  ConfirmationEnAttente: boolean
  CleConfirmation: any
}

export interface SubModels {
  Asa: Asa
  Reservation: Reservation
}

export interface Asa {
  Pictures: Record<string, string>
}

export interface Reservation {
  NombreReservations: number
}

const getTickets = async ({
  minDate,
  maxDate,  
}: {
  minDate: Date,
  maxDate: Date,
}): Promise<Ticket[]> => {
  const data:DashboardResult = await fetch("https://adeo.moneweb.fr/clients/api/compte/dashboard", {
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
      "cookie": "[COOKIE]",
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

const main = async () => {
  // @ts-ignore
  const args = argsParser(process.argv)

  if(args.h) {
    console.log('Exports all tickets in a given date range as PDF documents in a folder')
    console.log('Usage: index.js [options]')
    console.log('Options:')
    console.log('  --min-date=2025-01-01 - Minimum date (optional)')
    console.log('  --max-date=2025-12-31 - Maximum date (optional)')
    console.log('  -o, --output=folder - Output folder')
    
    return
  }
  
  console.log(args)

  const tickets = await getTickets({
    minDate: args.minDate ? new Date(args.minDate) : new Date(0),
    maxDate: args.maxDate ? new Date(args.maxDate) : new Date('2099-12-31')
  })

  console.log(tickets)
}

main()  