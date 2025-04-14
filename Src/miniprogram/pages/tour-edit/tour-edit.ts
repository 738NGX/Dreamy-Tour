import HttpUtil from "../../utils/httpUtil";
import { budgetList, currencyList } from "../../utils/tour/expense";
import { Tour } from "../../utils/tour/tour";
import { Location, Transportation } from "../../utils/tour/tourNode";
import { formatDate } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  data: {
    budgetList: budgetList,
    currencyList: currencyList,

    currentTour: {} as Tour,
    currentTourId: 0 as number,
    settingsVisible: false,

    dateRange: [] as any[],
    currentDateFilter: { label: "全部", value: [0, 0, 0] } as any,

    copyOptions: [] as any[],
    currentCopyIndex: 0,

    showUserReport: true,

    generatorVisible: false,
    generatorText: "",
    generatorResult: "",
    generatorDisplay: []
  },
  methods: {
    async onLoad(options: any) {
      const { tourId } = options;
      const currentTour = await app.loadFullTour(parseInt(tourId)) as Tour;
      const dateRange = this.getDateRange(currentTour!.startDate, currentTour!.endDate);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({
        currentTour, dateRange, copyOptions,
        currentTourId: tourId
      });
      await this.onShow();
    },
    async onShow() {
      const viewerComponent = this.selectComponent('#viewer');
      if (viewerComponent && this.data.currentTourId > 0) {
        await viewerComponent.init(this.data.currentTour);
      }
    },
    handleCurrentTourChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ currentTour: new Tour(value) });
    },
    getDateRange(startTimestamp: number, endTimestamp: number): number[][] {
      const startDate = new Date(startTimestamp);
      const endDate = new Date(endTimestamp);
      const result: any[] = [{ label: "全部", value: [0, 0, 0] }];
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      while (startDate <= endDate) {
        result.push({
          label: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
          value: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()]
        });
        startDate.setDate(startDate.getDate() + 1);
      }
      return result;
    },
    handleSettings() {
      this.setData({ settingsVisible: !this.data.settingsVisible });
    },
    handleDateFilterStep() {
      const { dateRange, currentDateFilter } = this.data;
      const currentFilterIndex = dateRange.findIndex((date: any) => date.label === currentDateFilter.label);
      const nextFilterIndex = currentFilterIndex + 1;
      const nextFilter = dateRange[nextFilterIndex] || dateRange[0];
      this.setData({ currentDateFilter: nextFilter });
    },
    onCopyChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ currentCopyIndex: value });
    },
    async addCopy() {
      const { currentTour } = this.data;
      currentTour.pullCopy();
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, copyOptions });
      await app.changeFullTour(currentTour);
    },
    handleGenerateCopyFromText() {
      this.setData({ settingsVisible: false, generatorVisible: !this.data.generatorVisible });
    },
    onGeneratorTextChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ generatorText: value });
    },
    async generateCopyFromText(needLocations: boolean = false) {
      const currentDate = new Date().toISOString();
      const task = `
你现在是个旅游规划助手，你要帮我规划每天的行程安排
旅行计划的开始日期是${formatDate(this.data.currentTour.startDate)}, 结束日期是 ${formatDate(this.data.currentTour.endDate)}（默认的开始和结束日期为 ${currentDate}，若前面有请忽略）。
以下是我的旅行计划概述:
${this.data.generatorText}
请根据这个概述生成一个新的旅行计划,返回形如{locations:[{start:'',end:'',title:'',note:''},...]}的json格式,其中title为位置的地址文字,start和end为在这个位置的起始时间和结束时间（时间格式必须为 yyyy-mm-dd hh:mm:ss）,note为在这个位置的备注文字,locations是一个数组,每个元素都是一个位置的对象,请注意,生成的旅行计划应该是一个新的旅行计划,而不是对原始旅行计划的修改.请不要返回任何其他内容.
`;
      this.watchResult();
      const res = await HttpUtil.requestStream(
        {
          url: `/llm/json`,
          jsonData: {
            task: task,
            temperature: 0.5,
            max_tokens: 3000,
          }
        },
        this, 'generatorResult'
      )
      try {
        this.setData({ generatorVisible: false });
        const resObj = JSON.parse(this.convertDatesToTimestamp(res.join('')));
        console.log(resObj);
        const { currentTour } = this.data;
        currentTour.addCopy();
        const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
        const copyIndex = currentTour.nodeCopyNames.length - 1;
        this.setData({ currentTour, copyOptions, currentCopyIndex: copyIndex });
        for (const location of resObj.locations) {
          currentTour.pushLocation(copyIndex);
          const newLocation = currentTour.locations[copyIndex][currentTour.locations[copyIndex].length - 1];
          const newTransportation = currentTour.transportations[copyIndex][currentTour.transportations[copyIndex].length - 1];
          newLocation.title = location.title;
          newLocation.startOffset = parseInt(location.start) - currentTour.startDate;
          newLocation.endOffset = parseInt(location.end) - currentTour.startDate;
          newTransportation.endOffset = newLocation.startOffset;
          newLocation.note = location.note;
          this.setData({ currentTour });
        }
        await app.changeFullTour(currentTour);
      } catch (err) {
        console.error('生成失败:', err);
        wx.showToast({
          title: '生成失败',
          icon: 'error',
        });
        return;
      }
      if (!needLocations) return;
    },
    async changeCopyName(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour, copyOptions } = this.data;
      currentTour.nodeCopyNames[index] = value;
      copyOptions[index].label = value;
      this.setData({ currentTour, copyOptions });
      await app.changeFullTour(currentTour);
    },
    syncCopy() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否将当前行程版本同步为默认版本？',
        async success(res) {
          if (res.confirm) {
            const index = that.data.currentCopyIndex;
            const { currentTour } = that.data;
            currentTour.locations[index] = currentTour.locations[0].map((location: Location) => new Location(location));
            currentTour.transportations[index] = currentTour.transportations[0].map((transportation: Transportation) => new Transportation(transportation));
            that.setData({ currentTour });
            await app.changeFullTour(currentTour);
          }
        }
      });
    },
    pushCopy() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否将当前行程版本推送为默认版本？',
        async success(res) {
          if (res.confirm) {
            const index = that.data.currentCopyIndex;
            const { currentTour } = that.data;
            currentTour.locations[0] = currentTour.locations[index].map((location: Location) => new Location(location));
            currentTour.transportations[0] = currentTour.transportations[index].map((transportation: Transportation) => new Transportation(transportation));
            that.setData({ currentTour });
            await app.changeFullTour(currentTour);
          }
        }
      });
    },
    async removeCopy(e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.removeCopy(index);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, copyOptions, currentCopyIndex: 0 });
      await app.changeFullTour(currentTour);
    },
    async changeBudgetName(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.budgets[index].title = value;
      this.setData({ currentTour });
      await app.changeFullTour(currentTour);
    },
    async changeBudgetAmount(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.budgets[index].amount = Number(value);
      this.setData({ currentTour });
      await app.changeFullTour(currentTour);
    },
    async exchangeBudgetCurrency(e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      const currentCurrency = currentTour.budgets[index].currency;
      const nextCurrency = currentCurrency == currentTour.mainCurrency ? currentTour.subCurrency : currentTour.mainCurrency;
      currentTour.budgets[index].currency = nextCurrency;
      this.setData({ currentTour });
      await app.changeFullTour(currentTour);
    },
    showTourReport() {
      wx.navigateTo({
        url: `/pages/report/report?tourId=${this.data.currentTourId}&currentTourCopyIndex=${this.data.currentCopyIndex}&showUserReport=${this.data.showUserReport}`
      })
    },
    watchResult() {
      console.log("开始监听")
      const that = this;
      let originalValue = this.data.generatorResult;

      // 使用定时器或事件触发监听
      setInterval(() => {
        if (originalValue !== that.data.generatorResult) {
          originalValue = that.data.generatorResult;
          that.getDisplay(originalValue);
        }
      }, 150); // 每隔 150ms 检查一次
    },
    getDisplay(originalValue: any) {
      // 把所有标准时间字符串变成时间戳
      const convertedValue = this.convertDatesToTimestamp(originalValue);
      const objs = this.convertJson2Obj(convertedValue);
      this.setData({
        generatorDisplay: objs
      });
    },
    convertJson2Obj(data: string): any {

      const getTitles = (data: string): string[] => {
        const regex = /"title":\s*(?:"([^"]*)"|"([^,\n}]+))/g;
        const titles = [];
        let match;
        while ((match = regex.exec(data))!== null) {
          titles.push(match[1] || match[2].trim());
        }
        return titles;
      };
    
      const getNotes = (data: string): string[] => {
        const regex = /"note":\s*(?:"([^"]*)"|"([^,\n"}]+))/g;
        const notes = [];
        let match;
        while ((match = regex.exec(data))!== null) {
          notes.push(match[1] || match[2].trim());
        }
        return notes;
      };
    
      const getStarts = (data: string): string[] => {
        const regex = /"start":\s*(\d{13})/g;
        const starts = [];
        let match;
        while ((match = regex.exec(data))!== null) {
          starts.push(match[1]);
        }
        return starts;
      };
    
      const getEnds = (data: string): string[] => {
        const regex = /"end":\s*(\d{13})/g;
        const ends = [];
        let match;
        while ((match = regex.exec(data))!== null) {
          ends.push(match[1]);
        }
        return ends;
      };
    
      // 将时间戳转换为 yyyy-mm-dd 格式（这里只取日期部分用于分组）
      const formatDate = (timestamp: number): string => {
        if (!timestamp) return '';
        const date = new Date(Number(timestamp));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
       // 将时间戳转换为 yyyy-mm-dd HH:mm:ss 格式
       const formatTimestamp = (timestamp: number): string => {
        if (!timestamp) return '';
        const date = new Date(Number(timestamp));
        //const year = date.getFullYear();
        //const month = String(date.getMonth() + 1).padStart(2, '0');
        //const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        //const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };
      // 合并结果为对象数组并按日期分组
      const mergeResults = (titles: string[], notes: string[], starts: string[], ends: string[]) => {
        const maxLength = Math.max(titles.length, notes.length, starts.length, ends.length);
        const result = [];
        for (let i = 0; i < maxLength; i++) {
            result.push({
                title: titles[i] || '',
                note: notes[i] || '',
                start: starts[i] || 0,
                end: ends[i] || 0
            });
        }

        const groupedResult: { [date: string]: any[] } = {};
        result.forEach(item => {
            const startDate = formatDate(Number(item.start));
            if (!groupedResult[startDate]) {
                groupedResult[startDate] = [];
            }
            // 这里再将时间戳格式化为你想要的具体时间格式
            const formattedItem = {
                ...item,
                start: formatTimestamp(Number(item.start)),
                end: formatTimestamp(Number(item.end))
            };
            groupedResult[startDate].push(formattedItem);
        });

        return groupedResult;
      };
    
      const titles = getTitles(data);
      const notes = getNotes(data);
      const starts = getStarts(data);
      const ends = getEnds(data);
    
      const mergedResult = mergeResults(titles, notes, starts, ends);
      return mergedResult;
    },
    convertDatesToTimestamp(str: string): string {
      // 正则匹配 yyyy:mm:dd hh:mm:ss 格式的日期
      const dateRegex = /"(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})"/g;
    
      // 替换的日期为时间戳
      return str.replace(dateRegex, (_match: string, yyyy: string, mm: string, dd: string, hh: string, MM: string, ss: string): string => {
        // 构造 Date 对象（注意月份要减1，因为JS月份是0-11）
        const date = new Date(`${yyyy}-${mm}-${dd}T${hh}:${MM}:${ss}`);
        
        // 返回13位时间戳
        return date.getTime().toString();
      });
    }
  }
})