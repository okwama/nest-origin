export declare class CreateOrderDto {
    totalAmount: number;
    totalCost: number;
    amountPaid: number;
    balance: number;
    comment: string;
    customerType: string;
    customerId: string;
    customerName: string;
    orderDate: string;
    riderId?: number;
    riderName?: string;
    status?: number;
    approvedTime?: string;
    dispatchTime?: string;
    deliveryLocation?: string;
    completeLatitude?: string;
    completeLongitude?: string;
    completeAddress?: string;
    pickupTime?: string;
    deliveryTime?: string;
    cancelReason?: string;
    recepient?: string;
    userId: number;
    clientId: number;
    countryId: number;
    regionId: number;
    approvedBy: string;
    approvedByName: string;
    storeId?: number;
    retailManager: number;
    keyChannelManager: number;
    distributionManager: number;
    imageUrl?: string;
}
