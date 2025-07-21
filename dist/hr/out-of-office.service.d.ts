import { Repository } from 'typeorm';
import { OutOfOffice } from './entities/out-of-office.entity';
import { CreateOutOfOfficeDto } from './dto/create-out-of-office.dto';
export declare class OutOfOfficeService {
    private outOfOfficeRepo;
    constructor(outOfOfficeRepo: Repository<OutOfOffice>);
    create(dto: CreateOutOfOfficeDto & {
        staff_id: number;
    }): Promise<OutOfOffice>;
    findByStaff(staff_id: number): Promise<OutOfOffice[]>;
}
