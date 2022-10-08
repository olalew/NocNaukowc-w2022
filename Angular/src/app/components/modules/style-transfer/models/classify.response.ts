export class ClassifyResponseModel {
    public explanations: LimeResult[] | undefined;
    public original: string = "";
}

export class LimeResult {
    public image1: string = ""; 
    public image2: string = "";
    public image3: string = "";
    public label: string = "";
    public heatmap: string = "";
}
