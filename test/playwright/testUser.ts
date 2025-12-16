export class TestUser {
    readonly displayName

    constructor(
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly password: string,
        readonly userId: string,
        readonly locale: "en" | "de" = "en"
        ) {   
        this.displayName = `${firstName} ${lastName}`
    }
}