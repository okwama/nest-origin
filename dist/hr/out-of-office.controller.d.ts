import { OutOfOfficeService } from './out-of-office.service';
import { CreateOutOfOfficeDto } from './dto/create-out-of-office.dto';
export declare class OutOfOfficeController {
    private readonly service;
    constructor(service: OutOfOfficeService);
    apply(dto: CreateOutOfOfficeDto, req: any): Promise<import("./entities/out-of-office.entity").OutOfOffice>;
    myRequests(req: any): Promise<import("./entities/out-of-office.entity").OutOfOffice[]>;
}
