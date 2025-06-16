export interface Resident {
    id: string;
    name: string;
    nationalId: string; 
    phoneNumber: string;
    gender: string;
    vehicle: string;
    createAt: string;
    updateAt: string;
    address: {
        permanentAddress: string;
        currentAddress: string;
        isStaying: string;
        apartmentNo: number;
        dateRanges: {
        startDate: string;
        endDate: string;
        type: string;
        }[];
    };
}
