export const MILLISECONDS = {
    SECOND: 1e+3,
    MINUTE: 6e+4,
    HOUR: 3.6e+6,
    DAY: 8.64e+7
};

export const formatTime = (date: Date, timeOffset?: number) => {
    const usingDate = new Date(date);
    if (timeOffset !== undefined) {
        usingDate.setTime(
            usingDate.getTime() + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE 
            - timeOffset * MILLISECONDS.MINUTE
        );
    }
    
    const year = usingDate.getFullYear()
    const month = usingDate.getMonth() + 1
    const day = usingDate.getDate()
    const hour = usingDate.getHours()
    const minute = usingDate.getMinutes()

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute].map(formatNumber).join(':')
    )
}

export const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}

export const formatDate = (date: Date, timeOffset?: number) => {
    const usingDate = new Date(date);
    if (timeOffset !== undefined) {
        usingDate.setTime(
            usingDate.getTime() + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE 
            - timeOffset * MILLISECONDS.MINUTE
        );
    }
    
    const year = usingDate.getFullYear()
    const month = usingDate.getMonth() + 1
    const day = usingDate.getDate()
    const arr = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
    
    return [year, month, day].map(formatNumber).join('/') + arr[usingDate.getDay()];
}

export function timeToMilliseconds(time: string) {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
        throw new Error("Invalid time format. Please use 'HH:mm'.");
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    const milliseconds = (hours * MILLISECONDS.HOUR) + (minutes * MILLISECONDS.MINUTE);
    return milliseconds;
}

export function exchangeCurrency(amount: number, from: string, to: string) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://books.738ngx.site/exchange-currency',
            method: 'GET',
            data: {
                amount: amount,
                from: from,
                to: to
            },
            success(res) {
                if (res.data && typeof res.data === 'object' && 'crdhldBillAmt' in res.data) {
                    resolve(res.data.crdhldBillAmt);
                } else {
                    reject('No conversion data available');
                }
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

export function getChartData(data: any) {
    let res = { series: [{ data: data }] };
    return JSON.parse(JSON.stringify(res));
}
