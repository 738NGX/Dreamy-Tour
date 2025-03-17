import { Reporter } from '../../../utils/reporter';
import { Tour } from '../../../utils/tour/tour';
import { currencyList } from '../../../utils/tour/expense'
const app = getApp<IAppOption>();

Component({
    behaviors: [],
    pageLifetimes: {
      show() {
        // 页面显示时，刷新组件数据
        this.initReport();
      },
    },
    properties: {

    },
    data: {
        optsInType: {
            legend: {
                show: true,
                position: "right",
                lineHeight: 25
            },
            title: {
                name: "总消费",
                fontSize: 20,
            },
            subtitle: {
                name: "0CNY",
                fontSize: 15,
            },
        },
        optsInTag: {
            color: ["#aaaaaa", "#ff9547", "#ff9eac", "#27c1b7", "#db0839", "#66c0ff", "#c1cad4", "#ffd010", "#c252c6", "#ff6fbe"],
            legend: {
                show: true,
                position: "right",
                lineHeight: 25
            },
            title: {
                name: "",
            },
            subtitle: {
                name: "",
            },
        },
        optsInTransportType: {
            legend: {
                show: true,
                position: "right",
                lineHeight: 25
            },
            title: {
                name: "交通消费",
                fontSize: 20,
            },
            subtitle: {
                name: "0CNY",
                fontSize: 15,
            },
        },
        optsColumn: {
            touchMoveLimit: 24,
            enableScroll: true,
            xAxis: {
                scrollShow: false,
                itemCount: 3
            },
            yAxis: {
                showTitle: true,
                data: [
                    {
                        position: "left",
                        title: "CNY",
                        min: 0,
                    },
                    {
                        position: "right",
                        title: "JPY",
                        min: 0,
                    },
                ]
            },
        },
        currencyList: currencyList,

        canvas2d: 'true',
        selectingTour: false,
        activeCollapses: [[], [], [], [], [], []],
        selectingMarkerId: -1,

        // 数据缓存
        reporter: null as Reporter | null,
        chartDataInType: {},
        chartDataInTag: {},
        chartDataInHotel: {},
        chartDataInMeal: {},
        chartDataInTransportType: {},
        chartDataInTicket: {},
        chartDataInShopping: {},
    },
    lifetimes: {
      created() {
  
      },
      attached() {
        this.setData({
          selectingTour: app.globalData.selectingTour,
        });
        this.initReport();
      },
      ready(){
        
      },
      moved() {
  
      },
      detached() {
  
      },
    },
    methods: {
        onChildPageChange(e: any) {
            this.setData({
                childPage: e.detail.value
            });
        },
        initReport() {
            if (app.globalData.currentTour) {
                const currentTour = new Tour(app.globalData.currentTour);
                const reporter = new Reporter(currentTour);

                const optsInType = this.data.optsInType;
                const optsInTransportType = this.data.optsInTransportType;
                const optsColumn = this.data.optsColumn;
                console.log("optsColumn:",optsColumn)
           
            optsInType.subtitle.name = reporter.expenseCalculator.total.allCurrency + currencyList[reporter.mainCurrency].symbol;
            optsInTransportType.subtitle.name = reporter.expenseCalculator.totalInType[2].allCurrency + currencyList[reporter.mainCurrency].symbol; 
            optsColumn.yAxis.data[0].title = currencyList[reporter.mainCurrency].symbol;
            optsColumn.yAxis.data[1].title = currencyList[reporter.subCurrency].symbol;


                this.setData({
                    reporter: reporter,
                    chartDataInType: reporter.expenseCalculator.getChartDataInType(),
                    optsColumn: optsColumn,
                    optsInType: optsInType,
                    chartDataInTag: reporter.expenseCalculator.getChartDataInTag(),
                    chartDataInHotel: reporter.typeList[0].chartData,
                    chartDataInMeal: reporter.typeList[1].chartData,
                    chartDataInTransportType: reporter.expenseCalculator.getChartDataInTransportType(),
                    chartDataInTicket: reporter.typeList[3].chartData,
                    chartDataInShopping: reporter.typeList[4].chartData,
                    optsInTransportType: optsInTransportType,
                });
            }
            else {
                this.setData({
                    reporter: null,
                    chartDataInType: {},
                    chartDataInTag: {},
                    chartDataInHotel: {},
                    chartDataInMeal: {},
                    chartDataInTransportType: {},
                    chartDataInTicket: {},
                    chartDataInShopping: {},
                });
            }
        },
        handleCollapsesChange(e: any) {
            this.setData({
                activeCollapses: {
                    ...this.data.activeCollapses,
                    [e.currentTarget.dataset.index]: e.detail.value
                }
            });
        },
    },
})
