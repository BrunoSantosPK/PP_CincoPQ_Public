export default function formatarData(time) {
    const obj = new Date(time);
    return `${obj.getDate()}/${obj.getMonth() + 1}/${obj.getUTCFullYear()} - ${obj.getHours()}:${obj.getMinutes()}`;
}