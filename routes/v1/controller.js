class ContentController {
    constructor() {
        // this.demoPAGE = new DemoPageService();
    }

    health = (req, res) => {
        return res.status(200).json({ statusCode: 200, data: "ok" });
    };
   
}

module.exports = ContentController;
