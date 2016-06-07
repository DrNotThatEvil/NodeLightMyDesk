module.exports = (RGBControl) => {
    RGBControl.registerProcessor('fadeout', (c, arg, job, done) => {
        (function o(d, t, color) {
            setTimeout(function () {
                let curColor = c.filterPixel(color, (t/100));
                let leds = [];
                for(let i=0; i<c.getNumLeds(); i++)
                {
                    leds.push(curColor[0], curColor[1], curColor[2]);
                }

                console.log('t2: ', t, curColor);

                c.setColor(curColor);
                c.writeStream(leds);


                if ((--t) > 0)
                {
                    job.data.type = 'fadeout';
                    job.data.targetColor = color;
                    job.data.curColor = curColor;
                    job.data.progress = (100-t);
                    job.data.totalTime = (d*100);
                    job.progress((100-t));
                    o(d, t, color);
                }
                else
                {
                    console.log('FADEOUT: DONE! RESOLVE!')
                    done();
                }
            }, d);
        })(arg.animationDelay, 100, arg.color);


        //done(null, true);
    });
};
