module.exports = (RGBControl) => {
    RGBControl.registerProcessor('fadein', (c, arg, done, job) => {
        (function o(d, t, color, done){
            setTimeout(function () {
                let curColor = c.filterPixel(color, (100-t)/100);
                let leds = [];
                for(let i=0; i<c.getNumLeds(); i++)
                {
                    leds.push(curColor[0], curColor[1], curColor[2]);
                }
                c.writeStream(leds);

                if (--t)
                {
                    job.data.type = 'fadein';
                    job.data.targetColor = color;
                    job.data.curColor = curColor;
                    job.data.progress = (100-t);
                    job.data.totalTime = (d*100);
                    
                    job.progress((100-t));
                    o(d, t, color, done);
                }
                else
                {
                    done(null, true);
                }
            }, d);
        })(arg.delay, 100, arg.color, done, job);

        //done(null, true);
    });
};
