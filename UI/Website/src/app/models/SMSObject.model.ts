export class TopicList {
    topics: string[];
}

export class SubscriptionList {
    constructor (subs: string[]) {
        this.subscriptions = [];
        subs.forEach(sub => {
            this.subscriptions.push({phoneNumber: '', arn: sub} as Subscription);
        });
    }
    subscriptions: Subscription[];
}

export class Subscription {
    phoneNumber: string;
    arn: string;
}

export class SMSMessage {
    message: string;
    arn: string;
}
