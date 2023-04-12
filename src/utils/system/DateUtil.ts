import moment from 'moment';


class DateUtil {

    private _date;


    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    public getCurrentDate() {
       // const today = new Date();
       // return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        return moment().format('YYYY-MM-DD');
    }

    public getCurrentYear() {
        const today = new Date();
        return today.getFullYear();
    }

    public getCurrentMonth() {
        const today = new Date();
        return today.getMonth()+1;
    }
    public getCurrentDayInt() {
        const today = new Date();
        return today.getDate();
    }

    public getCurrentDay() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        return days[today.getDay()];
    }

    public getCurrentMonthName() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const today = new Date();
        const month = today.getMonth();
        return monthNames[month];
    }


    public getYear() {
        const theDay = new Date(this.date);
        return theDay.getFullYear();
    }

    public getMonth() {
        const theDay = new Date(this.date);
        return theDay.getMonth()+1;
    }

    public getDay() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const theDay = new Date(this.date);
        return days[theDay.getDay()];
    }

    public getDayByNumber(pos) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[pos];
    }

    public getMonthName() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const theDay = new Date(this.date);
        const month = theDay.getMonth();
        return monthNames[month];
    }

    public getWeek() {
        return moment(this.date).format('w');
    }

    public getHour() {
        const theDay = new Date(this.date);
        return theDay.getHours();
    }

    public getCurrentHour() {
        const today = new Date();
        return today.getHours();
    }

    public addDays(days = 0) {
        const today = new Date();
        return moment(this.date).add(days, 'day');
    }

    public getMomentFromDate(date: string, format: string) {
        return moment(date, format);
    }
    public getMoment() {
        return moment();
    }

    public static getInstance() {
        return new DateUtil();
    }

    public static getMomentInstance() {
        return moment();
    }

    public static getRawMomentInstance() {
        return moment;
    }

    public registerTransaction(body: any) {
        body.day = this.getCurrentDayInt();
        body.week = this.getWeek();
        body.month = this.getCurrentMonth();
        body.year = this.getCurrentYear();
        body.day_of_the_week = this.getCurrentDay();
        body.hour_of_day = moment().format('h');

        body.date_of_day = moment().format('DD-MM-YYYY');
        body.am_or_pm = moment().format('A');

        return body;
    }
    public static newDateFromTimeZone(dateTime = null, timeZone= "Africa/Lagos") {
        if (!dateTime) {
            return DateUtil.newDateForZone(timeZone)
                .toLocaleString();
        }
        return new Date(dateTime)
            .toLocaleString("en-NG", {timeZone: timeZone});
    }

    public newDateFromTimeZone(dateTime = null, timeZone= "Africa/Lagos") {
        if (!dateTime) {
            return this.newDateForZone(timeZone)
                .toLocaleString("en-NG", {timeZone: timeZone});
        }
        return new Date(dateTime)
            .toLocaleString("en-NG", {timeZone: timeZone});
    }

    public static newDateForZone(timeZone= "Africa/Lagos") {
        const d = new Date(new Date().toLocaleString("en-NG", {timeZone: timeZone}));
        return d;
    }

    public newDateForZone(timeZone= "Africa/Lagos") {
        return new Date(new Date().toLocaleString("en-NG", {timeZone: timeZone}));
    }

    getDateOfDay() {
        return moment().format('DD-MM-YYYY');
    }
}

export  default DateUtil;
