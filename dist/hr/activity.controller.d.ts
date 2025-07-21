import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    getMyRecentActivity(req: any): Promise<import("./activity.service").ActivityFeedItem[]>;
}
