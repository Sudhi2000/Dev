var curr = new Date()
const monthStart = new Date(curr.getUTCFullYear(), curr.getMonth());
const monthEnd = new Date();
const monthStartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
  monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
  monthStart.toLocaleDateString("en-US", { year: 'numeric' })
const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
  monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
  monthEnd.toLocaleDateString("en-US", { year: 'numeric' })
this.dateRange.controls['start'].setValue(new Date(monthStartDate))
this.dateRange.controls['end'].setValue(new Date(monthEndDate))

const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
lastMonthstart.setDate(lastMonthstart.getDate())
const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
lastMonthEnd.setDate(lastMonthEnd.getDate())
this.prevDateRange.controls['start'].setValue(new Date(lastMonthstart))
this.prevDateRange.controls['end'].setValue(new Date(lastMonthEnd))

var d = new Date(new Date().getFullYear(), 0, 2).toISOString();
var end = new Date(new Date().getFullYear(), 12).toISOString();
const startDate = new Date(d).toISOString()
const endDate = new Date(end).toISOString()
this.yearRange.controls['start'].setValue(startDate)
this.yearRange.controls['end'].setValue(endDate)





month_data() {
    const start = new Date(this.dateRange.value.start)
    start.setDate(start.getDate() + 1)
    const end = new Date(this.dateRange.value.end)
    end.setDate(end.getDate() + 1)
    const startDate = new Date(start).toISOString()
    const endDate = new Date(end).toISOString()
    this.chemicalService.get_chemical_inventory_dash(startDate, endDate).subscribe({
      next: (inventoryResult: any) => {
        this.chemicalService.get_chemical_transaction_dash(startDate, endDate).subscribe({
          next: (transactionResult: any) => {
            this.inventory_data = inventoryResult.data
            this.transactions = transactionResult.data
          },
          error: (err: any) => { },
          complete: () => {
            this.previous_month_data()
          }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })

    // this.chemicalService.get_chemical_inventory_dash(startDate, endDate).subscribe({
    //   next: (result: any) => {
    //     this.chemicalService.get_chemical_inventory_dash(previousStartDate, previousEndDate).subscribe({
    //       next: (previousResult: any) => {
    //         this.chemicalService.get_chemical_transaction_dash(startDate, endDate).subscribe({
    //           next: (resultTransaction: any) => {
    //             this.chemicalService.get_chemical_transaction_dash(previousStartDate, previousEndDate).subscribe({
    //               next: (resultPreviousTransaction: any) => {
    //                 this.chemicalService.get_chemicals_inStock().subscribe({
    //                   next: (stockResult: any) => {
    //                     this.chemicalService.chemical_inventory_count().subscribe({
    //                       next: (chemicalCount: any) => {
    //                         this.chemicalService.get_valid_msds_count().subscribe({
    //                           next: (validMSDS: any) => {
    //                             this.stockData = stockResult.data.length
    //                             this.inventory_data = result.data
    //                             this.previous_inventory_data = previousResult.data
    //                             this.transactions = resultTransaction.data
    //                             this.previous_transactions = resultPreviousTransaction.data
    //                             this.summary_card()
    //                             this.msds_card(chemicalCount, validMSDS)
    //                             // this.chemical_usage_card()
    //                           },
    //                           error: (err: any) => { },
    //                           complete: () => { }
    //                         })

    //                       },
    //                       error: (err: any) => { },
    //                       complete: () => { }
    //                     })

    //                   },
    //                   error: (err: any) => { },
    //                   complete: () => { }
    //                 })


    //               },
    //               error: (err: any) => { },
    //               complete: () => { }
    //             })
    //           },
    //           error: (err: any) => { },
    //           complete: () => { }

    //         })

    //       },
    //       error: (err: any) => { },
    //       complete: () => { }
    //     })

    //   },
    //   error: (err: any) => { },
    //   complete: () => { }
    // })


  }

  previous_month_data() {

    const previousStart = new Date(this.prevDateRange.value.start)
    previousStart.setDate(previousStart.getDate() + 1)
    const previousEnd = new Date(this.prevDateRange.value.end)
    previousEnd.setDate(previousEnd.getDate() + 1)
    const previousStartDate = new Date(previousStart).toISOString()
    const previousEndDate = new Date(previousEnd).toISOString()

    this.chemicalService.get_chemical_inventory_dash(previousStartDate, previousEndDate).subscribe({
      next: (inventoryResult: any) => {
        this.chemicalService.get_chemical_transaction_dash(previousStartDate, previousEndDate).subscribe({
          next: (transactionResult: any) => {
            this.previous_inventory_data = inventoryResult.data
            this.previous_transactions = transactionResult.data

          },
          error: (err: any) => { },
          complete: () => {
            this.summary_card()
            this.get_chemical_count()
          }
        })

      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  get_chemical_count() {
    this.chemicalService.chemical_inventory_count().subscribe({
      next: (result: any) => {
        this.filterForm.controls['chemical_count'].setValue(result)
      },
      error: (err: any) => { },
      complete: () => {
        this.msds_card()
      }
    })


  }

  year_data() {
    const start = new Date(this.yearRange.value.start)
    const end = new Date(this.yearRange.value.end)
    const startDate = new Date(start).toISOString()
    const endDate = new Date(end).toISOString()

    this.chemicalService.get_chemical_inventory_dash(startDate, endDate).subscribe({
      next: (inventoryResult: any) => {
        this.chemicalService.get_chemical_transaction_dash(startDate, endDate).subscribe({
          next: (transactionResult: any) => {
            this.year_inventory_data = inventoryResult.data
            this.year_transaction_data = transactionResult.data
          },
          error: (err: any) => { },
          complete: () => {
            this.chemical_usage_card()
          }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })


    console.log(startDate)
    console.log(endDate)


  }


  startDateChange(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.filterForm.controls['start'].setValue(selecteddate)
  }

  endDateChange(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.filterForm.controls['end'].setValue(selecteddate)
  }

  search() {





  }

  reset() {

  }


  //####### card logics
  summary_card() {
    this.summaryCard = []
    this.delivered_card_data()
    this.issued_card_data()
    this.inStock_card_data()
    this.amount_card_data()
    this.issued_amount_card_data()
  }

  delivered_card_data() {
    const delivered = Number(this.inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0))
    const previousDelivered = Number(this.previous_inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0))
    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (delivered === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Delivered',
        quantity: delivered,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: "box.png"
      })
    } else {
      if (delivered > previousDelivered) {
        const temp_attrition = Number(previousDelivered) / Number(delivered) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Delivered',
          quantity: delivered,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "box.png"

        })
      } else if (delivered < previousDelivered) {
        const temp_attrition = Number(delivered) / Number(previousDelivered) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Delivered',
          quantity: delivered,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "box.png"

        })
      } else if (delivered === previousDelivered) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Delivered',
          quantity: delivered,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "box.png"

        })
      }
    }
  }

  issued_card_data() {
    const issued = Number(this.transactions.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0))
    const previousIssued = Number(this.previous_transactions.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0))
    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (issued === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Issued',
        quantity: issued,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: "issued.png"
      })
    } else {
      if (issued > previousIssued) {
        const temp_attrition = Number(previousIssued) / Number(issued) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Issued',
          quantity: issued,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "issued.png"
        })
      } else if (issued < previousIssued) {
        const temp_attrition = Number(issued) / Number(previousIssued) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Issued',
          quantity: issued,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "issued.png"
        })
      } else if (issued === previousIssued) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Issued',
          quantity: issued,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "issued.png"
        })
      }
    }

  }

  inStock_card_data() {
    const balance = Number(this.inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.balance), 0))
    const previousBalance = Number(this.previous_inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.balance), 0))
    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (balance === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Balance',
        quantity: balance,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'balance.png'
      })
    } else {
      if (balance > previousBalance) {
        const temp_attrition = Number(previousBalance) / Number(balance) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Balance',
          quantity: balance,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'balance.png'
        })
      } else if (balance < previousBalance) {
        const temp_attrition = Number(balance) / Number(previousBalance) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Balance',
          quantity: balance,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'balance.png'
        })
      } else if (balance === previousBalance) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Balance',
          quantity: balance,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'balance.png'
        })
      }
    }
  }

  amount_card_data() {
    const amount = Number(this.inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.purchased_amount), 0))
    const previousAmount = Number(this.previous_inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.purchased_amount), 0))

    const amountVal = this.currencyPipe.transform(amount, this.currency);

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (amount === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Amount',
        quantity: amountVal,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'amount.png'
      })
    } else {
      if (amount > previousAmount) {
        const temp_attrition = Number(previousAmount) / Number(amount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount < previousAmount) {
        const temp_attrition = Number(amount) / Number(previousAmount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount === previousAmount) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      }
    }

  }

  issued_amount_card_data() {
    const amount = Number(this.transactions.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0))
    const previousAmount = Number(this.previous_transactions.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0))
    const amountVal = this.currencyPipe.transform(amount, this.currency);

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (amount === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Issued Amount',
        quantity: amountVal,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'amount.png'
      })
    } else {
      if (amount > previousAmount) {
        const temp_attrition = Number(previousAmount) / Number(amount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Issued Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount < previousAmount) {
        const temp_attrition = Number(amount) / Number(previousAmount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Issued Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount === previousAmount) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Issued Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      }
    }



  }




  msds_card() {
    const total = this.filterForm.value.chemical_count

    this.chemicalService.get_valid_msds_count().subscribe({
      next: (count: any) => {
        this.msdsCard = []
        let percentage = '0'
        if (count > 0) {
          percentage = Math.round(count / total * 100).toFixed(0)
        }
        this.msdsCardChart.series = [percentage]



        if (count === 0) {
          this.msdsCard.push({
            quantity: 0,
            Attrition: '0%',
            Attrition_bg: 'text-success'
          })
        } else {
          if (count > total) {
            const attrition = Number(total) / Number(count) * 100
            const value = JSON.stringify(attrition.toFixed(0) + ' %')
            this.msdsCard.push({
              quantity: count,
              Attrition_icon: 'icon-arrow-up',
              Attrition: value.replace(/['"]+/g, ''),
              Attrition_bg: 'text-danger'
            })
          } else if (count < total) {
            const attrition = Number(count) / Number(total) * 100
            const value = JSON.stringify(attrition.toFixed(0) + ' %')
            this.msdsCard.push({
              quantity: count,
              Attrition_icon: 'icon-arrow-down',
              Attrition: value.replace(/['"]+/g, ''),
              Attrition_bg: 'text-success'
            })
          } else if (count === total) {
            this.msdsCard.push({
              quantity: count,
              Attrition: '0%',
              Attrition_bg: 'text-success'
            })
          }
        }

      },
      error: (err: any) => { },
      complete: () => { }
    })

























  }

  chemical_usage_card() {
    let deliveredData:any[]=[]
    let issuedData:any[]=[]
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    months.forEach(inventoryElem => {

      const inventoryData = this.year_inventory_data.filter(function(elem){
        return (moment(elem.attributes.delivery_date).month() == inventoryElem)
      })
      const delivered = inventoryData.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0)
      deliveredData.push(delivered)

      const transactionData = this.year_transaction_data.filter(function(elem){
        return (moment(elem.attributes.transaction_date).month() == inventoryElem)
      })

      const issued = transactionData.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0)
      issuedData.push(issued)
    })

    console.log(deliveredData)
    console.log(issuedData)

    this.ChemicalUsageCard.series = [
      {
        name: "Delivered",
        type: "column",
        data: deliveredData
      },
      {
        name: "Issued",
        type: "line",
        data: issuedData
      }
    ]



  }


