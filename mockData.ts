
import { Account, BucketId } from './types';

const generateMockAccounts = (count: number): Account[] => {
  const names = [
    "Alice Thompson", "Bob Richards", "Charlie Davis", "Diana Prince", 
    "Edward Norton", "Fiona Apple", "George Miller", "Hannah Abbott",
    "Ian Wright", "Julia Roberts", "Kevin Hart", "Laura Palmer",
    "Michael Scott", "Nancy Drew", "Oscar Isaac", "Penny Lane"
  ];

  return Array.from({ length: count }, (_, i) => {
    const dpd = Math.floor(Math.random() * 200);
    let bucket: BucketId = BucketId.B1;
    if (dpd >= 180) bucket = BucketId.B7;
    else if (dpd >= 150) bucket = BucketId.B6;
    else if (dpd >= 120) bucket = BucketId.B5;
    else if (dpd >= 90) bucket = BucketId.B4;
    else if (dpd >= 60) bucket = BucketId.B3;
    else if (dpd >= 30) bucket = BucketId.B2;

    const loan = 5000 + Math.random() * 45000;
    
    return {
      id: `ACC-${1000 + i}`,
      customerName: names[i % names.length],
      loanAmount: loan,
      arrearsAmount: loan * (0.05 + Math.random() * 0.1),
      dpd,
      bucket,
      status: bucket >= BucketId.B4 ? 'legal' : 'active',
      riskScore: Math.floor(Math.random() * 100),
      lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

export const MOCK_ACCOUNTS = generateMockAccounts(24);
