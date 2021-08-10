class Payload {
    isEmpty: boolean;
    isFrozen: boolean;
    constructor(isEmpty = true, isFrozen = false) {
        this.isEmpty = isEmpty;
        this.isFrozen = isFrozen;
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