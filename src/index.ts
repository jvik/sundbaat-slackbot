import SlackBot from "slackbots";
import request from "request";
import dotenv from "dotenv";
const endpoint = "http://localhost:4005";

dotenv.config();

const envKey = process.env.envKey;

const bot = new SlackBot({
    token: envKey,
    name: "Sundboten"
});

bot.on("start", function () {
    console.log("Hello world!");
    sendTableToday();
});

bot.on("message", function (data) {
    if (data.type !== "message") {
        return;
    }

    handleMessage(data.text);
});

function handleMessage(message) {
    switch (message) {
        case "sundbaten":
            sendTableToday();
            break;
        case "hello":
            break;
        default:
            return;
    }
}

const getTimeTable = (callback) => {
    return request(endpoint, (error, response) => {
        const timeTable = JSON.parse(response.body);
        const departureDayToday = checkDayDepartures(timeTable);
        if (error) {
            console.log("Error: ", error)
        } else {
            const departuresTodayArray = departuresToday(departureDayToday, timeTable);
            return callback(departuresTodayArray);
        }
    })
}

const checkDayDepartures = (timeTable) => {
    const timeNow = new Date().getDay();
    var departureDayToday = "";

    if (timeNow <= 5 && timeNow >= 1) {
        departureDayToday = "weekdayDepartures";
    } else if (timeNow === 1) {
        departureDayToday = "sundayDepartures";
    } else if (timeNow === 6) {
        departureDayToday = "saturdayDepartures";
    }
    return departureDayToday;
}

function departuresToday(departureDayToday, timeTable) {
    return timeTable[departureDayToday];
}

const sendTableToday = async () => {
    const response = getTimeTable();

    console.log(response)
    bot.postMessageToChannel("slackbot-test", response);
}