module.exports = (RGBControl) => {
    RGBControl.registerProcessor('rave', (c, arg) => {
        (function o(t, d, color){
            setTimeout(function () {
                let curColor = c.filterPixel([
                    (Math.random() * 255),
                    (Math.random() * 255),
                    (Math.random() * 255)
                ], 1);
                c.setColor(curColor); // Setting the color must be done before translation

                curColor = c.translateColor(curColor);

                let leds = [];
                for(let i=0; i<c.getNumLeds(); i++)
                {
                    leds.push(curColor[0], curColor[1], curColor[2]);
                }

                c.writeStream(leds);

                if (--t)
                {
                    //c.progressJob(((150-t)/150)*100);
                    o(t, d, color);
                }
                else
                {
                    c.setColor(color);
                    let backColor = c.translateColor(color);

                    let leds = [];
                    for(let i=0; i<c.getNumLeds(); i++)
                    {
                        leds.push(backColor[0], backColor[1], backColor[2]);
                    }

                    c.nextJob();
                }
            }, d);
        })(150, arg.duration/150, c.getColor());

        //done(null, true);
    });
};
