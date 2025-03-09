import { TestcaseDetail } from "./testcase-detail";

export interface TestcaseList {
    id: number,
    passed: boolean,
    testCaseExpected: string,
    memory: number,
    time: number,
    output: string,
    statusId: number,
    statusName: string,
    errorMessage: string
}
