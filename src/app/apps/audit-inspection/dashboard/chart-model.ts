export interface ChartType {
    chart?: any;
    countVal?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    fill?: any;
    dataLabels?: any;
    legend?: any;
    xaxis?: any;
    yaxis?: any;
    stroke?: any;
    labels?: any;
    markers?: any;
    tooltip?: any;
    responsive?: any;

}

const markChart: ChartType = {
    series: [0,0,0,0],
    chart: {
        type: 'donut',
        height: 240,
    },
    labels: ['Mark-0', 'Mark-1','Mark-2','Mark-3'],

    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
            }
        }
    }
};

const divisionChart:ChartType = {
    series: [],
    chart: {
      type: "bar",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: "$ (thousands)"
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val:any) {
          return "$ " + val + " thousands";
        }
      }
    }
  };

  const monthlyScoreChart: ChartType = {
    series: [{
      name: 'Score',
      data: [0, 0, 0, 0, 0, 0, 0,0,0,0,0, 0]
    }],
    chart: {
      height: 288,
      type: 'line',
      toolbar: 'false',
      dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 8,
          opacity: 0.2
      },
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#556ee6'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    }
  };

  const radialChart: ChartType = {
    series: [0],
    chart: {
        type: 'radialBar',
        width: 60,
        height: 60,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ["#EA3C53"],
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: true,
                name: {
                    offsetY: -50,
                    show: true,
                    color: "#888",
                    fontSize: "10px",

                },
                value: {
                    formatter: function (val: any) {
                        return parseInt(val.toString(), 10).toString() + '%';
                    },
                    color: "#111",
                    fontSize: "12px",
                    show: true,
                    offsetY: -10,
                }
            }
        }
    },
    labels: [""]
}

const auditChart: ChartType = {
  series: [70],
  chart: {
      height: 350,
      type: "radialBar"
  },
  plotOptions: {
      radialBar: {
          hollow: {
              size: "70%"
          }
      }
  },
  labels: ["Completed"]
}

const externalMonthlyChart: ChartType = {

    series: [
    ],
    chart: {
      type: "bar",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct"
      ]
    },
    yaxis: {
      title: { 
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
         
      }
    }
  
}


export { markChart,divisionChart,monthlyScoreChart,radialChart,auditChart,externalMonthlyChart }