import { TestcaseList } from "./testcase-list";

export interface SubmissionResponse {
    sourceCode: string,
    status: string,
    passCount: number,
    score:  number,
    totalTestCases: number,
    testCaseHistoryResponses: TestcaseList[]
}
