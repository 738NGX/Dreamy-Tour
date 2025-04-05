import { Reporter } from "../../utils/reporter/reporter";
import { ReporterForUser } from "../../utils/reporter/reporterForUser";
import { currencyList } from "../../utils/tour/expense";
import { Tour } from "../../utils/tour/tour";
import { UserBasic } from "../../utils/user/user";
import { displayNumber } from "../../utils/util";

const app = getApp<IAppOption>();

var echarts = require('../../components/ec-canvas/echarts');


Component({
  data: {
    isGroup: false,
    currentTour: {} as Tour,
    currentTourCopyIndex: 0,
    currentUserId: 0 as number,
    currentUserList: [] as any[],
    selectingUserVisible: false,
    selectedUserId: -1 as number,
    selectedUserName: '' as string,
    currencyList: currencyList,
    ec: {
      lazyLoad: true
    },
    reporter: {} as ReporterForUser | Reporter,

    activeCollapses: [[], [], [], [], [], []],
    expandedPanels: [],
    memberOptions: [] as any[],

    chartDataInType: [] as any[],
    chartDataInBudget: [] as any[],
    chartDataInTransportType: [] as any[],

    chartDataInHotel: {},
    chartDataInMeal: {},
    chartDataInTicket: {},
    chartDataInShopping: {},
    budgetChartData: {},

    totalTransportCurrency: '',
    totalMainCurrency: '',
    totalSubCurrency: '',
    totalCurrency: '',

    isCurrentUserInGroup: false,
  },

  methods: {
    async onLoad(options: any) {
      const tourId = options.tourId;
      const currentTourCopyIndex = options.currentTourCopyIndex;

      this.setData({
        currentTour: await app.loadFullTour(parseInt(tourId)) as Tour,
        currentTourCopyIndex: currentTourCopyIndex,
      })

      await this.init();
      wx.onThemeChange(async (res) => {
        await this.init();
        console.log('当前主题：', res.theme)
      });
    },
    async init() {
      await this.updateData();
      this.initReport(this.data.currentTour, this.data.currentTourCopyIndex, this.data.selectedUserId);
      this.initCharts();
    },
    async updateData() {
      const tourMemberList = await app.getMembersInTour(this.data.currentTour.id);
      const currentUserId = (await app.getCurrentUser() as UserBasic).id;
      const currentUserList = tourMemberList.filter((user) => { return user.id !== currentUserId })
      const memberOptions = [
        { label: '群组', value: -1 },
        { label: tourMemberList.find((user) => user.id === currentUserId)?.name + '(我)', value: currentUserId },
        ...currentUserList.map((user) => {
          return { label: user.name, value: user.id }
        })
      ]

      // 基于计算出的 currentUserList 设置其他字段
      if (this.data.selectedUserId == -1) {
        this.setData({
          currentUserId: currentUserId,
          currentUserName: tourMemberList.find((user) => user.id === currentUserId)?.name,
          isCurrentUserInGroup: this.data.currentTour.users.includes(currentUserId),
          currentUserList: currentUserList,
          selectedUserId: -1,
          selectedUserName: '群组',
          isGroup: true,
          memberOptions: memberOptions,
        })
        return;
      }
      const selectedUserId = this.data.selectedUserId > 0
        ? this.data.selectedUserId
        : (this.data.currentTour.users.includes(currentUserId)
          ? currentUserId
          : tourMemberList[0]?.id);
      this.setData({
        isGroup: false,
        memberOptions: memberOptions,
        currentUserId: currentUserId,
        currentUserName: tourMemberList.find((user) => user.id === currentUserId)?.name,
        isCurrentUserInGroup: this.data.currentTour.users.includes(currentUserId),
        currentUserList: currentUserList,
        selectedUserId: selectedUserId,
        selectedUserName: tourMemberList.find((user) => user.id === this.data.selectedUserId)?.name,
      })
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

      const budgetChart = this.selectComponent('#budgetChart')
      budgetChart.init((canvas: any, width: any, height: any) => {
        const chart = echarts.init(canvas, isDarkMode ? 'dark' : null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        this.setBudgetChartOption(chart);
        chart.setOption({ backgroundColor: 'transparent' });
        return chart
      })
    },
    initReport(value: any, copyIndex: number, selectedUserId: number) {
      //  console.log("beforeinitReport",this.data.currentTour,this.data.currentTourCopyIndex)
      const currentTour = new Tour(value);

      const reporter = this.data.isGroup
        ? new Reporter(currentTour, copyIndex)
        : new ReporterForUser(currentTour, copyIndex, selectedUserId);

      const totalTransportCurrency = reporter.expenseProcessor.expenseCalculator.calculateTotalTransportCurrency()
      this.setData({
        reporter: reporter,
        chartDataInType: reporter.expenseProcessor.expenseCalculator.getChartDataInType(),
        chartDataInBudget: reporter.expenseProcessor.expenseCalculator.getChartDataInBudget(currentTour.budgets.map(budget => budget.title)),
        chartDataInTransportType: reporter.expenseProcessor.expenseCalculator.getChartDataInTransportType(),

        chartDataInHotel: reporter.expenseProcessor.typeList[0].chartData,
        chartDataInMeal: reporter.expenseProcessor.typeList[1].chartData,
        chartDataInTicket: reporter.expenseProcessor.typeList[3].chartData,
        chartDataInShopping: reporter.expenseProcessor.typeList[4].chartData,

        totalMainCurrency: reporter.expenseProcessor.expenseCalculator.total.mainCurrency.toFixed(2),
        totalSubCurrency: reporter.expenseProcessor.expenseCalculator.total.subCurrency.toFixed(2),
        totalCurrency: reporter.expenseProcessor.expenseCalculator.total.allCurrency.toFixed(2),
        totalTransportCurrency: totalTransportCurrency.toFixed(2),
      })
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
    handleBudgetCollapsesChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        expandedPanels: e.detail.value
      });
    },
    handleSelectingUser() {
      this.setData({
        selectingUserVisible: !this.data.selectingUserVisible
      })
    },
    onSelectedUserChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ selectedUserId: value[0] });
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
          legend: {
            left: 'auto',
            top: 'center',
            orient: 'hozizonal',
            type: 'scroll'
          },
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
          legend: {
            left: 'auto',
            top: 'buttom',
            orient: 'hozizonal',
            type: 'scroll'
          },
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
          legend: {
            left: 'auto',
            top: 'buttom',
            orient: 'hozizonal',
            type: 'scroll'
          },
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
     * 预算表盈亏图设置
     * @param chart 
     * @param data 
     */
    setBudgetChartOption(chart: any) {
      if (this.data.reporter) {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['盈亏', '消费', '预算']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'value'
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: {
                show: true
              },
              data: (this.data.reporter as Reporter).titleOfBudgets
            }
          ],
          series: [
            {
              name: '盈亏',
              type: 'bar',
              label: {
                show: true,
                position: 'inside'
              },
              emphasis: {
                focus: 'series'
              },
              data: (this.data.reporter as Reporter).diff
            },
            {
              name: '预算',
              type: 'bar',
              stack: 'Total',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: (this.data.reporter as Reporter).budgets
            },
            {
              name: '消费',
              type: 'bar',
              stack: 'Total',
              label: {
                show: true,
                position: 'left'
              },
              emphasis: {
                focus: 'series'
              },
              data: (this.data.reporter as Reporter).costs
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
              data: data.categories,
              axisLabel: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "合计" + currencyList[this.data.reporter.expenseProcessor.mainCurrency].symbol,
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
              name: currencyList[this.data.reporter.expenseProcessor.mainCurrency].symbol,
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
              name: currencyList[this.data.reporter.expenseProcessor.subCurrency].symbol,
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
          series: data.series
        };
        chart.setOption(option);
      }
    },
  },
});