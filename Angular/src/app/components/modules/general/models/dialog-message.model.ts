export class DialogMessage {
    public loader: boolean = false;

    constructor(public title: string, public message: string, public extraData: any = null, public yesNoBtns = false) { }
}