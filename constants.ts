
import { BucketId, BucketRule } from './types';

export const BUCKET_RULES: Record<BucketId, BucketRule> = {
  [BucketId.B1]: {
    id: BucketId.B1,
    name: "Bucket 1",
    monthlyRange: [0, 29],
    meaning: "Early arrears",
    actions: ["Friendly SMS", "Payment link", "Low-priority agent task"]
  },
  [BucketId.B2]: {
    id: BucketId.B2,
    name: "Bucket 2",
    monthlyRange: [30, 59],
    meaning: "Escalating arrears",
    actions: ["SMS + Email", "Outbound call", "Capture reason & PTP"]
  },
  [BucketId.B3]: {
    id: BucketId.B3,
    name: "Bucket 3",
    monthlyRange: [60, 89],
    meaning: "Pre-default",
    actions: ["Formal warning", "Supervisor call", "Hardship assessment"]
  },
  [BucketId.B4]: {
    id: BucketId.B4,
    name: "Bucket 4",
    monthlyRange: [90, 119],
    meaning: "APRA default trigger",
    actions: ["Section 88(6) notice", "Final demand", "CRB staging"],
    isCritical: true
  },
  [BucketId.B5]: {
    id: BucketId.B5,
    name: "Bucket 5",
    monthlyRange: [120, 149],
    meaning: "Severe delinquency",
    actions: ["Section 11D notice", "Assign DRA / Legal"]
  },
  [BucketId.B6]: {
    id: BucketId.B6,
    name: "Bucket 6",
    monthlyRange: [150, 179],
    meaning: "Critical recovery",
    actions: ["Legal action", "Settlement / write-off review"]
  },
  [BucketId.B7]: {
    id: BucketId.B7,
    name: "Bucket 7",
    monthlyRange: [180, 9999],
    meaning: "Long-term default",
    actions: ["Charge-off / debt sale", "Final CRB reporting"]
  }
};
