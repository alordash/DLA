class Payload {
    isEmpty: boolean;
    constructor(isEmpty = true) {
        this.isEmpty = isEmpty;
    }

    Copy() {
        return new Payload(this.isEmpty);
    }
    
    static Random() {
        return new Payload(Math.random() > 0.5 ? true : false);
    }
    
    private static _Default = new Payload(true);

    static get Default(): Payload {
        return Payload._Default.Copy();
    }
}