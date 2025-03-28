/**
 * 行程统计信息
 */
var echarts = require('../../../components/ec-canvas/echarts');
import { ReporterForUser } from '../../../utils/reporterForUser';
import { Tour } from '../../../utils/tour/tour';
import { currencyList } from '../../../utils/tour/expense'
import { displayNumber } from '../../../utils/util';
import { User } from '../../../utils/user/user';

const app = getApp<IAppOption>();

Component({
  behaviors: [],
  lifetimes: {
    created() {

    },
    attached() {
      this.updateData()
    },
    moved() {

    },
    detached() {

    },
  },
  properties: {
    currentTour: {
      // 类型
      type: Object,
      // 默认值
      value: {}
    },
    currentTourCopyIndex: {
      type: Number,
      value: 0,
    }
  },
  observers: {
    'currentTour, currentTourCopyIndex': function (currentTour, currentTourCopyIndex) {
      if (currentTour && currentTourCopyIndex !== undefined) {
        // 参数就绪后执行初始化
        this.init();
      }
    }
  },
  data: {
    //  currentTour : null as Tour | null,

    //  currentTourCopyIndex : 0,
    currentUserId: 0 as number,
    currentUserList: [] as any[],
    selectingUserVisible: false,
    //selectedUserId 默认值为当前用户id
    selectedUserId: -1 as number,
    selectedUserName: '' as string,
    currencyList: currencyList,
    ec: {
      lazyLoad: true
    },
    reporter: null as ReporterForUser | null,

    activeCollapses: [[], [], [], [], [], []],

    chartDataInType: null as [] | null,
    chartDataInBudget: null as [] | null,
    chartDataInTransportType: null as [] | null,

    chartDataInHotel: {},
    chartDataInMeal: {},
    chartDataInTicket: {},
    chartDataInShopping: {},

    totalTransportCurrency: '',
    totalMainCurrency: '',
    totalSubCurrency: '',
    totalCurrency: '',

    isCurrentUserInGroup: false,
  },

  methods: {
    init() {
      this.updateData();
      //console.log("currentUserList",this.data.currentUserList);
      this.initReport(this.properties.currentTour, this.properties.currentTourCopyIndex, this.data.selectedUserId);
      this.initCharts();
    },
    updateData() {
      const currentUserList = app.getUserListCopy()
        .map(user => {
          if (this.properties.currentTour.users.includes(user.id)) return new User(user);
          else return null;
        })
        .filter((user: any) => user !== null)
        .filter((user: any) => user.id !== this.data.currentUserId);

      // 基于计算出的 currentUserList 设置其他字段
      const selectedUserId = this.data.selectedUserId > 0
        ? this.data.selectedUserId
        : (this.properties.currentTour.users.includes(app.globalData.currentUserId)
          ? app.globalData.currentUserId
          : currentUserList[0]?.id);
      //console.log(this.properties.currentTour.users.includes(this.data.currentUserId))
      this.setData({
        currentUserId: app.globalData.currentUserId,
        currentUserName: app.getUser(this.data.currentUserId)?.name,
        isCurrentUserInGroup: this.properties.currentTour.users.includes(this.data.currentUserId),

        currentUserList: currentUserList,
        selectedUserId: selectedUserId,
        selectedUserName: app.getUser(this.data.selectedUserId)?.name,
      })
      //console.log(selectedUserId)
    },
    initCharts() {
      const getPixelRatio = () => {
        let pixelRatio = 0
        wx.getSystemInfo({
          success: function (res) {
            pixelRatio = res.pixelRatio
          },
          fail: function () {
            pixelRatio = 0
          }
        })
        return pixelRatio
      }
      // console.log(pixelRatio)
      var dpr = getPixelRatio()

      const chartInType = this.selectComponent('#chartInType')
      const isDarkMode = wx.getSystemInfoSync().theme == 'dark'
      chartInType.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setChartOptionInType(chart);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })

      const chartInBudget = this.selectComponent('#chartInBudget')
      chartInBudget.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setChartOptionInBudget(chart);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })

      const chartInTransportType = this.selectComponent('#chartInTransportType')
      chartInTransportType.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setChartOptionInTransportType(chart);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })

      const chartInHotel = this.selectComponent('#chartInHotel')
      chartInHotel.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setStatisticChartOption(chart, this.data.chartDataInHotel);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })

      const chartInMeal = this.selectComponent('#chartInMeal')
      chartInMeal.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setStatisticChartOption(chart, this.data.chartDataInMeal);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })

      const chartInTicket = this.selectComponent('#chartInTicket')
      chartInTicket.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setStatisticChartOption(chart, this.data.chartDataInTicket);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })

      const chartInShopping = this.selectComponent('#chartInShopping')
      chartInShopping.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setStatisticChartOption(chart, this.data.chartDataInShopping);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })
    },
    initReport(value: any, copyIndex: number, selectedUserId: number) {
      //  console.log("beforeinitReport",this.properties.currentTour,this.properties.currentTourCopyIndex)
      const currentTour = new Tour(value);

      const reporter = new ReporterForUser(currentTour, copyIndex, selectedUserId);

      const totalTransportCurrency = reporter.expenseCalculator.calculateTotalTransportCurrency()
      this.setData({
        reporter: reporter,
        chartDataInType: reporter.expenseCalculator.getChartDataInType(),
        chartDataInBudget: reporter.expenseCalculator.getChartDataInBudget(currentTour.budgets.map(budget => budget.title)),
        chartDataInTransportType: reporter.expenseCalculator.getChartDataInTransportType(),

        chartDataInHotel: reporter.typeList[0].chartData,
        chartDataInMeal: reporter.typeList[1].chartData,
        chartDataInTicket: reporter.typeList[3].chartData,
        chartDataInShopping: reporter.typeList[4].chartData,

        totalMainCurrency: reporter.expenseCalculator.total.mainCurrency.toFixed(2),
        totalSubCurrency: reporter.expenseCalculator.total.subCurrency.toFixed(2),
        totalCurrency: reporter.expenseCalculator.total.allCurrency.toFixed(2),
        totalTransportCurrency: totalTransportCurrency.toFixed(2),
      })
      //  console.log("chartdatainhotel",this.data.chartDataInHotel)
    },
    onTourUpdate(data: Tour) {
      this.setData({ currentTour: data })
    },
    onCopyChange(index: number) {
      this.setData({ currentTourCopyIndex: index });
    },
    handleCollapsesChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        activeCollapses: {
          ...this.data.activeCollapses,
          [e.currentTarget.dataset.index]: e.detail.value
        }
      });
    },
    handleSelectingUser() {
      this.setData({
        selectingUserVisible: !this.data.selectingUserVisible
      })
    },
    onSelectedUserChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ selectedUserId: value });
      // console.log('新选中 ID:', value, '当前 selectedUserId:', this.data.selectedUserId);
      this.init();
    },


    /**
     * 类型区分饼图设置
     * @param chart 
     */
    setChartOptionInType(chart: any) {
      if (this.data.reporter) {
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          //legend: {
          //  left: 'auto',
          //  top: 'center',
          //  orient: 'hozizonal',
          //  type: 'scroll'
          //},
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: this.data.chartDataInType
            }
          ]
        };


        chart.setOption(option);
      }
    },
    /**
     * 预算区分饼图设置
     * @param chart 
     */
    setChartOptionInBudget(chart: any) {
      if (this.data.reporter) {
        var option = {
          color: ['#f0f0f0', '#ff9547', '#ff9eac', '#27c1b7', '#db0839', '#66c0ff', '#c1cad4', '#ffd010', '#c252c6', '#ff6fbe'],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          //legend: {
          //  left: 'auto',
          //  top: 'buttom',
          //  orient: 'hozizonal',
          //  type: 'scroll'
          //},
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: this.data.chartDataInBudget
            }
          ]
        };
        chart.setOption(option);
      }
    },
    /**
     * 交通区分饼图设置
     * @param chart 
     */
    setChartOptionInTransportType(chart: any) {
      if (this.data.reporter) {
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          //legend: {
          //  left: 'auto',
          //  top: 'buttom',
          //  orient: 'hozizonal',
          //  type: 'scroll'
          //},
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: this.data.chartDataInTransportType
            }
          ]
        };
        chart.setOption(option);
      }
    },
    /**
     * 多y轴柱状图设置
     * @param chart 
     */
    setStatisticChartOption(chart: any, data: any) {
      const colors = ['#5470C6', '#EE6666', '#91CC75'];
      if (this.data.reporter) {
        var option = {
          color: colors,

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            right: '20%'
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ['Evaporation', 'Precipitation', 'Temperature']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "合计" + currencyList[this.data.reporter.mainCurrency].symbol,
              position: 'left',
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: displayNumber
              }
            },
            {
              type: 'value',
              name: currencyList[this.data.reporter.mainCurrency].symbol,
              position: 'right',
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: displayNumber
              }
            },
            {
              type: 'value',
              name: currencyList[this.data.reporter.subCurrency].symbol,
              position: 'right',
              offset: 30,
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: displayNumber
              }
            }
          ],
          series: data
        };
        chart.setOption(option);
      }
    },
  },
});