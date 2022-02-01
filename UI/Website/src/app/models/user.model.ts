export class AppUser {

    user: any;
    [x: string]: any;
    userId: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface AADUser {
    id_token: string;
    provider_name: string;
    user_claims: Array<{
        typ: string;
        val: string;
    }>;
    user_id: string;
}