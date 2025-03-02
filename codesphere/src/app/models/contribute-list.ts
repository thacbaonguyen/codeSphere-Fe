import {Contribute} from "./contribute";

export interface ContributeList {
  content: Contribute[],
  totalElement: number,
  totalPages: number,
  pageSize: number,
  page: number
}
