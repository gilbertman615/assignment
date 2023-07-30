export class RegexValidation {

    static isValidEmail(email: string) {
        const emailRegex = new RegExp('[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}');
        return emailRegex.test(email);
    }

    static isValidPassword(password: string) {
        const passwordRegex = new RegExp('^((?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]))(?=.{6,})')
        return passwordRegex.test(password);
    }

    static isValidUUID(uuid: string) {
        const uuidPattern = "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
        const uuidRegex = new RegExp(uuidPattern, "i");
        return uuidRegex.test(uuid);
    }

}