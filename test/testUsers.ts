import { TestUser } from "./playwright/testUser"

export class TestUsers {

    public customer2: TestUser

    constructor() {

        if (process.env.USERS_CUSTOMER2_EMAIL) {
            this.customer2 = new TestUser(
                'Jack',
                'Howe',
                process.env.USERS_CUSTOMER2_EMAIL,
                process.env.USERS_CUSTOMER2_PASSWORD,
                '01KCKTT6TG9XGXA7W7BY0J9P8Z'
            )
        }
    }
}