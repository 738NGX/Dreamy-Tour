export const MILLISECONDS = {
    SECOND: 1e+3,
    MINUTE: 6e+4,
    HOUR: 3.6e+6,
    DAY: 8.64e+7
};

export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
}

const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}

export const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const arr = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
    return [year, month, day].map(formatNumber).join('/') + arr[date.getDay()];
}
