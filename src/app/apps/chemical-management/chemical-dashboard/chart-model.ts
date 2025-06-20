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
    title?:any;

}

const msdsChemical: ChartType = {
    series: [0],
      chart: {
        height: 450,
        type: "radialBar",
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 120
            },
            value: {
              offsetY: 76,
              fontSize: "22px",
              color: undefined,
              formatter: function(val:any) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        }
      },
      stroke: {
        dashArray: 4
      },
      labels: ["Valid MSDS"]
}

const chemicalUsageCard:ChartType={
  series: [
      {
        name: "Delivered",
        type: "column",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: "Issued",
        type: "line",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ],
    chart: {
      height: 450,
      type: "line"
    },
    stroke: {
      width: [0, 4]
    },
    title: {
      text: "Traffic Sources"
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ],
 
    yaxis: [
      {
        title: {
          text: "Delivered"
        }
      },
      {
        opposite: true,
        title: {
          text: "Issued"
        }
      }
    ]
}

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

export {msdsChemical,chemicalUsageCard,radialChart }