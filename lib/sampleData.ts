export const SAMPLE_CSV_FILENAME = "vouch-sample-leads.csv";

export const SAMPLE_CSV_CONTENT = `Name,Email,Phone,Revenue,Stage,Owner,Lead Source,Date
Aarav Shah,aarav.shah@quantech.in,+91 98200 11223,185000,Negotiation,Aditi Sharma,Referral,2026-05-02
Diya Patel,diya.patel@brightretail.com,+91 90210 44556,45000,New,Rohan Mehta,Website,2026-05-03
Kabir Singh,,+91 99870 12121,620000,Closed Won,Aditi Sharma,Meta Ads,2026-05-04
Ananya Iyer,ananya.iyer@finserve.co.in,+91 98450 33221,95000,Contacted,Priya Nair,Google Ads,2026-05-05
Vihaan Reddy,vihaan.reddy@logizone.in,,250000,Negotiation,Rohan Mehta,Cold Call,2026-05-06
Ishita Rao,ishita.rao@medicore.com,+91 91234 55667,1850000,Closed Won,Aditi Sharma,Referral,2026-05-07
Aditya Kumar,aditya.kumar@buildwell.in,+91 90090 88776,32000,Closed Lost,,Website,2026-05-08
Meera Joshi,meera.joshi@edulearn.co,+91 98765 22110,78000,New,Priya Nair,Event,2026-05-09
Rehan Ali,rehan.ali@skynettech.in,+91 99001 23456,410000,Negotiation,Rohan Mehta,Meta Ads,2026-05-10
Sanya Kapoor,sanya.kapoor@greenfields.in,+91 98220 99887,56000,Contacted,Aditi Sharma,Website,2026-05-11
Arjun Nair,,+91 90123 45678,140000,New,Priya Nair,Referral,2026-05-12
Kavya Menon,kavya.menon@urbanstay.in,+91 97654 32109,320000,Closed Won,Rohan Mehta,Google Ads,2026-05-13
Yash Trivedi,yash.trivedi@steelworks.in,+91 96543 21098,980000,Negotiation,Aditi Sharma,Cold Call,2026-05-14
Riya Chatterjee,riya.chatterjee@fashionloop.in,+91 95432 10987,64000,New,Priya Nair,Event,2026-05-15
Devansh Bhatt,devansh.bhatt@primecapital.in,+91 94321 09876,2650000,Closed Won,Aditi Sharma,Referral,2026-05-16
Neha Verma,neha.verma@wellnesshub.in,+91 93210 98765,88000,Contacted,Rohan Mehta,Website,2026-05-17
Karan Malhotra,karan.malhotra@autoparts.in,,175000,Negotiation,Priya Nair,Meta Ads,2026-05-18
Pooja Desai,pooja.desai@agrotech.in,+91 92109 87654,53000,New,Aditi Sharma,Google Ads,2026-05-19
Aarav Shah,aarav.shah@quantech.in,+91 98200 11223,185000,Closed Lost,Rohan Mehta,Referral,2026-05-20
Tara Sen,tara.sen@bluewave.in,+91 91098 76543,410000,Closed Won,,Cold Call,2026-05-21
Aman Gupta,aman.gupta@nextgenmedia.in,+91 90987 65432,29000,New,Priya Nair,Event,2026-05-22
Simran Kaur,simran.kaur@retailplus.in,+91 89876 54321,720000,Negotiation,Aditi Sharma,Website,2026-05-23
Dev Patel,dev.patel@fintrust.in,+91 88765 43210,150000,Contacted,Rohan Mehta,Meta Ads,2026-05-24
Anika Roy,,+91 87654 32109,67000,New,Priya Nair,Referral,2026-05-25
Rohit Sharma,rohit.sharma@constructa.in,+91 86543 21098,3200000,Closed Won,Aditi Sharma,Google Ads,2026-05-26
Nisha Pillai,nisha.pillai@healthfirst.in,+91 85432 10987,42000,Closed Lost,Rohan Mehta,Cold Call,2026-05-27
Varun Choudhary,varun.choudhary@edgeworks.in,+91 84321 09876,560000,Negotiation,Priya Nair,Website,2026-05-28
Ira Bose,ira.bose@stylecraft.in,+91 83210 98765,38000,New,Aditi Sharma,Event,2026-05-29
Farhan Khan,farhan.khan@logitrans.in,+91 82109 87654,890000,Closed Won,Rohan Mehta,Referral,2026-05-30
Gauri Iyer,gauri.iyer@digiwave.in,+91 81098 76543,73000,Contacted,Priya Nair,Meta Ads,2026-05-31
`;

export function createSampleCsvFile(): File {
  return new File([SAMPLE_CSV_CONTENT], SAMPLE_CSV_FILENAME, { type: "text/csv" });
}
