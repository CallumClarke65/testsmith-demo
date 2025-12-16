export class TestUser {
    readonly displayName

    constructor(
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly password: string,
        readonly userId: string
        ) {   
        this.displayName = `${firstName} ${lastName}`
    }
}