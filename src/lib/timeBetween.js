export default function timeBetween(date, simple = false) {
    let sec = Math.floor((new Date() - new Date(date)) / 1000)
    let interval = Math.floor(sec / 31536000)
    if (!simple) {
        if (interval >= 1) {
            return `${interval} year${interval !== 1 ? 's' : ''} ago`
        }
        interval = Math.floor(sec / 2592000)
        if (interval >= 1) {
            return `${interval} month${interval !== 1 ? 's' : ''} ago`
        }
        interval = Math.floor(sec / 86400)
        if (interval >= 1) {
            return `${interval} day${interval !== 1 ? 's' : ''} ago`
        }
        interval = Math.floor(sec / 3600)
        if (interval >= 1) {
            return `${interval} hour${interval !== 1 ? 's' : ''} ago`
        }
        interval = Math.floor(sec / 60)
        if (interval >= 1) {
            return `${interval} minute${interval !== 1 ? 's' : ''} ago`
        }
        return `just now`
    } else {
        if (interval >= 1) {
            return `${interval}Y`
        }
        interval = Math.floor(sec / 2592000)
        if (interval >= 1) {
            return `${interval}M`
        }
        interval = Math.floor(sec / 86400)
        if (interval >= 1) {
            return `${interval}D`
        }
        interval = Math.floor(sec / 3600)
        if (interval >= 1) {
            return `${interval}H`
        }
        interval = Math.floor(sec / 60)
        if (interval >= 1) {
            return `${interval}M`
        }
        return `Now`
    }
}
