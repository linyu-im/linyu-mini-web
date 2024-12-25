export function daysDifference(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);
    const timeDifference = today - inputDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference;
}

export function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function getDateParts(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}

export function getMonthAndDayParts(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`
}

export function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    // 检查是否是昨天
    const isYesterday = now.getDate() - date.getDate() === 1 && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();

    if (diffMs < oneDay && !isYesterday) {
        // 当天消息
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const day = hours < 12 ? '上午' : '下午';
        return `${day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (isYesterday) {
        // 昨天的消息
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `昨天 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (diffMs < oneWeek) {
        // 超过1天，小于1周
        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const day = daysOfWeek[date.getDay()];
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else {
        // 大于1周
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份从0开始
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
}

export function formatTimingTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}