export class ClassifyRequestModel {
    public content: string | undefined;
    public mimeType: string | undefined;

    constructor(_content: string) {
        this.content = _content;
    }
}