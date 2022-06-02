const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

const logFormat = format.combine(
    format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
);
const dbLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/mongodb-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: false,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat,
            

        }),
    ],
});

const userLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/user-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: false,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat

        }),
    ],
});

const accessManagerLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/accessmanager-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: false,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat

        }),
    ],
});

const authLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/auth-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: false,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat


        }),
    ],
});

const serverLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/server-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: false,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat


        }),
    ]
});

const requestLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/request-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: false,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat


        }),
    ]
});

const message = (req, status, message, cause = '') => {
    return `${req.method} ${req.url} from ${req.ip}; status code ${status}; ${message}; ${cause}`
}


module.exports = {
    userLogger: userLogger,
    authLogger: authLogger,
    serverLogger: serverLogger,
    dbLogger: dbLogger,
    accessManagerLogger: accessManagerLogger,
    requestLogger:requestLogger,
    message:message
};