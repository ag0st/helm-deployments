import http from 'k6/http';
import { check, sleep } from 'k6';

// Get constants and pdf files
const constants = JSON.parse(open('./k6-const.json'));
const pdfPositive = open(constants.files.pdf.positive, 'b');
const pdfNegative = open(constants.files.pdf.negative, 'b');

export let options = {
    stages: [
        {duration: '10s', target: 1}, // Max users
        {duration: '2s', target: 5}, // stay at max for 3 minutes
        {duration: '1m', target: 5}, // stay at max for 3 minutes
        {duration: '10s', target: 1}, // scale down. Recovery stage.
    ],
    thresholds: {
        http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: false }],
        http_req_duration: ['p(90) < 40*1000', 'p(95) < 50*1000', 'p(100) < 60*1000'],
    },
    discardResponseBodies: false,
}

export default function () {
    // Get random positive or negative files
    var data;
    var expectedResult;
    if (Math.random()*100+1 > 95) {
        data = {
            file: http.file(pdfPositive, "file.pdf")
        };
        expectedResult = constants.response.noOk;
    } else {
        data = {
            file: http.file(pdfNegative, "file.pdf")
        };
        expectedResult = constants.response.ok;
    }


    // Setting params
    let params = {
        timeout: '300s', // chrome default timeout
        tags: { k6test: 'yes' },
    };


    // Check the response
    var res = http.post(constants.url, data, params);
    check(res, {
        "result is right": (res) => res.body == expectedResult,
    });

}
